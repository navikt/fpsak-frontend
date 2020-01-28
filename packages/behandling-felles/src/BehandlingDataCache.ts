// TODO (TOR) Fjern denne når Klage, Innsyn og Tilbakekreving er skrive om

class BehandlingDataCache {
  currentVersion: number;

  previousVersion: number;

  currentDataNames: [string?] = [];

  currentData?: {} = undefined;

  previousData?: {} = undefined;

  getCurrentVersion = () => this.currentVersion

  setVersion = (behandlingVersion) => {
    if (behandlingVersion <= this.currentVersion) {
      throw new Error('New version must be higher than previous version');
    }
    this.previousVersion = this.currentVersion;
    this.currentVersion = behandlingVersion;
    this.previousData = this.currentData;
    this.currentDataNames = [];
  }

  hasLatestDataFor = (name) => this.currentDataNames.some((n) => n === name)

  hasLatestDataForAll = (names) => names.every((n) => this.currentDataNames.some((cn) => n === cn))

  startFetch = (behandlingVersjon, name) => {
    if (behandlingVersjon !== this.currentVersion) {
      throw new Error('Version must be equal current version');
    }
    this.currentDataNames.push(name);
  }

  setData = (behandlingVersjon, name, data) => {
    if (behandlingVersjon !== this.currentVersion) {
      throw new Error('Version must be equal current version');
    }
    this.currentData = {
      ...this.currentData,
      [name]: data,
    };
  }

  hasPreviousData = () => !!this.previousData

  getCurrentData = () => this.currentData

  getPreviousData = () => this.previousData
}

export default BehandlingDataCache;

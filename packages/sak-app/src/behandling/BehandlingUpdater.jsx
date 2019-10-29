// TODO Denne skal vekk
/**
 * Denne brukers til å utføre operasjoner på behandling utenfor behandlingskonteksten.
 */
class BehandlingUpdater {
    setUpdater = (updater) => {
      this.updater = updater;
    }

    reset = () => {
      this.updater = undefined;
    }

    changeBehandlendeEnhet = (dispatch, params) => dispatch(this.updater.changeBehandlendeEnhet()(params))

    updateBehandling = (dispatch, behandlingIdentifier) => dispatch(this.updater.updateBehandling()(behandlingIdentifier))

    resetBehandling = (dispatch) => (this.updater ? dispatch(this.updater.resetBehandling()) : undefined)

    setBehandlingResult = (dispatch, payload, params, options) => dispatch(this.updater.setBehandlingResult()(payload, params, options))
}

export default new BehandlingUpdater();

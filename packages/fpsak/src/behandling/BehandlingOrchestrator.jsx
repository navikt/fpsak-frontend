import errorHandler from '@fpsak-frontend/error-api-redux';

import fpsakApi from 'data/fpsakApi';

import ApplicationContextPath from './ApplicationContextPath';

const behandlingerRestApis = {
  [ApplicationContextPath.FPSAK]: fpsakApi.BEHANDLINGER_FPSAK,
  [ApplicationContextPath.FPTILBAKE]: fpsakApi.BEHANDLINGER_FPTILBAKE,
};
const documentRestApis = {
  [ApplicationContextPath.FPSAK]: fpsakApi.ALL_DOCUMENTS_FPSAK,
  [ApplicationContextPath.FPTILBAKE]: fpsakApi.ALL_DOCUMENTS_FPTILBAKE,
};
const historyRestApis = {
  [ApplicationContextPath.FPSAK]: fpsakApi.HISTORY_FPSAK,
  [ApplicationContextPath.FPTILBAKE]: fpsakApi.HISTORY_FPTILBAKE,
};

/**
 * BehandlingOrchestrator
 *
 * Denne brukes for å hente behandlinger, historikk og dokumenter for fpsak og fptilbakekreving
 */
class BehandlingOrchestrator {
    allContextPaths = [];

    disabledContextPaths = [];

    notAvailableContextPaths = [];

    constructor(allApplicationContextPaths) {
      this.allContextPaths = allApplicationContextPaths;
    }

    disableTilbakekreving = () => {
      const index = this.disabledContextPaths.indexOf(ApplicationContextPath.FPTILBAKE);
      if (index === -1) {
        this.disabledContextPaths.push(ApplicationContextPath.FPTILBAKE);
      }
    }

    // Kun for test
    reset = () => {
      this.disabledContextPaths = [];
      this.notAvailableContextPaths = [];
    }

    getEnabledContextPaths = () => this.allContextPaths.filter(as => !this.disabledContextPaths.some(ds => ds === as));

    getActiveContextPaths = () => this.getEnabledContextPaths().filter(as => !this.notAvailableContextPaths.some(ds => ds === as));

    fetchBehandlinger = async (saksnummer, dispatch) => {
      let results = [];
      const activeContextPaths = this.getActiveContextPaths();

      for (let i = 0; i < activeContextPaths.length; i += 1) {
        try {
          const behandlingApi = behandlingerRestApis[activeContextPaths[i]];
          // eslint-disable-next-line no-await-in-loop
          const res = await dispatch(behandlingApi.makeRestApiRequest()({ saksnummer }, { keepData: true }));
          results = results.concat(res.payload);
        } catch (error) {
          // TODO (TOR) Ikkje hardkoda feilmelding. Fiksar når ein etter kvart kjem til feilhåndtering for tilbakekreving
          dispatch(errorHandler.getErrorActionCreator()(`Kunne ikke hente behandlinger for ${activeContextPaths[i]}`));
          this.notAvailableContextPaths.push(activeContextPaths[i]);
        }
      }

      return Promise.resolve({ payload: results });
    }

    fetchBehandlingSupportInfo = async (saksnummer, dispatch) => {
      const results = [];
      const activeContextPaths = this.getActiveContextPaths();
      for (let i = 0; i < activeContextPaths.length; i += 1) {
        // TODO (TOR) Enten lag feilhåndtering eller bytt til Promise.all
        const documentApi = documentRestApis[activeContextPaths[i]];
        // eslint-disable-next-line no-await-in-loop
        results.push(await dispatch(documentApi.makeRestApiRequest()({ saksnummer }, { keepData: true })));

        const historyApi = historyRestApis[activeContextPaths[i]];
        // eslint-disable-next-line no-await-in-loop
        results.push(await dispatch(historyApi.makeRestApiRequest()({ saksnummer }, { keepData: true })));
      }
      return Promise.resolve(results);
    }

    resetRestApis = (dispatch) => {
      this.getActiveContextPaths().forEach((contextPath) => {
        dispatch(behandlingerRestApis[contextPath].resetRestApi()());
        dispatch(documentRestApis[contextPath].resetRestApi()());
        dispatch(historyRestApis[contextPath].resetRestApi()());
      });
    }

    getRestApisFinished = (state) => {
      const finished = [];
      this.getActiveContextPaths().forEach((contextPath) => {
        finished.push(behandlingerRestApis[contextPath].getRestApiFinished()(state));
        finished.push(documentRestApis[contextPath].getRestApiFinished()(state));
        finished.push(historyRestApis[contextPath].getRestApiFinished()(state));
      });
      return finished;
    }

    getRestApisErrors = (state) => {
      const errors = [];
      this.getActiveContextPaths().forEach((contextPath) => {
        errors.push(behandlingerRestApis[contextPath].getRestApiError()(state));
        errors.push(documentRestApis[contextPath].getRestApiError()(state));
        errors.push(historyRestApis[contextPath].getRestApiError()(state));
      });
      return errors;
    }

    getRestApisData = (state) => {
      const data = [];
      this.getActiveContextPaths().forEach((contextPath) => {
        data.push(behandlingerRestApis[contextPath].getRestApiData()(state));
        data.push(documentRestApis[contextPath].getRestApiData()(state));
        data.push(historyRestApis[contextPath].getRestApiData()(state));
      });
      return data;
    }
}

const behandlingOrchestrator = new BehandlingOrchestrator(Object.values(ApplicationContextPath));
export default behandlingOrchestrator;

import { ReduxEvents, ReduxRestApiBuilder, RestApiConfigBuilder } from '@fpsak-frontend/rest-api-redux';
import errorHandler from '@fpsak-frontend/error-api-redux';
import { reducerRegistry, setRequestPollingMessage } from '@fpsak-frontend/fp-felles';

export const InnsynBehandlingApiKeys = {
  BEHANDLING_INNSYN: 'BEHANDLING_INNSYN',
  AKSJONSPUNKTER: 'AKSJONSPUNKTER',
  VILKAR: 'VILKAR',
  INNSYN: 'INNSYN',
  BEHANDLING_NY_BEHANDLENDE_ENHET: 'BEHANDLING_NY_BEHANDLENDE_ENHET',
  HENLEGG_BEHANDLING: 'HENLEGG_BEHANDLING',
  RESUME_BEHANDLING: 'RESUME_BEHANDLING',
  BEHANDLING_ON_HOLD: 'BEHANDLING_ON_HOLD',
  UPDATE_ON_HOLD: 'UPDATE_ON_HOLD',
  SAVE_AKSJONSPUNKT: 'SAVE_AKSJONSPUNKT',
  PREVIEW_MESSAGE: 'PREVIEW_MESSAGE',
  INNSYN_DOKUMENTER: 'INNSYN_DOKUMENTER',
};

const endpoints = new RestApiConfigBuilder()
  .withAsyncPost('/fpsak/api/behandlinger', InnsynBehandlingApiKeys.BEHANDLING_INNSYN, { fetchLinkDataAutomatically: false })
  .withInjectedPath('aksjonspunkter', InnsynBehandlingApiKeys.AKSJONSPUNKTER)
  .withInjectedPath('vilkar', InnsynBehandlingApiKeys.VILKAR)
  .withInjectedPath('innsyn', InnsynBehandlingApiKeys.INNSYN)

  .withPost('/fpsak/api/behandlinger/bytt-enhet', InnsynBehandlingApiKeys.BEHANDLING_NY_BEHANDLENDE_ENHET)
  .withPost('/fpsak/api/behandlinger/henlegg', InnsynBehandlingApiKeys.HENLEGG_BEHANDLING)
  .withAsyncPost('/fpsak/api/behandlinger/gjenoppta', InnsynBehandlingApiKeys.RESUME_BEHANDLING, {
    storeResultKey: InnsynBehandlingApiKeys.BEHANDLING_INNSYN,
  })
  .withPost('/fpsak/api/behandlinger/sett-pa-vent', InnsynBehandlingApiKeys.BEHANDLING_ON_HOLD)
  .withGet('/fpsak/api/dokument/hent-dokumentliste', InnsynBehandlingApiKeys.INNSYN_DOKUMENTER)

/*
  .withInjectedPath('bytt-behandlende-enhet', InnsynBehandlingApiKeys.BEHANDLING_NY_BEHANDLENDE_ENHET)
  .withInjectedPath('henlegg-behandling', InnsynBehandlingApiKeys.HENLEGG_BEHANDLING)
  .withInjectedPath('gjenoppta-behandling', InnsynBehandlingApiKeys.RESUME_BEHANDLING)
  .withInjectedPath('sett-behandling-pa-vent', InnsynBehandlingApiKeys.BEHANDLING_ON_HOLD)
  */

  .withPost('/fpsak/api/behandlinger/endre-pa-vent', InnsynBehandlingApiKeys.UPDATE_ON_HOLD)
  .withAsyncPost('/fpsak/api/behandling/aksjonspunkt', InnsynBehandlingApiKeys.SAVE_AKSJONSPUNKT, {
    storeResultKey: InnsynBehandlingApiKeys.BEHANDLING_INNSYN,
  })
  // TODO (TOR) Bør få lenke fra backend og så åpne blob (Flytt open blob ut av rest-apis)
  .withPostAndOpenBlob('/fpformidling/api/brev/forhaandsvis', InnsynBehandlingApiKeys.PREVIEW_MESSAGE)
  .build();

const reducerName = 'dataContextInnsynBehandling';

export const reduxRestApi = new ReduxRestApiBuilder(endpoints, reducerName)
  .withReduxEvents(new ReduxEvents()
    .withErrorActionCreator(errorHandler.getErrorActionCreator())
    .withPollingMessageActionCreator(setRequestPollingMessage))
  .build();

reducerRegistry.register(reducerName, reduxRestApi.getDataReducer());

const innsynBehandlingApi = reduxRestApi.getEndpointApi();
export default innsynBehandlingApi;

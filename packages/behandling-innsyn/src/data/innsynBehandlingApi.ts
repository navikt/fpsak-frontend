import {
  reducerRegistry, setRequestPollingMessage, ReduxEvents, ReduxRestApiBuilder, RestApiConfigBuilder,
} from '@fpsak-frontend/rest-api-redux';
import errorHandler from '@fpsak-frontend/error-api-redux';

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
  .withAsyncPost('/fpsak/api/behandlinger', InnsynBehandlingApiKeys.BEHANDLING_INNSYN)

  // behandlingsdata
  .withRel('aksjonspunkter', InnsynBehandlingApiKeys.AKSJONSPUNKTER)
  .withRel('vilkar', InnsynBehandlingApiKeys.VILKAR)
  .withRel('innsyn', InnsynBehandlingApiKeys.INNSYN)
  .withRel('dokumenter', InnsynBehandlingApiKeys.INNSYN_DOKUMENTER)

  // operasjoner
  .withRel('bytt-behandlende-enhet', InnsynBehandlingApiKeys.BEHANDLING_NY_BEHANDLENDE_ENHET)
  .withRel('henlegg-behandling', InnsynBehandlingApiKeys.HENLEGG_BEHANDLING)
  .withRel('gjenoppta-behandling', InnsynBehandlingApiKeys.RESUME_BEHANDLING, { saveResponseIn: InnsynBehandlingApiKeys.BEHANDLING_INNSYN })
  .withRel('sett-behandling-pa-vent', InnsynBehandlingApiKeys.BEHANDLING_ON_HOLD)
  .withRel('endre-pa-vent', InnsynBehandlingApiKeys.UPDATE_ON_HOLD)
  .withRel('lagre-aksjonspunkter', InnsynBehandlingApiKeys.SAVE_AKSJONSPUNKT, { saveResponseIn: InnsynBehandlingApiKeys.BEHANDLING_INNSYN })

  /* FPFORMIDLING */
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

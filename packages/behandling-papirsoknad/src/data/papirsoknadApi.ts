import {
  reducerRegistry, setRequestPollingMessage, ReduxEvents, ReduxRestApiBuilder, RestApiConfigBuilder,
} from '@fpsak-frontend/rest-api-redux';
import errorHandler from '@fpsak-frontend/error-api-redux';

export const PapirsoknadApiKeys = {
  BEHANDLING_PAPIRSOKNAD: 'BEHANDLING_PAPIRSOKNAD',
  AKSJONSPUNKTER: 'AKSJONSPUNKTER',
  BEHANDLING_NY_BEHANDLENDE_ENHET: 'BEHANDLING_NY_BEHANDLENDE_ENHET',
  HENLEGG_BEHANDLING: 'HENLEGG_BEHANDLING',
  RESUME_BEHANDLING: 'RESUME_BEHANDLING',
  BEHANDLING_ON_HOLD: 'BEHANDLING_ON_HOLD',
  UPDATE_ON_HOLD: 'UPDATE_ON_HOLD',
  SAVE_AKSJONSPUNKT: 'SAVE_AKSJONSPUNKT',
};

const endpoints = new RestApiConfigBuilder()
  .withAsyncPost('/fpsak/api/behandlinger', PapirsoknadApiKeys.BEHANDLING_PAPIRSOKNAD)

  // behandlingsdata
  .withRel('aksjonspunkter', PapirsoknadApiKeys.AKSJONSPUNKTER)

  // operasjoner
  .withRel('bytt-behandlende-enhet', PapirsoknadApiKeys.BEHANDLING_NY_BEHANDLENDE_ENHET)
  .withRel('henlegg-behandling', PapirsoknadApiKeys.HENLEGG_BEHANDLING)
  .withRel('gjenoppta-behandling', PapirsoknadApiKeys.RESUME_BEHANDLING, { saveResponseIn: PapirsoknadApiKeys.BEHANDLING_PAPIRSOKNAD })
  .withRel('sett-behandling-pa-vent', PapirsoknadApiKeys.BEHANDLING_ON_HOLD)
  .withRel('endre-pa-vent', PapirsoknadApiKeys.UPDATE_ON_HOLD)
  .withRel('lagre-aksjonspunkter', PapirsoknadApiKeys.SAVE_AKSJONSPUNKT)

  .build();

const reducerName = 'dataContextPapirsoknad';

export const reduxRestApi = new ReduxRestApiBuilder(endpoints, reducerName)
  .withReduxEvents(new ReduxEvents()
    .withErrorActionCreator(errorHandler.getErrorActionCreator())
    .withPollingMessageActionCreator(setRequestPollingMessage))
  .build();

reducerRegistry.register(reducerName, reduxRestApi.getDataReducer());

const papirsoknadApi = reduxRestApi.getEndpointApi();
export default papirsoknadApi;

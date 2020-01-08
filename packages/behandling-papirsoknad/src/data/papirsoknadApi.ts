import { ReduxEvents, ReduxRestApiBuilder, RestApiConfigBuilder } from '@fpsak-frontend/rest-api-redux';
import errorHandler from '@fpsak-frontend/error-api-redux';
import { reducerRegistry, setRequestPollingMessage } from '@fpsak-frontend/fp-felles';

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
  .withAsyncPost('/fpsak/api/behandlinger', PapirsoknadApiKeys.BEHANDLING_PAPIRSOKNAD, { fetchLinkDataAutomatically: false })
  .withInjectedPath('aksjonspunkter', PapirsoknadApiKeys.AKSJONSPUNKTER)

  .withPost('/fpsak/api/behandlinger/bytt-enhet', PapirsoknadApiKeys.BEHANDLING_NY_BEHANDLENDE_ENHET)
  .withPost('/fpsak/api/behandlinger/henlegg', PapirsoknadApiKeys.HENLEGG_BEHANDLING)
  .withAsyncPost('/fpsak/api/behandlinger/gjenoppta', PapirsoknadApiKeys.RESUME_BEHANDLING, {
    storeResultKey: PapirsoknadApiKeys.BEHANDLING_PAPIRSOKNAD,
  })
  .withPost('/fpsak/api/behandlinger/sett-pa-vent', PapirsoknadApiKeys.BEHANDLING_ON_HOLD)
  .withPost('/fpsak/api/behandlinger/endre-pa-vent', PapirsoknadApiKeys.UPDATE_ON_HOLD)

  .withAsyncPost('/fpsak/api/behandling/aksjonspunkt', PapirsoknadApiKeys.SAVE_AKSJONSPUNKT)
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

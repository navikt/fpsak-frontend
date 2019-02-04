import {
  RestApiConfigBuilder, ReduxRestApiBuilder, ReduxEvents,
} from '@fpsak-frontend/rest-api-redux';
import errorHandler from '@fpsak-frontend/error-api-redux';

import { setRequestPollingMessage } from 'app/pollingMessageDuck';
import reducerRegistry from '../../ReducerRegistry';

export const PapirsoknadApiKeys = {
  BEHANDLING: 'BEHANDLING',
  UPDATE_ON_HOLD: 'UPDATE_ON_HOLD',
  BEHANDLING_ON_HOLD: 'BEHANDLING_ON_HOLD',
  RESUME_BEHANDLING: 'RESUME_BEHANDLING',
  HENLEGG_BEHANDLING: 'HENLEGG_BEHANDLING',
  NY_BEHANDLENDE_ENHET: 'NY_BEHANDLENDE_ENHET',
  SAVE_AKSJONSPUNKT: 'SAVE_AKSJONSPUNKT',
  PREVIEW_MESSAGE: 'PREVIEW_MESSAGE',
};

const endpoints = new RestApiConfigBuilder()
  .withAsyncPost('/api/behandlinger', PapirsoknadApiKeys.BEHANDLING)
  .withPost('/api/behandlinger/endre-pa-vent', PapirsoknadApiKeys.UPDATE_ON_HOLD)
  .withPost('/api/behandlinger/sett-pa-vent', PapirsoknadApiKeys.BEHANDLING_ON_HOLD)
  .withPost('/api/behandlinger/bytt-enhet', PapirsoknadApiKeys.NY_BEHANDLENDE_ENHET)
  .withAsyncPost('/api/behandlinger/gjenoppta', PapirsoknadApiKeys.RESUME_BEHANDLING)
  .withPost('/api/behandlinger/henlegg', PapirsoknadApiKeys.HENLEGG_BEHANDLING)

  /* /api/behandling */
  .withAsyncPost('/api/behandling/aksjonspunkt', PapirsoknadApiKeys.SAVE_AKSJONSPUNKT)

  /* /api/brev */
  .withPostAndOpenBlob('/api/brev/forhandsvis', PapirsoknadApiKeys.PREVIEW_MESSAGE)

  .build();

const reducerName = 'dataContextPapirsoknad';

const reduxRestApi = new ReduxRestApiBuilder(endpoints, reducerName)
  .withContextPath('fpsak')
  .withReduxEvents(new ReduxEvents()
    .withErrorActionCreator(errorHandler.getErrorActionCreator())
    .withPollingMessageActionCreator(setRequestPollingMessage))
  .build();

reducerRegistry.register(reducerName, reduxRestApi.getDataReducer());

const papirsoknadApi = reduxRestApi.getEndpointApi();
export default papirsoknadApi;
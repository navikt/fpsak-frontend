import {
  getHttpClientApi, getRestApiBuilder, initReduxRestApi, ReduxEvents,
} from '@fpsak-frontend/rest-api-redux';
import errorHandler from '@fpsak-frontend/error-api-redux';

import { setRequestPollingMessage } from 'app/pollingMessageDuck';
import reducerRegistry from '../ReducerRegistry';

export const TilbakekrevingBehandlingApiKeys = {
  BEHANDLING: 'BEHANDLING',
  ORIGINAL_BEHANDLING: 'ORIGINAL_BEHANDLING',
  UPDATE_ON_HOLD: 'UPDATE_ON_HOLD',
  SAVE_AKSJONSPUNKT: 'SAVE_AKSJONSPUNKT',
  SAVE_OVERSTYRT_AKSJONSPUNKT: 'SAVE_OVERSTYRT_AKSJONSPUNKT',
};

const httpClientApi = getHttpClientApi();

const endpoints = getRestApiBuilder(httpClientApi)
  .withAsyncPost('/api/behandlinger', TilbakekrevingBehandlingApiKeys.BEHANDLING)
  .withAsyncPost('/api/behandlinger', TilbakekrevingBehandlingApiKeys.ORIGINAL_BEHANDLING)
  .withPost('/api/behandlinger/endre-pa-vent', TilbakekrevingBehandlingApiKeys.UPDATE_ON_HOLD)

  /* /api/behandling */
  .withAsyncPost('/api/behandling/aksjonspunkt', TilbakekrevingBehandlingApiKeys.SAVE_AKSJONSPUNKT)
  .withAsyncPost('/api/behandling/aksjonspunkt/overstyr', TilbakekrevingBehandlingApiKeys.SAVE_OVERSTYRT_AKSJONSPUNKT)

  .build();

reducerRegistry.register(errorHandler.getErrorReducerName(), errorHandler.getErrorReducer());

const reduxEvents = new ReduxEvents()
  .withErrorActionCreator(errorHandler.getErrorActionCreator())
  .withPollingMessageActionCreator(setRequestPollingMessage);

const reducerName = 'dataContextTilbakekrevingBehandling';
const tilbakekrevingBehandlingApi = initReduxRestApi(httpClientApi, 'fptilbake', endpoints, reducerName, reduxEvents);
reducerRegistry.register(reducerName, tilbakekrevingBehandlingApi.getDataReducer());

export default tilbakekrevingBehandlingApi;

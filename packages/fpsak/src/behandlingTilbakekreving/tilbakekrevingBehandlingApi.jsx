import {
  RestApiConfigBuilder, ReduxRestApiBuilder, ReduxEvents,
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

const endpoints = new RestApiConfigBuilder()
  .withAsyncPost('/api/behandlinger', TilbakekrevingBehandlingApiKeys.BEHANDLING)
  .withAsyncPost('/api/behandlinger', TilbakekrevingBehandlingApiKeys.ORIGINAL_BEHANDLING)
  .withPost('/api/behandlinger/endre-pa-vent', TilbakekrevingBehandlingApiKeys.UPDATE_ON_HOLD)

  /* /api/behandling */
  .withAsyncPost('/api/behandling/aksjonspunkt', TilbakekrevingBehandlingApiKeys.SAVE_AKSJONSPUNKT)
  .withAsyncPost('/api/behandling/aksjonspunkt/overstyr', TilbakekrevingBehandlingApiKeys.SAVE_OVERSTYRT_AKSJONSPUNKT)

  .build();

const reducerName = 'dataContextTilbakekrevingBehandling';

const reduxRestApi = new ReduxRestApiBuilder(endpoints, reducerName)
  .withContextPath('fptilbake')
  .withReduxEvents(new ReduxEvents()
    .withErrorActionCreator(errorHandler.getErrorActionCreator())
    .withPollingMessageActionCreator(setRequestPollingMessage))
  .build();

reducerRegistry.register(reducerName, reduxRestApi.getDataReducer());

const tilbakekrevingBehandlingApi = reduxRestApi.getEndpointApi();
export default tilbakekrevingBehandlingApi;

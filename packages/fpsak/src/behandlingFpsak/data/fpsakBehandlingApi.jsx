import {
  RestApiConfigBuilder, ReduxRestApiBuilder, ReduxEvents,
} from '@fpsak-frontend/rest-api-redux';
import errorHandler from '@fpsak-frontend/error-api-redux';

import { setRequestPollingMessage } from 'app/pollingMessageDuck';
import reducerRegistry from '../../ReducerRegistry';

export const BehandlingFpsakApiKeys = {
  BEHANDLING: 'BEHANDLING',
  ORIGINAL_BEHANDLING: 'ORIGINAL_BEHANDLING',
  UPDATE_ON_HOLD: 'UPDATE_ON_HOLD',
  SAVE_AKSJONSPUNKT: 'SAVE_AKSJONSPUNKT',
  SAVE_OVERSTYRT_AKSJONSPUNKT: 'SAVE_OVERSTYRT_AKSJONSPUNKT',
  PREVIEW_MESSAGE: 'PREVIEW_MESSAGE',
  PREVIEW_MESSAGE_KLAGE: 'PREVIEW_MESSAGE_KLAGE',
  SAVE_KLAGE_VURDERING: 'SAVE_KLAGE_VURDERING',
  SAVE_REOPEN_KLAGE_VURDERING: 'SAVE_REOPEN_KLAGE_VURDERING',
};

const endpoints = new RestApiConfigBuilder()
/* /api */

  /* /api/behandlinger */
  .withAsyncPost('/api/behandlinger', BehandlingFpsakApiKeys.BEHANDLING)
  .withAsyncPost('/api/behandlinger', BehandlingFpsakApiKeys.ORIGINAL_BEHANDLING)
  .withPost('/api/behandlinger/endre-pa-vent', BehandlingFpsakApiKeys.UPDATE_ON_HOLD)

  /* /api/behandling */
  .withAsyncPost('/api/behandling/aksjonspunkt', BehandlingFpsakApiKeys.SAVE_AKSJONSPUNKT)
  .withAsyncPost('/api/behandling/aksjonspunkt/overstyr', BehandlingFpsakApiKeys.SAVE_OVERSTYRT_AKSJONSPUNKT)

  /* /api/klage */
  .withAsyncPost('/api/behandling/klage/mellomlagre-klage', BehandlingFpsakApiKeys.SAVE_KLAGE_VURDERING)
  .withAsyncPost('/api/behandling/klage/mellomlagre-gjennapne-klage', BehandlingFpsakApiKeys.SAVE_REOPEN_KLAGE_VURDERING)

  /* /api/brev */
  .withPostAndOpenBlob('/api/brev/forhandsvis', BehandlingFpsakApiKeys.PREVIEW_MESSAGE)
  .withPostAndOpenBlob('/api/brev/forhandsvis-klage', BehandlingFpsakApiKeys.PREVIEW_MESSAGE_KLAGE)
  .build();

const reducerName = 'dataContextFpsakBehandling';

export const reduxRestApi = new ReduxRestApiBuilder(endpoints, reducerName)
  .withContextPath('fpsak')
  .withReduxEvents(new ReduxEvents()
    .withErrorActionCreator(errorHandler.getErrorActionCreator())
    .withPollingMessageActionCreator(setRequestPollingMessage))
  .build();

reducerRegistry.register(reducerName, reduxRestApi.getDataReducer());

const fpsakBehandlingApi = reduxRestApi.getEndpointApi();
export default fpsakBehandlingApi;

/* @flow */
import { getHttpClientApi, getRestApiBuilder, initRestApi } from 'data/rest/restApi';
import reducerRegistry from '../../ReducerRegistry';

export const BehandlingFpsakApiKeys = {
  BEHANDLING: 'BEHANDLING',
  ORIGINAL_BEHANDLING: 'ORIGINAL_BEHANDLING',
  UPDATE_ON_HOLD: 'UPDATE_ON_HOLD',
  SAVE_AKSJONSPUNKT: 'SAVE_AKSJONSPUNKT',
  SAVE_OVERSTYRT_AKSJONSPUNKT: 'SAVE_OVERSTYRT_AKSJONSPUNKT',
  PREVIEW_MESSAGE: 'PREVIEW_MESSAGE',
  PREVIEW_MESSAGE_KLAGE: 'PREVIEW_MESSAGE_KLAGE',
};

const httpClientApi = getHttpClientApi();
const endpoints = getRestApiBuilder(httpClientApi)
/* /api */

  /* /api/behandlinger */
  .withAsyncPost('/api/behandlinger', BehandlingFpsakApiKeys.BEHANDLING)
  .withAsyncPost('/api/behandlinger', BehandlingFpsakApiKeys.ORIGINAL_BEHANDLING)
  .withPost('/api/behandlinger/endre-pa-vent', BehandlingFpsakApiKeys.UPDATE_ON_HOLD)

  /* /api/behandling */
  .withAsyncPost('/api/behandling/aksjonspunkt', BehandlingFpsakApiKeys.SAVE_AKSJONSPUNKT)
  .withAsyncPost('/api/behandling/aksjonspunkt/overstyr', BehandlingFpsakApiKeys.SAVE_OVERSTYRT_AKSJONSPUNKT)

  /* /api/brev */
  .withPostAndOpenBlob('/api/brev/forhandsvis', BehandlingFpsakApiKeys.PREVIEW_MESSAGE)
  .withPostAndOpenBlob('/api/brev/forhandsvis-klage', BehandlingFpsakApiKeys.PREVIEW_MESSAGE_KLAGE)
  .build();

const fpsakBehandlingApi = initRestApi(httpClientApi, 'fpsak', endpoints, 'dataContextFpsakBehandling', reducerRegistry);
export default fpsakBehandlingApi;

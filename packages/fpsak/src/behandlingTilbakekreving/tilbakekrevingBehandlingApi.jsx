/* @flow */
import { getHttpClientApi, getRestApiBuilder, initRestApi } from 'data/rest/restApi';

export const TilbakekrevingBehandlingApi = {
  BEHANDLING: 'BEHANDLING',
  ORIGINAL_BEHANDLING: 'ORIGINAL_BEHANDLING',
  UPDATE_ON_HOLD: 'UPDATE_ON_HOLD',
  SAVE_AKSJONSPUNKT: 'SAVE_AKSJONSPUNKT',
  SAVE_OVERSTYRT_AKSJONSPUNKT: 'SAVE_OVERSTYRT_AKSJONSPUNKT',
};

const httpClientApi = getHttpClientApi();

const endpoints = getRestApiBuilder(httpClientApi)
  .withAsyncPost('/api/behandlinger', TilbakekrevingBehandlingApi.BEHANDLING)
  .withAsyncPost('/api/behandlinger', TilbakekrevingBehandlingApi.ORIGINAL_BEHANDLING)
  .withPost('/api/behandlinger/endre-pa-vent', TilbakekrevingBehandlingApi.UPDATE_ON_HOLD)

  /* /api/behandling */
  .withAsyncPost('/api/behandling/aksjonspunkt', TilbakekrevingBehandlingApi.SAVE_AKSJONSPUNKT)
  .withAsyncPost('/api/behandling/aksjonspunkt/overstyr', TilbakekrevingBehandlingApi.SAVE_OVERSTYRT_AKSJONSPUNKT)

  .build();

const tilbakekrevingBehandlingApi = initRestApi(httpClientApi, 'fptilbake', endpoints, 'dataTilbakekrevingBehandlingContext');
export default tilbakekrevingBehandlingApi;

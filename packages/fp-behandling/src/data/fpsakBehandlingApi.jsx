import {
  RestApiConfigBuilder, ReduxRestApiBuilder, ReduxEvents,
} from '@fpsak-frontend/rest-api-redux';
import errorHandler from '@fpsak-frontend/error-api-redux';
import { reducerRegistry, setRequestPollingMessage } from '@fpsak-frontend/fp-felles';

export const BehandlingFpsakApiKeys = {
  BEHANDLING: 'BEHANDLING',
  ORIGINAL_BEHANDLING: 'ORIGINAL_BEHANDLING',
  UPDATE_ON_HOLD: 'UPDATE_ON_HOLD',
  BEHANDLING_ON_HOLD: 'BEHANDLING_ON_HOLD',
  RESUME_BEHANDLING: 'RESUME_BEHANDLING',
  OPEN_BEHANDLING_FOR_CHANGES: 'OPEN_BEHANDLING_FOR_CHANGES',
  HENLEGG_BEHANDLING: 'HENLEGG_BEHANDLING',
  NY_BEHANDLENDE_ENHET: 'NY_BEHANDLENDE_ENHET',
  SAVE_AKSJONSPUNKT: 'SAVE_AKSJONSPUNKT',
  SAVE_OVERSTYRT_AKSJONSPUNKT: 'SAVE_OVERSTYRT_AKSJONSPUNKT',
  PREVIEW_MESSAGE: 'PREVIEW_MESSAGE',
  SUBMIT_MESSAGE: 'SUBMIT_MESSAGE',
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
  .withPost('/api/behandlinger/sett-pa-vent', BehandlingFpsakApiKeys.BEHANDLING_ON_HOLD)
  .withPost('/api/behandlinger/bytt-enhet', BehandlingFpsakApiKeys.NY_BEHANDLENDE_ENHET)
  .withAsyncPost('/api/behandlinger/gjenoppta', BehandlingFpsakApiKeys.RESUME_BEHANDLING)
  .withPost('/api/behandlinger/henlegg', BehandlingFpsakApiKeys.HENLEGG_BEHANDLING)
  .withAsyncPost('/api/behandlinger/opne-for-endringer', BehandlingFpsakApiKeys.OPEN_BEHANDLING_FOR_CHANGES)

  /* /api/behandling */
  .withAsyncPost('/api/behandling/aksjonspunkt', BehandlingFpsakApiKeys.SAVE_AKSJONSPUNKT)
  .withAsyncPost('/api/behandling/aksjonspunkt/overstyr', BehandlingFpsakApiKeys.SAVE_OVERSTYRT_AKSJONSPUNKT)

  /* /api/klage */
  .withAsyncPost('/api/behandling/klage/mellomlagre-klage', BehandlingFpsakApiKeys.SAVE_KLAGE_VURDERING)
  .withAsyncPost('/api/behandling/klage/mellomlagre-gjennapne-klage', BehandlingFpsakApiKeys.SAVE_REOPEN_KLAGE_VURDERING)

  /* /api/brev */
  .withPostAndOpenBlob('/api/brev/forhandsvis', BehandlingFpsakApiKeys.PREVIEW_MESSAGE)
  .withPost('/api/brev/bestill', BehandlingFpsakApiKeys.SUBMIT_MESSAGE)
  .withPostAndOpenBlob('/api/brev/forhandsvis-klage', BehandlingFpsakApiKeys.PREVIEW_MESSAGE_KLAGE)

/* /api/brev */
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

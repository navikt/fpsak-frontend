import {
  RestApiConfigBuilder, ReduxRestApiBuilder, ReduxEvents,
} from '@fpsak-frontend/rest-api-redux';
import errorHandler from '@fpsak-frontend/error-api-redux';
import { reducerRegistry, setRequestPollingMessage } from '@fpsak-frontend/fp-felles';

export const BehandlingFpsakApiKeys = {
  BEHANDLING: 'BEHANDLING',
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
  STONADSKONTOER_GITT_UTTAKSPERIODER: 'STONADSKONTOER_GITT_UTTAKSPERIODER',
};

const endpoints = new RestApiConfigBuilder()
/* /api */

  /* /api/behandlinger */
  .withAsyncPost('/api/behandlinger', BehandlingFpsakApiKeys.BEHANDLING)
  .withPost('/api/behandlinger/endre-pa-vent', BehandlingFpsakApiKeys.UPDATE_ON_HOLD)
  .withPost('/api/behandlinger/sett-pa-vent', BehandlingFpsakApiKeys.BEHANDLING_ON_HOLD)
  .withPost('/api/behandlinger/bytt-enhet', BehandlingFpsakApiKeys.NY_BEHANDLENDE_ENHET)
  .withAsyncPost('/api/behandlinger/gjenoppta', BehandlingFpsakApiKeys.RESUME_BEHANDLING)
  .withPost('/api/behandlinger/henlegg', BehandlingFpsakApiKeys.HENLEGG_BEHANDLING)
  .withAsyncPost('/api/behandlinger/opne-for-endringer', BehandlingFpsakApiKeys.OPEN_BEHANDLING_FOR_CHANGES)

  /* /api/behandling */
  .withAsyncPost('/api/behandling/aksjonspunkt', BehandlingFpsakApiKeys.SAVE_AKSJONSPUNKT)
  .withAsyncPost('/api/behandling/aksjonspunkt/overstyr', BehandlingFpsakApiKeys.SAVE_OVERSTYRT_AKSJONSPUNKT)
  .withPost('/api/behandling/uttak/stonadskontoerGittUttaksperioder', BehandlingFpsakApiKeys.STONADSKONTOER_GITT_UTTAKSPERIODER)

  /* /api/brev */
  .withPostAndOpenBlob('/api/brev/forhandsvis', BehandlingFpsakApiKeys.PREVIEW_MESSAGE)
  .withPost('/api/brev/bestill', BehandlingFpsakApiKeys.SUBMIT_MESSAGE)

/* /api/brev */
  .build();

const reducerName = 'dataContextForstegangOgRevurderingBehandling';

export const reduxRestApi = new ReduxRestApiBuilder(endpoints, reducerName)
  .withContextPath('fpsak')
  .withReduxEvents(new ReduxEvents()
    .withErrorActionCreator(errorHandler.getErrorActionCreator())
    .withPollingMessageActionCreator(setRequestPollingMessage))
  .build();

reducerRegistry.register(reducerName, reduxRestApi.getDataReducer());

const fpsakBehandlingApi = reduxRestApi.getEndpointApi();
export default fpsakBehandlingApi;

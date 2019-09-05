import { ReduxEvents, ReduxRestApiBuilder, RestApiConfigBuilder } from '@fpsak-frontend/rest-api-redux';
import errorHandler from '@fpsak-frontend/error-api-redux';
import { reducerRegistry, setRequestPollingMessage } from '@fpsak-frontend/fp-felles';

export const KlageBehandlingApiKeys = {
  BEHANDLING: 'BEHANDLING',
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
  .withAsyncPost('/api/behandlinger', KlageBehandlingApiKeys.BEHANDLING)
  .withPost('/api/behandlinger/endre-pa-vent', KlageBehandlingApiKeys.UPDATE_ON_HOLD)

  /* /api/behandling */
  .withAsyncPost('/api/behandling/aksjonspunkt', KlageBehandlingApiKeys.SAVE_AKSJONSPUNKT)
  .withAsyncPost('/api/behandling/aksjonspunkt/overstyr', KlageBehandlingApiKeys.SAVE_OVERSTYRT_AKSJONSPUNKT)

  /* /api/klage */
  .withAsyncPost('/api/behandling/klage/mellomlagre-klage', KlageBehandlingApiKeys.SAVE_KLAGE_VURDERING)
  .withAsyncPost('/api/behandling/klage/mellomlagre-gjennapne-klage', KlageBehandlingApiKeys.SAVE_REOPEN_KLAGE_VURDERING)

  /* /api/brev */
  .withPostAndOpenBlob('/api/brev/forhandsvis', KlageBehandlingApiKeys.PREVIEW_MESSAGE)
  .withPostAndOpenBlob('/api/brev/forhandsvis-klage', KlageBehandlingApiKeys.PREVIEW_MESSAGE_KLAGE)

/* /api/brev */
  .build();

const reducerName = 'dataContextKlageBehandling';

export const reduxRestApi = new ReduxRestApiBuilder(endpoints, reducerName)
  .withContextPath('fpsak')
  .withReduxEvents(new ReduxEvents()
    .withErrorActionCreator(errorHandler.getErrorActionCreator())
    .withPollingMessageActionCreator(setRequestPollingMessage))
  .build();

reducerRegistry.register(reducerName, reduxRestApi.getDataReducer());

const klageBehandlingApi = reduxRestApi.getEndpointApi();
export default klageBehandlingApi;

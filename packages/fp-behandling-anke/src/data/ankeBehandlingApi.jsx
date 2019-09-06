import { ReduxEvents, ReduxRestApiBuilder, RestApiConfigBuilder } from '@fpsak-frontend/rest-api-redux';
import errorHandler from '@fpsak-frontend/error-api-redux';
import { reducerRegistry, setRequestPollingMessage } from '@fpsak-frontend/fp-felles';

export const AnkeBehandlingApiKeys = {
  BEHANDLING: 'BEHANDLING',
  UPDATE_ON_HOLD: 'UPDATE_ON_HOLD',
  SAVE_AKSJONSPUNKT: 'SAVE_AKSJONSPUNKT',
  PREVIEW_MESSAGE: 'PREVIEW_MESSAGE',
  PREVIEW_MESSAGE_ANKE: 'PREVIEW_MESSAGE_ANKE',
  SAVE_ANKE_VURDERING: 'SAVE_ANKE_VURDERING',
  SAVE_REOPEN_ANKE_VURDERING: 'SAVE_REOPEN_ANKE_VURDERING',
  ANKE_VURDERING: 'ANKE_VURDERING',
};

const endpoints = new RestApiConfigBuilder()
/* /api */

  /* /api/behandlinger */
  .withAsyncPost('/fpsak/api/behandlinger', AnkeBehandlingApiKeys.BEHANDLING)
  .withPost('/fpsak/api/behandlinger/endre-pa-vent', AnkeBehandlingApiKeys.UPDATE_ON_HOLD)

  /* /api/behandling */
  .withAsyncPost('/fpsak/api/behandling/aksjonspunkt', AnkeBehandlingApiKeys.SAVE_AKSJONSPUNKT)

  /* /api/anke */
  .withAsyncPost('/fpsak/api/behandling/anke/mellomlagre-anke', AnkeBehandlingApiKeys.SAVE_ANKE_VURDERING)
  .withAsyncPost('/fpsak/api/behandling/anke/mellomlagre-gjennapne-anke', AnkeBehandlingApiKeys.SAVE_REOPEN_ANKE_VURDERING)
  .withGet('/fpsak/api/behandling/anke/anke-vurdering', AnkeBehandlingApiKeys.ANKE_VURDERING)

  /* /api/brev */
  .withPostAndOpenBlob('/fpformidling/api/brev/forhaandsvis', AnkeBehandlingApiKeys.PREVIEW_MESSAGE)
  .withPostAndOpenBlob('/fpsak/api/brev/forhandsvis-anke', AnkeBehandlingApiKeys.PREVIEW_MESSAGE_ANKE)

/* /api/brev */
  .build();

const reducerName = 'dataContextAnkeBehandling';

export const reduxRestApi = new ReduxRestApiBuilder(endpoints, reducerName)
  .withReduxEvents(new ReduxEvents()
    .withErrorActionCreator(errorHandler.getErrorActionCreator())
    .withPollingMessageActionCreator(setRequestPollingMessage))
  .build();

reducerRegistry.register(reducerName, reduxRestApi.getDataReducer());

const ankeBehandlingApi = reduxRestApi.getEndpointApi();
export default ankeBehandlingApi;

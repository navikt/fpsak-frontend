import { ReduxEvents, ReduxRestApiBuilder, RestApiConfigBuilder } from '@fpsak-frontend/rest-api-redux';
import errorHandler from '@fpsak-frontend/error-api-redux';
import { reducerRegistry, setRequestPollingMessage } from '@fpsak-frontend/fp-felles';

export const KlageBehandlingApiKeys = {
  BEHANDLING: 'BEHANDLING',
  UPDATE_ON_HOLD: 'UPDATE_ON_HOLD',
  SAVE_AKSJONSPUNKT: 'SAVE_AKSJONSPUNKT',
  SAVE_OVERSTYRT_AKSJONSPUNKT: 'SAVE_OVERSTYRT_AKSJONSPUNKT',
  PREVIEW_MESSAGE: 'PREVIEW_MESSAGE',
  SAVE_KLAGE_VURDERING: 'SAVE_KLAGE_VURDERING',
  SAVE_REOPEN_KLAGE_VURDERING: 'SAVE_REOPEN_KLAGE_VURDERING',
  KLAGE_VURDERING: 'KLAGE_VURDERING',
};

const endpoints = new RestApiConfigBuilder()
  .withAsyncPost('/fpsak/api/behandlinger', KlageBehandlingApiKeys.BEHANDLING)
  .withPost('/fpsak/api/behandlinger/endre-pa-vent', KlageBehandlingApiKeys.UPDATE_ON_HOLD)
  .withAsyncPost('/fpsak/api/behandling/aksjonspunkt', KlageBehandlingApiKeys.SAVE_AKSJONSPUNKT)
  .withAsyncPost('/fpsak/api/behandling/aksjonspunkt/overstyr', KlageBehandlingApiKeys.SAVE_OVERSTYRT_AKSJONSPUNKT)
  .withAsyncPost('/fpsak/api/behandling/klage/mellomlagre-klage', KlageBehandlingApiKeys.SAVE_KLAGE_VURDERING)
  .withAsyncPost('/fpsak/api/behandling/klage/mellomlagre-gjennapne-klage', KlageBehandlingApiKeys.SAVE_REOPEN_KLAGE_VURDERING)

  // TODO (TOR) Desse er ikkje i bruk enno. Må flytta ut prosess- og fakta-komponentar først
  .withInjectedPath('klage-vurdering', KlageBehandlingApiKeys.KLAGE_VURDERING)

  /* fpformidling */
  .withPostAndOpenBlob('/fpformidling/api/brev/forhaandsvis', KlageBehandlingApiKeys.PREVIEW_MESSAGE)

  .build();

const reducerName = 'dataContextKlageBehandling';

export const reduxRestApi = new ReduxRestApiBuilder(endpoints, reducerName)
  .withReduxEvents(new ReduxEvents()
    .withErrorActionCreator(errorHandler.getErrorActionCreator())
    .withPollingMessageActionCreator(setRequestPollingMessage))
  .build();

reducerRegistry.register(reducerName, reduxRestApi.getDataReducer());

const klageBehandlingApi = reduxRestApi.getEndpointApi();
export default klageBehandlingApi;

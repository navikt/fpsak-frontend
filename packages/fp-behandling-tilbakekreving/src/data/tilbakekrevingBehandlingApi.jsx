import { ReduxEvents, ReduxRestApiBuilder, RestApiConfigBuilder } from '@fpsak-frontend/rest-api-redux';
import errorHandler from '@fpsak-frontend/error-api-redux';
import { reducerRegistry, setRequestPollingMessage } from '@fpsak-frontend/fp-felles';

export const TilbakekrevingBehandlingApiKeys = {
  BEHANDLING: 'BEHANDLING',
  UPDATE_ON_HOLD: 'UPDATE_ON_HOLD',
  SAVE_AKSJONSPUNKT: 'SAVE_AKSJONSPUNKT',
  SAVE_OVERSTYRT_AKSJONSPUNKT: 'SAVE_OVERSTYRT_AKSJONSPUNKT',
  BEREGNE_BELØP: 'BEREGNE_BELØP',
  TILBAKE_KODEVERK: 'TILBAKE_KODEVERK',
  PREVIEW_VEDTAKSBREV: 'PREVIEW_VEDTAKSBREV',
  VEDTAKSBREV: 'VEDTAKSBREV',
  BEREGNINGSRESULTAT: 'BEREGNINGSRESULTAT',
};

const endpoints = new RestApiConfigBuilder()
  .withAsyncPost('/api/behandlinger', TilbakekrevingBehandlingApiKeys.BEHANDLING)
  .withPost('/api/behandlinger/endre-pa-vent', TilbakekrevingBehandlingApiKeys.UPDATE_ON_HOLD)

  /* /api/behandling */
  .withAsyncPost('/api/behandling/aksjonspunkt', TilbakekrevingBehandlingApiKeys.SAVE_AKSJONSPUNKT)
  .withAsyncPost('/api/behandling/aksjonspunkt/overstyr', TilbakekrevingBehandlingApiKeys.SAVE_OVERSTYRT_AKSJONSPUNKT)

  /* /api/brev */
  .withPostAndOpenBlob('/api/dokument/forhandsvis-vedtaksbrev', TilbakekrevingBehandlingApiKeys.PREVIEW_VEDTAKSBREV)

  /* /api/foreldelse */
  .withPost('/api/foreldelse/belop', TilbakekrevingBehandlingApiKeys.BEREGNE_BELØP)

  /* /api/kodeverk */
  .withGet('/api/kodeverk', TilbakekrevingBehandlingApiKeys.TILBAKE_KODEVERK)

  // TODO (TOR) Desse er ikkje i bruk enno. Må flytta ut prosess- og fakta-komponentar først
  .withInjectedPath('vedtaksbrev', TilbakekrevingBehandlingApiKeys.VEDTAKSBREV)
  .withInjectedPath('beregningsresultat', TilbakekrevingBehandlingApiKeys.BEREGNINGSRESULTAT)

  .build();

const reducerName = 'dataContextTilbakekrevingBehandling';

export const reduxRestApi = new ReduxRestApiBuilder(endpoints, reducerName)
  .withContextPath('fptilbake')
  .withReduxEvents(new ReduxEvents()
    .withErrorActionCreator(errorHandler.getErrorActionCreator())
    .withPollingMessageActionCreator(setRequestPollingMessage))
  .build();

reducerRegistry.register(reducerName, reduxRestApi.getDataReducer());

const tilbakekrevingBehandlingApi = reduxRestApi.getEndpointApi();
export default tilbakekrevingBehandlingApi;

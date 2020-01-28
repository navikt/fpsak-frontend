import { ReduxEvents, ReduxRestApiBuilder, RestApiConfigBuilder } from '@fpsak-frontend/rest-api-redux';
import errorHandler from '@fpsak-frontend/error-api-redux';
import { reducerRegistry, setRequestPollingMessage } from '@fpsak-frontend/fp-felles';

export const TilbakekrevingBehandlingApiKeys = {
  BEHANDLING_TILBAKE: 'BEHANDLING_TILBAKE',
  AKSJONSPUNKTER: 'AKSJONSPUNKTER',
  VEDTAKSBREV: 'VEDTAKSBREV',
  BEREGNINGSRESULTAT: 'BEREGNINGSRESULTAT',
  FEILUTBETALING_FAKTA: 'FEILUTBETALING_FAKTA',
  FEILUTBETALING_AARSAK: 'FEILUTBETALING_AARSAK',
  PERIODER_FORELDELSE: 'PERIODER_FORELDELSE',
  VILKARVURDERINGSPERIODER: 'VILKARVURDERINGSPERIODER',
  VILKARVURDERING: 'VILKARVURDERING',
  BEHANDLING_NY_BEHANDLENDE_ENHET: 'BEHANDLING_NY_BEHANDLENDE_ENHET',
  HENLEGG_BEHANDLING: 'HENLEGG_BEHANDLING',
  RESUME_BEHANDLING: 'RESUME_BEHANDLING',
  BEHANDLING_ON_HOLD: 'BEHANDLING_ON_HOLD',
  UPDATE_ON_HOLD: 'UPDATE_ON_HOLD',
  SAVE_AKSJONSPUNKT: 'SAVE_AKSJONSPUNKT',
  BEREGNE_BELØP: 'BEREGNE_BELØP',
  TILBAKE_KODEVERK: 'TILBAKE_KODEVERK',
  PREVIEW_VEDTAKSBREV: 'PREVIEW_VEDTAKSBREV',
};

const endpoints = new RestApiConfigBuilder()
  .withAsyncPost('/fptilbake/api/behandlinger', TilbakekrevingBehandlingApiKeys.BEHANDLING_TILBAKE)
  .withInjectedPath('aksjonspunkter', TilbakekrevingBehandlingApiKeys.AKSJONSPUNKTER)
  .withInjectedPath('vedtaksbrev', TilbakekrevingBehandlingApiKeys.VEDTAKSBREV)
  .withInjectedPath('beregningsresultat', TilbakekrevingBehandlingApiKeys.BEREGNINGSRESULTAT)
  .withInjectedPath('feilutbetalingFakta', TilbakekrevingBehandlingApiKeys.FEILUTBETALING_FAKTA)
  .withInjectedPath('feilutbetalingAarsak', TilbakekrevingBehandlingApiKeys.FEILUTBETALING_AARSAK)
  .withInjectedPath('perioderForeldelse', TilbakekrevingBehandlingApiKeys.PERIODER_FORELDELSE)
  .withInjectedPath('vilkarvurderingsperioder', TilbakekrevingBehandlingApiKeys.VILKARVURDERINGSPERIODER)
  .withInjectedPath('vilkarvurdering', TilbakekrevingBehandlingApiKeys.VILKARVURDERING)

  .withPost('/fptilbake/api/behandlinger/bytt-enhet', TilbakekrevingBehandlingApiKeys.BEHANDLING_NY_BEHANDLENDE_ENHET)
  .withPost('/fptilbake/api/behandlinger/henlegg', TilbakekrevingBehandlingApiKeys.HENLEGG_BEHANDLING)
  .withAsyncPost('/fptilbake/api/behandlinger/gjenoppta', TilbakekrevingBehandlingApiKeys.RESUME_BEHANDLING, {
    storeResultKey: TilbakekrevingBehandlingApiKeys.BEHANDLING_TILBAKE,
  })
  .withPost('/fptilbake/api/behandlinger/sett-pa-vent', TilbakekrevingBehandlingApiKeys.BEHANDLING_ON_HOLD)

  .withPost('/fptilbake/api/behandlinger/endre-pa-vent', TilbakekrevingBehandlingApiKeys.UPDATE_ON_HOLD)
  .withAsyncPost('/fptilbake/api/behandling/aksjonspunkt', TilbakekrevingBehandlingApiKeys.SAVE_AKSJONSPUNKT, {
    storeResultKey: TilbakekrevingBehandlingApiKeys.BEHANDLING_TILBAKE,
  })
  .withPost('/fptilbake/api/foreldelse/belop', TilbakekrevingBehandlingApiKeys.BEREGNE_BELØP)
  .withGet('/fptilbake/api/kodeverk', TilbakekrevingBehandlingApiKeys.TILBAKE_KODEVERK)
  .withPostAndOpenBlob('/fptilbake/api/dokument/forhandsvis-vedtaksbrev', TilbakekrevingBehandlingApiKeys.PREVIEW_VEDTAKSBREV)
  .build();

const reducerName = 'dataContextTilbakekrevingBehandling';

export const reduxRestApi = new ReduxRestApiBuilder(endpoints, reducerName)
  .withReduxEvents(new ReduxEvents()
    .withErrorActionCreator(errorHandler.getErrorActionCreator())
    .withPollingMessageActionCreator(setRequestPollingMessage))
  .build();

reducerRegistry.register(reducerName, reduxRestApi.getDataReducer());

const tilbakekrevingBehandlingApi = reduxRestApi.getEndpointApi();
export default tilbakekrevingBehandlingApi;

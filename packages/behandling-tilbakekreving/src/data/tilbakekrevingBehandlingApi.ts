import {
  reducerRegistry, setRequestPollingMessage, ReduxEvents, ReduxRestApiBuilder, RestApiConfigBuilder,
} from '@fpsak-frontend/rest-api-redux';
import errorHandler from '@fpsak-frontend/error-api-redux';

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
  VERGE: 'VERGE',
  VERGE_OPPRETT: 'VERGE_OPPRETT',
  VERGE_FJERN: 'VERGE_FJERN',
};

const endpoints = new RestApiConfigBuilder()
  .withAsyncPost('/fptilbake/api/behandlinger', TilbakekrevingBehandlingApiKeys.BEHANDLING_TILBAKE)
  .withGet('/fptilbake/api/kodeverk', TilbakekrevingBehandlingApiKeys.TILBAKE_KODEVERK)

  // behandlingsdata
  .withRel('aksjonspunkter', TilbakekrevingBehandlingApiKeys.AKSJONSPUNKTER)
  .withRel('vedtaksbrev', TilbakekrevingBehandlingApiKeys.VEDTAKSBREV)
  .withRel('beregningsresultat', TilbakekrevingBehandlingApiKeys.BEREGNINGSRESULTAT)
  .withRel('feilutbetalingFakta', TilbakekrevingBehandlingApiKeys.FEILUTBETALING_FAKTA)
  .withRel('feilutbetalingAarsak', TilbakekrevingBehandlingApiKeys.FEILUTBETALING_AARSAK)
  .withRel('perioderForeldelse', TilbakekrevingBehandlingApiKeys.PERIODER_FORELDELSE)
  .withRel('vilkarvurderingsperioder', TilbakekrevingBehandlingApiKeys.VILKARVURDERINGSPERIODER)
  .withRel('vilkarvurdering', TilbakekrevingBehandlingApiKeys.VILKARVURDERING)

  // operasjoner
  .withRel('beregne-feilutbetalt-belop', TilbakekrevingBehandlingApiKeys.BEREGNE_BELØP)
  .withRel('bytt-behandlende-enhet', TilbakekrevingBehandlingApiKeys.BEHANDLING_NY_BEHANDLENDE_ENHET)
  .withRel('henlegg-behandling', TilbakekrevingBehandlingApiKeys.HENLEGG_BEHANDLING)
  .withRel('gjenoppta-behandling', TilbakekrevingBehandlingApiKeys.RESUME_BEHANDLING, { saveResponseIn: TilbakekrevingBehandlingApiKeys.BEHANDLING_TILBAKE })
  .withRel('sett-behandling-pa-vent', TilbakekrevingBehandlingApiKeys.BEHANDLING_ON_HOLD)
  .withRel('endre-pa-vent', TilbakekrevingBehandlingApiKeys.UPDATE_ON_HOLD)
  .withRel('lagre-aksjonspunkter', TilbakekrevingBehandlingApiKeys.SAVE_AKSJONSPUNKT, { saveResponseIn: TilbakekrevingBehandlingApiKeys.BEHANDLING_TILBAKE })
  .withRel('soeker-verge', TilbakekrevingBehandlingApiKeys.VERGE)
  .withRel('opprett-verge', TilbakekrevingBehandlingApiKeys.VERGE_OPPRETT, { saveResponseIn: TilbakekrevingBehandlingApiKeys.BEHANDLING_TILBAKE })
  .withRel('fjern-verge', TilbakekrevingBehandlingApiKeys.VERGE_FJERN, { saveResponseIn: TilbakekrevingBehandlingApiKeys.BEHANDLING_TILBAKE })

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

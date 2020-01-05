import { ReduxEvents, ReduxRestApiBuilder, RestApiConfigBuilder } from '@fpsak-frontend/rest-api-redux';
import errorHandler from '@fpsak-frontend/error-api-redux';
import { reducerRegistry, setRequestPollingMessage } from '@fpsak-frontend/fp-felles';

export const EsBehandlingApiKeys = {
  BEHANDLING_ES: 'BEHANDLING_ES',
  UPDATE_ON_HOLD: 'UPDATE_ON_HOLD',
  SAVE_AKSJONSPUNKT: 'SAVE_AKSJONSPUNKT',
  SAVE_OVERSTYRT_AKSJONSPUNKT: 'SAVE_OVERSTYRT_AKSJONSPUNKT',
  PREVIEW_MESSAGE: 'PREVIEW_MESSAGE',
  PREVIEW_TILBAKEKREVING_MESSAGE: 'PREVIEW_TILBAKEKREVING_MESSAGE',
  STONADSKONTOER_GITT_UTTAKSPERIODER: 'STONADSKONTOER_GITT_UTTAKSPERIODER',
  AKSJONSPUNKTER: 'AKSJONSPUNKTER',
  VILKAR: 'VILKAR',
  PERSONOPPLYSNINGER: 'PERSONOPPLYSNINGER',
  SIMULERING_RESULTAT: 'SIMULERING_RESULTAT',
  TILBAKEKREVINGVALG: 'TILBAKEKREVINGVALG',
  BEREGNINGRESULTAT_ENGANGSSTONAD: 'BEREGNINGRESULTAT_ENGANGSSTONAD',
  BEREGNINGRESULTAT_FORELDREPENGER: 'BEREGNINGRESULTAT_FORELDREPENGER',
  BEREGNINGSGRUNNLAG: 'BEREGNINGSGRUNNLAG',
  BEREGNINGRESULTAT: 'BEREGNINGRESULTAT',
  FAMILIEHENDELSE: 'FAMILIEHENDELSE',
  SOKNAD: 'SOKNAD',
  SOKNAD_ORIGINAL_BEHANDLING: 'SOKNAD_ORIGINAL_BEHANDLING',
  FAMILIEHENDELSE_ORIGINAL_BEHANDLING: 'FAMILIEHENDELSE_ORIGINAL_BEHANDLING',
  BEREGNINGSRESULTAT_ORIGINAL_BEHANDLING: 'BEREGNINGSRESULTAT_ORIGINAL_BEHANDLING',
  MEDLEMSKAP: 'MEDLEMSKAP',
  MEDLEMSKAP_V2: 'MEDLEMSKAP_V2',
  UTTAK_PERIODE_GRENSE: 'UTTAK_PERIODE_GRENSE',
  INNTEKT_ARBEID_YTELSE: 'INNTEKT_ARBEID_YTELSE',
  VERGE: 'VERGE',
  YTELSEFORDELING: 'YTELSEFORDELING',
  OPPTJENING: 'OPPTJENING',
  SEND_VARSEL_OM_REVURDERING: 'SEND_VARSEL_OM_REVURDERING',
  SVANGERSKAPSPENGER_TILRETTELEGGING: 'SVANGERSKAPSPENGER_TILRETTELEGGING',
  FAKTA_ARBEIDSFORHOLD: 'FAKTA_ARBEIDSFORHOLD',
  UTTAKSRESULTAT_PERIODER: 'UTTAKSRESULTAT_PERIODER',
  UTTAK_STONADSKONTOER: 'UTTAK_STONADSKONTOER',
  UTTAK_KONTROLLER_FAKTA_PERIODER: 'UTTAK_KONTROLLER_FAKTA_PERIODER',
  BEHANDLING_NY_BEHANDLENDE_ENHET: 'BEHANDLING_NY_BEHANDLENDE_ENHET',
  HENLEGG_BEHANDLING: 'HENLEGG_BEHANDLING',
  RESUME_BEHANDLING: 'RESUME_BEHANDLING',
  BEHANDLING_ON_HOLD: 'BEHANDLING_ON_HOLD',
};

const endpoints = new RestApiConfigBuilder()
  /* /api/behandlinger */
  .withAsyncPost('/fpsak/api/behandlinger', EsBehandlingApiKeys.BEHANDLING_ES, { fetchLinkDataAutomatically: false })
  .withPost('/fpsak/api/behandlinger/endre-pa-vent', EsBehandlingApiKeys.UPDATE_ON_HOLD)

  /* /api/behandling */
  .withAsyncPost('/fpsak/api/behandling/aksjonspunkt', EsBehandlingApiKeys.SAVE_AKSJONSPUNKT, {
    storeResultKey: EsBehandlingApiKeys.BEHANDLING_ES,
  })
  .withAsyncPost('/fpsak/api/behandling/aksjonspunkt/overstyr', EsBehandlingApiKeys.SAVE_OVERSTYRT_AKSJONSPUNKT)
  .withPost('/fpsak/api/behandling/uttak/stonadskontoerGittUttaksperioder', EsBehandlingApiKeys.STONADSKONTOER_GITT_UTTAKSPERIODER)

  /* fptilbake/api/dokument */
  .withPostAndOpenBlob('/fptilbake/api/dokument/forhandsvis-varselbrev', EsBehandlingApiKeys.PREVIEW_TILBAKEKREVING_MESSAGE)

  /* /api/brev */
  .withPostAndOpenBlob('/fpformidling/api/brev/forhaandsvis', EsBehandlingApiKeys.PREVIEW_MESSAGE)

  // TODO (TOR) Desse er ikkje i bruk enno. Må flytta ut prosess- og fakta-komponentar først
  .withInjectedPath('aksjonspunkter', EsBehandlingApiKeys.AKSJONSPUNKTER)
  .withInjectedPath('vilkar', EsBehandlingApiKeys.VILKAR)
  .withInjectedPath('soeker-personopplysninger', EsBehandlingApiKeys.PERSONOPPLYSNINGER)
  .withInjectedPath('simuleringResultat', EsBehandlingApiKeys.SIMULERING_RESULTAT)
  .withInjectedPath('tilbakekrevingvalg', EsBehandlingApiKeys.TILBAKEKREVINGVALG)
  .withInjectedPath('beregningsresultat-engangsstonad', EsBehandlingApiKeys.BEREGNINGRESULTAT_ENGANGSSTONAD)
  .withInjectedPath('beregningsresultat-foreldrepenger', EsBehandlingApiKeys.BEREGNINGRESULTAT_FORELDREPENGER)
  .withInjectedPath('beregningsgrunnlag', EsBehandlingApiKeys.BEREGNINGSGRUNNLAG)
  .withInjectedPath('beregningsresultat-foreldrepenger', EsBehandlingApiKeys.BEREGNINGRESULTAT)
  .withInjectedPath('familiehendelse-v2', EsBehandlingApiKeys.FAMILIEHENDELSE)
  .withInjectedPath('soknad', EsBehandlingApiKeys.SOKNAD)
  .withInjectedPath('soknad-original-behandling', EsBehandlingApiKeys.SOKNAD_ORIGINAL_BEHANDLING)
  .withInjectedPath('familiehendelse-original-behandling', EsBehandlingApiKeys.FAMILIEHENDELSE_ORIGINAL_BEHANDLING)
  .withInjectedPath('beregningsresultat-engangsstonad-original-behandling', EsBehandlingApiKeys.BEREGNINGSRESULTAT_ORIGINAL_BEHANDLING)
  .withInjectedPath('soeker-medlemskap', EsBehandlingApiKeys.MEDLEMSKAP)
  .withInjectedPath('soeker-medlemskap-v2', EsBehandlingApiKeys.MEDLEMSKAP_V2)
  .withInjectedPath('uttak-periode-grense', EsBehandlingApiKeys.UTTAK_PERIODE_GRENSE)
  .withInjectedPath('inntekt-arbeid-ytelse', EsBehandlingApiKeys.INNTEKT_ARBEID_YTELSE)
  .withInjectedPath('soeker-verge', EsBehandlingApiKeys.VERGE)
  .withInjectedPath('ytelsefordeling', EsBehandlingApiKeys.YTELSEFORDELING)
  .withInjectedPath('opptjening', EsBehandlingApiKeys.OPPTJENING)
  .withInjectedPath('sendt-varsel-om-revurdering', EsBehandlingApiKeys.SEND_VARSEL_OM_REVURDERING)
  .withInjectedPath('svangerskapspenger-tilrettelegging', EsBehandlingApiKeys.SVANGERSKAPSPENGER_TILRETTELEGGING)
  .withInjectedPath('fakta-arbeidsforhold', EsBehandlingApiKeys.FAKTA_ARBEIDSFORHOLD)
  .withInjectedPath('uttaksresultat-perioder', EsBehandlingApiKeys.UTTAKSRESULTAT_PERIODER)
  .withInjectedPath('uttak-stonadskontoer', EsBehandlingApiKeys.UTTAK_STONADSKONTOER)
  .withInjectedPath('uttak-kontroller-fakta-perioder', EsBehandlingApiKeys.UTTAK_KONTROLLER_FAKTA_PERIODER)

  .withPost('/fpsak/api/behandlinger/bytt-enhet', EsBehandlingApiKeys.BEHANDLING_NY_BEHANDLENDE_ENHET)
  .withPost('/fpsak/api/behandlinger/henlegg', EsBehandlingApiKeys.HENLEGG_BEHANDLING)
  .withAsyncPost('/fpsak/api/behandlinger/gjenoppta', EsBehandlingApiKeys.RESUME_BEHANDLING, {
    storeResultKey: EsBehandlingApiKeys.BEHANDLING_ES,
  })
  .withPost('/fpsak/api/behandlinger/sett-pa-vent', EsBehandlingApiKeys.BEHANDLING_ON_HOLD)

  .build();

const reducerName = 'dataContextESBehandling';

export const reduxRestApi = new ReduxRestApiBuilder(endpoints, reducerName)
  .withReduxEvents(new ReduxEvents()
    .withErrorActionCreator(errorHandler.getErrorActionCreator())
    .withPollingMessageActionCreator(setRequestPollingMessage))
  .build();

reducerRegistry.register(reducerName, reduxRestApi.getDataReducer());

const esBehandlingApi = reduxRestApi.getEndpointApi();
export default esBehandlingApi;

import { ReduxEvents, ReduxRestApiBuilder, RestApiConfigBuilder } from '@fpsak-frontend/rest-api-redux';
import errorHandler from '@fpsak-frontend/error-api-redux';
import { reducerRegistry, setRequestPollingMessage } from '@fpsak-frontend/fp-felles';

export const FpBehandlingApiKeys = {
  BEHANDLING_FP: 'BEHANDLING_FP',
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
  FAKTA_ARBEIDSFORHOLD: 'FAKTA_ARBEIDSFORHOLD',
  UTTAKSRESULTAT_PERIODER: 'UTTAKSRESULTAT_PERIODER',
  UTTAK_STONADSKONTOER: 'UTTAK_STONADSKONTOER',
  UTTAK_KONTROLLER_FAKTA_PERIODER: 'UTTAK_KONTROLLER_FAKTA_PERIODER',
  BEHANDLING_NY_BEHANDLENDE_ENHET: 'BEHANDLING_NY_BEHANDLENDE_ENHET',
  HENLEGG_BEHANDLING: 'HENLEGG_BEHANDLING',
  RESUME_BEHANDLING: 'RESUME_BEHANDLING',
  BEHANDLING_ON_HOLD: 'BEHANDLING_ON_HOLD',
  OPEN_BEHANDLING_FOR_CHANGES: 'OPEN_BEHANDLING_FOR_CHANGES',
  VERGE_OPPRETT: 'VERGE_OPPRETT',
  VERGE_FJERN: 'VERGE_FJERN',
};

const endpoints = new RestApiConfigBuilder()
  /* /api/behandlinger */
  .withAsyncPost('/fpsak/api/behandlinger', FpBehandlingApiKeys.BEHANDLING_FP)
  .withPost('/fpsak/api/behandlinger/endre-pa-vent', FpBehandlingApiKeys.UPDATE_ON_HOLD)

  /* /api/behandling */
  .withAsyncPost('/fpsak/api/behandling/aksjonspunkt', FpBehandlingApiKeys.SAVE_AKSJONSPUNKT, {
    storeResultKey: FpBehandlingApiKeys.BEHANDLING_FP,
  })
  .withAsyncPost('/fpsak/api/behandling/aksjonspunkt/overstyr', FpBehandlingApiKeys.SAVE_OVERSTYRT_AKSJONSPUNKT, {
    storeResultKey: FpBehandlingApiKeys.BEHANDLING_FP,
  })
  .withPost('/fpsak/api/behandling/uttak/stonadskontoerGittUttaksperioder', FpBehandlingApiKeys.STONADSKONTOER_GITT_UTTAKSPERIODER)

  /* fptilbake/api/dokument */
  .withPostAndOpenBlob('/fptilbake/api/dokument/forhandsvis-varselbrev', FpBehandlingApiKeys.PREVIEW_TILBAKEKREVING_MESSAGE)

  /* /api/brev */
  .withPostAndOpenBlob('/fpformidling/api/brev/forhaandsvis', FpBehandlingApiKeys.PREVIEW_MESSAGE)

  .withInjectedPath('aksjonspunkter', FpBehandlingApiKeys.AKSJONSPUNKTER)
  .withInjectedPath('vilkar', FpBehandlingApiKeys.VILKAR)
  .withInjectedPath('soeker-personopplysninger', FpBehandlingApiKeys.PERSONOPPLYSNINGER)
  .withInjectedPath('simuleringResultat', FpBehandlingApiKeys.SIMULERING_RESULTAT)
  .withInjectedPath('tilbakekrevingvalg', FpBehandlingApiKeys.TILBAKEKREVINGVALG)
  .withInjectedPath('beregningsresultat-foreldrepenger', FpBehandlingApiKeys.BEREGNINGRESULTAT_FORELDREPENGER)
  .withInjectedPath('beregningsgrunnlag', FpBehandlingApiKeys.BEREGNINGSGRUNNLAG)
  .withInjectedPath('beregningsresultat-foreldrepenger', FpBehandlingApiKeys.BEREGNINGRESULTAT)
  .withInjectedPath('familiehendelse-v2', FpBehandlingApiKeys.FAMILIEHENDELSE)
  .withInjectedPath('soknad', FpBehandlingApiKeys.SOKNAD)
  .withInjectedPath('soknad-original-behandling', FpBehandlingApiKeys.SOKNAD_ORIGINAL_BEHANDLING)
  .withInjectedPath('familiehendelse-original-behandling', FpBehandlingApiKeys.FAMILIEHENDELSE_ORIGINAL_BEHANDLING)
  .withInjectedPath('beregningsresultat-engangsstonad-original-behandling', FpBehandlingApiKeys.BEREGNINGSRESULTAT_ORIGINAL_BEHANDLING)
  .withInjectedPath('soeker-medlemskap', FpBehandlingApiKeys.MEDLEMSKAP)
  .withInjectedPath('soeker-medlemskap-v2', FpBehandlingApiKeys.MEDLEMSKAP_V2)
  .withInjectedPath('uttak-periode-grense', FpBehandlingApiKeys.UTTAK_PERIODE_GRENSE)
  .withInjectedPath('inntekt-arbeid-ytelse', FpBehandlingApiKeys.INNTEKT_ARBEID_YTELSE)
  .withInjectedPath('soeker-verge', FpBehandlingApiKeys.VERGE)
  .withInjectedPath('ytelsefordeling', FpBehandlingApiKeys.YTELSEFORDELING)
  .withInjectedPath('opptjening', FpBehandlingApiKeys.OPPTJENING)
  .withInjectedPath('sendt-varsel-om-revurdering', FpBehandlingApiKeys.SEND_VARSEL_OM_REVURDERING)
  .withInjectedPath('fakta-arbeidsforhold', FpBehandlingApiKeys.FAKTA_ARBEIDSFORHOLD)
  .withInjectedPath('uttaksresultat-perioder', FpBehandlingApiKeys.UTTAKSRESULTAT_PERIODER)
  .withInjectedPath('uttak-stonadskontoer', FpBehandlingApiKeys.UTTAK_STONADSKONTOER)
  .withInjectedPath('uttak-kontroller-fakta-perioder', FpBehandlingApiKeys.UTTAK_KONTROLLER_FAKTA_PERIODER)

  .withPost('/fpsak/api/behandlinger/bytt-enhet', FpBehandlingApiKeys.BEHANDLING_NY_BEHANDLENDE_ENHET)
  .withPost('/fpsak/api/behandlinger/henlegg', FpBehandlingApiKeys.HENLEGG_BEHANDLING)
  .withAsyncPost('/fpsak/api/behandlinger/gjenoppta', FpBehandlingApiKeys.RESUME_BEHANDLING, {
    storeResultKey: FpBehandlingApiKeys.BEHANDLING_FP,
  })
  .withPost('/fpsak/api/behandlinger/sett-pa-vent', FpBehandlingApiKeys.BEHANDLING_ON_HOLD)
  .withPost('/fpsak/api/behandlinger/opne-for-endringer', FpBehandlingApiKeys.OPEN_BEHANDLING_FOR_CHANGES, {
    storeResultKey: FpBehandlingApiKeys.BEHANDLING_FP,
  })
  .withPost('/fpsak/api/verge/opprett', FpBehandlingApiKeys.VERGE_OPPRETT, {
    storeResultKey: FpBehandlingApiKeys.BEHANDLING_FP,
  })
  .withPost('/fpsak/api/verge/fjern', FpBehandlingApiKeys.VERGE_FJERN, {
    storeResultKey: FpBehandlingApiKeys.BEHANDLING_FP,
  })

  .build();

const reducerName = 'dataContextFPBehandling';

export const reduxRestApi = new ReduxRestApiBuilder(endpoints, reducerName)
  .withReduxEvents(new ReduxEvents()
    .withErrorActionCreator(errorHandler.getErrorActionCreator())
    .withPollingMessageActionCreator(setRequestPollingMessage))
  .build();

reducerRegistry.register(reducerName, reduxRestApi.getDataReducer());

const fpBehandlingApi = reduxRestApi.getEndpointApi();
export default fpBehandlingApi;

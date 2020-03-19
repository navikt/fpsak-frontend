import {
  reducerRegistry, setRequestPollingMessage, ReduxEvents, ReduxRestApiBuilder, RestApiConfigBuilder,
} from '@fpsak-frontend/rest-api-redux';
import errorHandler from '@fpsak-frontend/error-api-redux';

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
  FAMILIEHENDELSE: 'FAMILIEHENDELSE',
  SOKNAD: 'SOKNAD',
  SOKNAD_ORIGINAL_BEHANDLING: 'SOKNAD_ORIGINAL_BEHANDLING',
  FAMILIEHENDELSE_ORIGINAL_BEHANDLING: 'FAMILIEHENDELSE_ORIGINAL_BEHANDLING',
  BEREGNINGSRESULTAT_ORIGINAL_BEHANDLING: 'BEREGNINGSRESULTAT_ORIGINAL_BEHANDLING',
  MEDLEMSKAP: 'MEDLEMSKAP',
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
  UTLAND_DOK_STATUS: 'UTLAND_DOK_STATUS',
};

const endpoints = new RestApiConfigBuilder()
  .withAsyncPost('/fpsak/api/behandlinger', FpBehandlingApiKeys.BEHANDLING_FP)

  // behandlingsdata
  .withRel('aksjonspunkter', FpBehandlingApiKeys.AKSJONSPUNKTER)
  .withRel('vilkar', FpBehandlingApiKeys.VILKAR)
  .withRel('soeker-personopplysninger', FpBehandlingApiKeys.PERSONOPPLYSNINGER)
  .withRel('simuleringResultat', FpBehandlingApiKeys.SIMULERING_RESULTAT)
  .withRel('tilbakekrevingvalg', FpBehandlingApiKeys.TILBAKEKREVINGVALG)
  .withRel('beregningsresultat-foreldrepenger', FpBehandlingApiKeys.BEREGNINGRESULTAT_FORELDREPENGER)
  .withRel('beregningsgrunnlag', FpBehandlingApiKeys.BEREGNINGSGRUNNLAG)
  .withRel('familiehendelse-v2', FpBehandlingApiKeys.FAMILIEHENDELSE)
  .withRel('soknad', FpBehandlingApiKeys.SOKNAD)
  .withRel('soknad-original-behandling', FpBehandlingApiKeys.SOKNAD_ORIGINAL_BEHANDLING)
  .withRel('familiehendelse-original-behandling', FpBehandlingApiKeys.FAMILIEHENDELSE_ORIGINAL_BEHANDLING)
  .withRel('beregningsresultat-foreldrepenger-original-behandling', FpBehandlingApiKeys.BEREGNINGSRESULTAT_ORIGINAL_BEHANDLING)
  .withRel('soeker-medlemskap-v2', FpBehandlingApiKeys.MEDLEMSKAP)
  .withRel('uttak-periode-grense', FpBehandlingApiKeys.UTTAK_PERIODE_GRENSE)
  .withRel('inntekt-arbeid-ytelse', FpBehandlingApiKeys.INNTEKT_ARBEID_YTELSE)
  .withRel('soeker-verge', FpBehandlingApiKeys.VERGE)
  .withRel('ytelsefordeling', FpBehandlingApiKeys.YTELSEFORDELING)
  .withRel('opptjening', FpBehandlingApiKeys.OPPTJENING)
  .withRel('sendt-varsel-om-revurdering', FpBehandlingApiKeys.SEND_VARSEL_OM_REVURDERING)
  .withRel('fakta-arbeidsforhold', FpBehandlingApiKeys.FAKTA_ARBEIDSFORHOLD)
  .withRel('uttaksresultat-perioder', FpBehandlingApiKeys.UTTAKSRESULTAT_PERIODER)
  .withRel('uttak-stonadskontoer', FpBehandlingApiKeys.UTTAK_STONADSKONTOER)
  .withRel('uttak-kontroller-fakta-perioder', FpBehandlingApiKeys.UTTAK_KONTROLLER_FAKTA_PERIODER)
  .withRel('utland-dok-status', FpBehandlingApiKeys.UTLAND_DOK_STATUS)

  // operasjoner
  .withRel('lagre-stonadskontoer-gitt-uttaksperioder', FpBehandlingApiKeys.STONADSKONTOER_GITT_UTTAKSPERIODER)
  .withRel('bytt-behandlende-enhet', FpBehandlingApiKeys.BEHANDLING_NY_BEHANDLENDE_ENHET)
  .withRel('henlegg-behandling', FpBehandlingApiKeys.HENLEGG_BEHANDLING)
  .withRel('gjenoppta-behandling', FpBehandlingApiKeys.RESUME_BEHANDLING, { saveResponseIn: FpBehandlingApiKeys.BEHANDLING_FP })
  .withRel('sett-behandling-pa-vent', FpBehandlingApiKeys.BEHANDLING_ON_HOLD)
  .withRel('endre-pa-vent', FpBehandlingApiKeys.UPDATE_ON_HOLD)
  .withRel('opne-for-endringer', FpBehandlingApiKeys.OPEN_BEHANDLING_FOR_CHANGES, { saveResponseIn: FpBehandlingApiKeys.BEHANDLING_FP })
  .withRel('lagre-aksjonspunkter', FpBehandlingApiKeys.SAVE_AKSJONSPUNKT, { saveResponseIn: FpBehandlingApiKeys.BEHANDLING_FP })
  .withRel('lagre-overstyr-aksjonspunkter', FpBehandlingApiKeys.SAVE_OVERSTYRT_AKSJONSPUNKT, { saveResponseIn: FpBehandlingApiKeys.BEHANDLING_FP })
  .withRel('opprett-verge', FpBehandlingApiKeys.VERGE_OPPRETT, { saveResponseIn: FpBehandlingApiKeys.BEHANDLING_FP })
  .withRel('fjern-verge', FpBehandlingApiKeys.VERGE_FJERN, { saveResponseIn: FpBehandlingApiKeys.BEHANDLING_FP })

  /* FPTILBAKE */
  .withPostAndOpenBlob('/fptilbake/api/dokument/forhandsvis-varselbrev', FpBehandlingApiKeys.PREVIEW_TILBAKEKREVING_MESSAGE)

  /* FPFORMIDLING */
  .withPostAndOpenBlob('/fpformidling/api/brev/forhaandsvis', FpBehandlingApiKeys.PREVIEW_MESSAGE)

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

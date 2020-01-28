import { ReduxEvents, ReduxRestApiBuilder, RestApiConfigBuilder } from '@fpsak-frontend/rest-api-redux';
import errorHandler from '@fpsak-frontend/error-api-redux';
import { reducerRegistry, setRequestPollingMessage } from '@fpsak-frontend/fp-felles';

export const SvpBehandlingApiKeys = {
  BEHANDLING_SVP: 'BEHANDLING_SVP',
  UPDATE_ON_HOLD: 'UPDATE_ON_HOLD',
  SAVE_AKSJONSPUNKT: 'SAVE_AKSJONSPUNKT',
  SAVE_OVERSTYRT_AKSJONSPUNKT: 'SAVE_OVERSTYRT_AKSJONSPUNKT',
  PREVIEW_MESSAGE: 'PREVIEW_MESSAGE',
  PREVIEW_TILBAKEKREVING_MESSAGE: 'PREVIEW_TILBAKEKREVING_MESSAGE',
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
  BEREGNINGSRESULTAT_ORIGINAL_BEHANDLING: 'BEREGNINGSRESULTAT_ORIGINAL_BEHANDLING',
  MEDLEMSKAP: 'MEDLEMSKAP',
  MEDLEMSKAP_V2: 'MEDLEMSKAP_V2',
  INNTEKT_ARBEID_YTELSE: 'INNTEKT_ARBEID_YTELSE',
  VERGE: 'VERGE',
  YTELSEFORDELING: 'YTELSEFORDELING',
  OPPTJENING: 'OPPTJENING',
  SEND_VARSEL_OM_REVURDERING: 'SEND_VARSEL_OM_REVURDERING',
  SVANGERSKAPSPENGER_TILRETTELEGGING: 'SVANGERSKAPSPENGER_TILRETTELEGGING',
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
  .withAsyncPost('/fpsak/api/behandlinger', SvpBehandlingApiKeys.BEHANDLING_SVP)
  .withPost('/fpsak/api/behandlinger/endre-pa-vent', SvpBehandlingApiKeys.UPDATE_ON_HOLD)

  /* /api/behandling */
  .withAsyncPost('/fpsak/api/behandling/aksjonspunkt', SvpBehandlingApiKeys.SAVE_AKSJONSPUNKT, {
    storeResultKey: SvpBehandlingApiKeys.BEHANDLING_SVP,
  })
  .withAsyncPost('/fpsak/api/behandling/aksjonspunkt/overstyr', SvpBehandlingApiKeys.SAVE_OVERSTYRT_AKSJONSPUNKT, {
    storeResultKey: SvpBehandlingApiKeys.BEHANDLING_SVP,
  })

  /* fptilbake/api/dokument */
  .withPostAndOpenBlob('/fptilbake/api/dokument/forhandsvis-varselbrev', SvpBehandlingApiKeys.PREVIEW_TILBAKEKREVING_MESSAGE)

  /* /api/brev */
  .withPostAndOpenBlob('/fpformidling/api/brev/forhaandsvis', SvpBehandlingApiKeys.PREVIEW_MESSAGE)

  .withInjectedPath('aksjonspunkter', SvpBehandlingApiKeys.AKSJONSPUNKTER)
  .withInjectedPath('vilkar', SvpBehandlingApiKeys.VILKAR)
  .withInjectedPath('soeker-personopplysninger', SvpBehandlingApiKeys.PERSONOPPLYSNINGER)
  .withInjectedPath('simuleringResultat', SvpBehandlingApiKeys.SIMULERING_RESULTAT)
  .withInjectedPath('tilbakekrevingvalg', SvpBehandlingApiKeys.TILBAKEKREVINGVALG)
  .withInjectedPath('beregningsresultat-foreldrepenger', SvpBehandlingApiKeys.BEREGNINGRESULTAT_FORELDREPENGER)
  .withInjectedPath('beregningsgrunnlag', SvpBehandlingApiKeys.BEREGNINGSGRUNNLAG)
  .withInjectedPath('beregningsresultat-foreldrepenger', SvpBehandlingApiKeys.BEREGNINGRESULTAT)
  .withInjectedPath('familiehendelse-v2', SvpBehandlingApiKeys.FAMILIEHENDELSE)
  .withInjectedPath('soknad', SvpBehandlingApiKeys.SOKNAD)
  .withInjectedPath('beregningsresultat-engangsstonad-original-behandling', SvpBehandlingApiKeys.BEREGNINGSRESULTAT_ORIGINAL_BEHANDLING)
  .withInjectedPath('soeker-medlemskap', SvpBehandlingApiKeys.MEDLEMSKAP)
  .withInjectedPath('soeker-medlemskap-v2', SvpBehandlingApiKeys.MEDLEMSKAP_V2)
  .withInjectedPath('inntekt-arbeid-ytelse', SvpBehandlingApiKeys.INNTEKT_ARBEID_YTELSE)
  .withInjectedPath('soeker-verge', SvpBehandlingApiKeys.VERGE)
  .withInjectedPath('ytelsefordeling', SvpBehandlingApiKeys.YTELSEFORDELING)
  .withInjectedPath('opptjening', SvpBehandlingApiKeys.OPPTJENING)
  .withInjectedPath('sendt-varsel-om-revurdering', SvpBehandlingApiKeys.SEND_VARSEL_OM_REVURDERING)
  .withInjectedPath('svangerskapspenger-tilrettelegging', SvpBehandlingApiKeys.SVANGERSKAPSPENGER_TILRETTELEGGING)

  .withPost('/fpsak/api/behandlinger/bytt-enhet', SvpBehandlingApiKeys.BEHANDLING_NY_BEHANDLENDE_ENHET)
  .withPost('/fpsak/api/behandlinger/henlegg', SvpBehandlingApiKeys.HENLEGG_BEHANDLING)
  .withAsyncPost('/fpsak/api/behandlinger/gjenoppta', SvpBehandlingApiKeys.RESUME_BEHANDLING, {
    storeResultKey: SvpBehandlingApiKeys.BEHANDLING_SVP,
  })
  .withPost('/fpsak/api/behandlinger/sett-pa-vent', SvpBehandlingApiKeys.BEHANDLING_ON_HOLD)
  .withPost('/fpsak/api/behandlinger/opne-for-endringer', SvpBehandlingApiKeys.OPEN_BEHANDLING_FOR_CHANGES, {
    storeResultKey: SvpBehandlingApiKeys.BEHANDLING_SVP,
  })
  .withPost('/fpsak/api//verge/opprett', SvpBehandlingApiKeys.VERGE_OPPRETT, {
    storeResultKey: SvpBehandlingApiKeys.BEHANDLING_SVP,
  })
  .withPost('/fpsak/api//verge/fjern', SvpBehandlingApiKeys.VERGE_FJERN, {
    storeResultKey: SvpBehandlingApiKeys.BEHANDLING_SVP,
  })

  .build();

const reducerName = 'dataContextSvpBehandling';

export const reduxRestApi = new ReduxRestApiBuilder(endpoints, reducerName)
  .withReduxEvents(new ReduxEvents()
    .withErrorActionCreator(errorHandler.getErrorActionCreator())
    .withPollingMessageActionCreator(setRequestPollingMessage))
  .build();

reducerRegistry.register(reducerName, reduxRestApi.getDataReducer());

const svpBehandlingApi = reduxRestApi.getEndpointApi();
export default svpBehandlingApi;

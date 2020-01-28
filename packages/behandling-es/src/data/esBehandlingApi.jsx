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
  AKSJONSPUNKTER: 'AKSJONSPUNKTER',
  VILKAR: 'VILKAR',
  PERSONOPPLYSNINGER: 'PERSONOPPLYSNINGER',
  SIMULERING_RESULTAT: 'SIMULERING_RESULTAT',
  TILBAKEKREVINGVALG: 'TILBAKEKREVINGVALG',
  BEREGNINGRESULTAT_ENGANGSSTONAD: 'BEREGNINGRESULTAT_ENGANGSSTONAD',
  BEREGNINGRESULTAT: 'BEREGNINGRESULTAT',
  FAMILIEHENDELSE: 'FAMILIEHENDELSE',
  SOKNAD: 'SOKNAD',
  SOKNAD_ORIGINAL_BEHANDLING: 'SOKNAD_ORIGINAL_BEHANDLING',
  FAMILIEHENDELSE_ORIGINAL_BEHANDLING: 'FAMILIEHENDELSE_ORIGINAL_BEHANDLING',
  BEREGNINGSRESULTAT_ORIGINAL_BEHANDLING: 'BEREGNINGSRESULTAT_ORIGINAL_BEHANDLING',
  MEDLEMSKAP: 'MEDLEMSKAP',
  MEDLEMSKAP_V2: 'MEDLEMSKAP_V2',
  INNTEKT_ARBEID_YTELSE: 'INNTEKT_ARBEID_YTELSE',
  VERGE: 'VERGE',
  SEND_VARSEL_OM_REVURDERING: 'SEND_VARSEL_OM_REVURDERING',
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
  .withAsyncPost('/fpsak/api/behandlinger', EsBehandlingApiKeys.BEHANDLING_ES)
  .withPost('/fpsak/api/behandlinger/endre-pa-vent', EsBehandlingApiKeys.UPDATE_ON_HOLD)

  /* /api/behandling */
  .withAsyncPost('/fpsak/api/behandling/aksjonspunkt', EsBehandlingApiKeys.SAVE_AKSJONSPUNKT, {
    storeResultKey: EsBehandlingApiKeys.BEHANDLING_ES,
  })
  .withAsyncPost('/fpsak/api/behandling/aksjonspunkt/overstyr', EsBehandlingApiKeys.SAVE_OVERSTYRT_AKSJONSPUNKT, {
    storeResultKey: EsBehandlingApiKeys.BEHANDLING_ES,
  })

  /* fptilbake/api/dokument */
  .withPostAndOpenBlob('/fptilbake/api/dokument/forhandsvis-varselbrev', EsBehandlingApiKeys.PREVIEW_TILBAKEKREVING_MESSAGE)

  /* /api/brev */
  .withPostAndOpenBlob('/fpformidling/api/brev/forhaandsvis', EsBehandlingApiKeys.PREVIEW_MESSAGE)

  .withInjectedPath('aksjonspunkter', EsBehandlingApiKeys.AKSJONSPUNKTER)
  .withInjectedPath('vilkar', EsBehandlingApiKeys.VILKAR)
  .withInjectedPath('soeker-personopplysninger', EsBehandlingApiKeys.PERSONOPPLYSNINGER)
  .withInjectedPath('simuleringResultat', EsBehandlingApiKeys.SIMULERING_RESULTAT)
  .withInjectedPath('tilbakekrevingvalg', EsBehandlingApiKeys.TILBAKEKREVINGVALG)
  .withInjectedPath('beregningsresultat-engangsstonad', EsBehandlingApiKeys.BEREGNINGRESULTAT_ENGANGSSTONAD)
  .withInjectedPath('beregningsresultat-foreldrepenger', EsBehandlingApiKeys.BEREGNINGRESULTAT)
  .withInjectedPath('familiehendelse-v2', EsBehandlingApiKeys.FAMILIEHENDELSE)
  .withInjectedPath('soknad', EsBehandlingApiKeys.SOKNAD)
  .withInjectedPath('soknad-original-behandling', EsBehandlingApiKeys.SOKNAD_ORIGINAL_BEHANDLING)
  .withInjectedPath('familiehendelse-original-behandling', EsBehandlingApiKeys.FAMILIEHENDELSE_ORIGINAL_BEHANDLING)
  .withInjectedPath('beregningsresultat-engangsstonad-original-behandling', EsBehandlingApiKeys.BEREGNINGSRESULTAT_ORIGINAL_BEHANDLING)
  .withInjectedPath('soeker-medlemskap', EsBehandlingApiKeys.MEDLEMSKAP)
  .withInjectedPath('soeker-medlemskap-v2', EsBehandlingApiKeys.MEDLEMSKAP_V2)
  .withInjectedPath('inntekt-arbeid-ytelse', EsBehandlingApiKeys.INNTEKT_ARBEID_YTELSE)
  .withInjectedPath('soeker-verge', EsBehandlingApiKeys.VERGE)
  .withInjectedPath('sendt-varsel-om-revurdering', EsBehandlingApiKeys.SEND_VARSEL_OM_REVURDERING)

  .withPost('/fpsak/api/behandlinger/bytt-enhet', EsBehandlingApiKeys.BEHANDLING_NY_BEHANDLENDE_ENHET)
  .withPost('/fpsak/api/behandlinger/henlegg', EsBehandlingApiKeys.HENLEGG_BEHANDLING)
  .withAsyncPost('/fpsak/api/behandlinger/gjenoppta', EsBehandlingApiKeys.RESUME_BEHANDLING, {
    storeResultKey: EsBehandlingApiKeys.BEHANDLING_ES,
  })
  .withPost('/fpsak/api/behandlinger/sett-pa-vent', EsBehandlingApiKeys.BEHANDLING_ON_HOLD)
  .withPost('/fpsak/api/behandlinger/opne-for-endringer', EsBehandlingApiKeys.OPEN_BEHANDLING_FOR_CHANGES, {
    storeResultKey: EsBehandlingApiKeys.BEHANDLING_ES,
  })
  .withPost('/fpsak/api/verge/opprett', EsBehandlingApiKeys.VERGE_OPPRETT, {
    storeResultKey: EsBehandlingApiKeys.BEHANDLING_ES,
  })
  .withPost('/fpsak/api/verge/fjern', EsBehandlingApiKeys.VERGE_FJERN, {
    storeResultKey: EsBehandlingApiKeys.BEHANDLING_ES,
  })

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

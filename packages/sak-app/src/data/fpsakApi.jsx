import { ReduxEvents, ReduxRestApiBuilder, RestApiConfigBuilder } from '@fpsak-frontend/rest-api-redux';
import errorHandler from '@fpsak-frontend/error-api-redux';
import { reducerRegistry, setRequestPollingMessage } from '@fpsak-frontend/fp-felles';

export const FpsakApiKeys = {
  LANGUAGE_FILE: 'LANGUAGE_FILE',
  KODEVERK: 'KODEVERK',
  KODEVERK_FPTILBAKE: 'KODEVERK_FPTILBAKE',
  NAV_ANSATT: 'NAV_ANSATT',
  SEARCH_FAGSAK: 'SEARCH_FAGSAK',
  FETCH_FAGSAK: 'FETCH_FAGSAK',
  BEHANDLINGER_FPSAK: 'BEHANDLINGER_FPSAK',
  BEHANDLINGER_FPTILBAKE: 'BEHANDLINGER_FPTILBAKE',
  ANNEN_PART_BEHANDLING: 'ANNEN_PART_BEHANDLING',
  BEHANDLENDE_ENHETER: 'BEHANDLENDE_ENHETER',
  NEW_BEHANDLING_FPSAK: 'NEW_BEHANDLING_FPSAK',
  NEW_BEHANDLING_FPTILBAKE: 'NEW_BEHANDLING_FPTILBAKE',
  ALL_DOCUMENTS: 'ALL_DOCUMENTS',
  DOCUMENT: 'DOCUMENT',
  HISTORY_FPSAK: 'HISTORY_FPSAK',
  HISTORY_FPTILBAKE: 'HISTORY_FPTILBAKE',
  SHOW_DETAILED_ERROR_MESSAGES: 'SHOW_DETAILED_ERROR_MESSAGES',
  INTEGRATION_STATUS: 'INTEGRATION_STATUS',
  FEATURE_TOGGLE: 'FEATURE_TOGGLE',
  AKTOER_INFO: 'AKTOER_INFO',
  BEHANDLING_NY_BEHANDLENDE_ENHET: 'BEHANDLING_NY_BEHANDLENDE_ENHET',
  OPEN_BEHANDLING_FOR_CHANGES: 'OPEN_BEHANDLING_FOR_CHANGES',
  HENLEGG_BEHANDLING: 'HENLEGG_BEHANDLING',
  RESUME_BEHANDLING: 'RESUME_BEHANDLING',
  BEHANDLING_ON_HOLD: 'BEHANDLING_ON_HOLD',
  KONTROLLRESULTAT: 'KONTROLLRESULTAT',
  RISIKO_AKSJONSPUNKT: 'RISIKO_AKSJONSPUNKT',
  LAGRE_RISIKO_AKSJONSPUNKT: 'LAGRE_RISIKO_AKSJONSPUNKT',
  TOTRINNSAKSJONSPUNKT_ARSAKER: 'TOTRINNSAKSJONSPUNKT_ARSAKER',
  SAVE_TOTRINNSAKSJONSPUNKT: 'SAVE_TOTRINNSAKSJONSPUNKT',
  TOTRINNSAKSJONSPUNKT_ARSAKER_READONLY: 'TOTRINNSAKSJONSPUNKT_ARSAKER_READONLY',
  BREVMALER: 'BREVMALER',
  SUBMIT_MESSAGE: 'SUBMIT_MESSAGE',
  PREVIEW_MESSAGE_TILBAKEKREVING: 'PREVIEW_MESSAGE_TILBAKEKREVING',
  PREVIEW_MESSAGE_FORMIDLING: 'PREVIEW_MESSAGE_FORMIDLING',
  KAN_TILBAKEKREVING_OPPRETTES: 'KAN_TILBAKEKREVING_OPPRETTES',
  KAN_TILBAKEKREVING_REVURDERING_OPPRETTES: 'KAN_TILBAKEKREVING_REVURDERING_OPPRETTES',
  VERGE_MENYVALG: 'VERGE_MENYVALG',
  VERGE_OPPRETT: 'VERGE_OPPRETT',
  VERGE_FJERN: 'VERGE_FJERN',
  MENYHANDLING_RETTIGHETER: 'MENYHANDLING_RETTIGHETER',
  HAR_APENT_KONTROLLER_REVURDERING_AP: 'HAR_APENT_KONTROLLER_REVURDERING_AP',
  TOTRINNS_KLAGE_VURDERING: 'TOTRINNS_KLAGE_VURDERING',
  HAR_REVURDERING_SAMME_RESULTAT: 'HAR_REVURDERING_SAMME_RESULTAT',
};


const endpoints = new RestApiConfigBuilder()

  /* /api/fagsak */
  .withPost('/fpsak/api/fagsak/sok', FpsakApiKeys.SEARCH_FAGSAK)
  .withGet('/fpsak/api/fagsak', FpsakApiKeys.FETCH_FAGSAK)

  /* /fpsak/api/behandlinger */
  .withGet('/fpsak/api/behandlinger/alle', FpsakApiKeys.BEHANDLINGER_FPSAK, { fetchLinkDataAutomatically: false })
  .withAsyncPut('/fpsak/api/behandlinger', FpsakApiKeys.NEW_BEHANDLING_FPSAK, { fetchLinkDataAutomatically: false })
  .withGet('/fpsak/api/behandlinger/annen-part-behandling', FpsakApiKeys.ANNEN_PART_BEHANDLING)
  .withInjectedPath('bytt-behandlende-enhet', FpsakApiKeys.BEHANDLING_NY_BEHANDLENDE_ENHET)
  .withInjectedPath('opne-for-endringer', FpsakApiKeys.OPEN_BEHANDLING_FOR_CHANGES)
  .withInjectedPath('henlegg-behandling', FpsakApiKeys.HENLEGG_BEHANDLING)
  .withInjectedPath('gjenoppta-behandling', FpsakApiKeys.RESUME_BEHANDLING)
  .withInjectedPath('sett-behandling-pa-vent', FpsakApiKeys.BEHANDLING_ON_HOLD)
  .withInjectedPath('finn-menyvalg-for-verge', FpsakApiKeys.VERGE_MENYVALG)
  .withInjectedPath('opprett-verge', FpsakApiKeys.VERGE_OPPRETT, { fetchLinkDataAutomatically: false })
  .withInjectedPath('fjern-verge', FpsakApiKeys.VERGE_FJERN, { fetchLinkDataAutomatically: false })
  .withInjectedPath('handling-rettigheter', FpsakApiKeys.MENYHANDLING_RETTIGHETER)

  /* /fptilbake/api/behandlinger */
  .withAsyncPost('/fptilbake/api/behandlinger/opprett', FpsakApiKeys.NEW_BEHANDLING_FPTILBAKE, { fetchLinkDataAutomatically: false })
  .withGet('/fptilbake/api/behandlinger/kan-opprettes', FpsakApiKeys.KAN_TILBAKEKREVING_OPPRETTES)
  .withGet('/fptilbake/api/behandlinger/kan-revurdering-opprettes', FpsakApiKeys.KAN_TILBAKEKREVING_REVURDERING_OPPRETTES)
  .withGet('/fptilbake/api/behandlinger/alle', FpsakApiKeys.BEHANDLINGER_FPTILBAKE, { fetchLinkDataAutomatically: false })

  /* /api/behandling/beregningsresultat */
  .withInjectedPath('har-samme-resultat', FpsakApiKeys.HAR_REVURDERING_SAMME_RESULTAT)

  /* Totrinnskontroll */
  .withInjectedPath('totrinnskontroll-arsaker', FpsakApiKeys.TOTRINNSAKSJONSPUNKT_ARSAKER)
  .withInjectedPath('bekreft-totrinnsaksjonspunkt', FpsakApiKeys.SAVE_TOTRINNSAKSJONSPUNKT)
  .withInjectedPath('totrinnskontroll-arsaker-readOnly', FpsakApiKeys.TOTRINNSAKSJONSPUNKT_ARSAKER_READONLY)
  .withInjectedPath('klage-vurdering', FpsakApiKeys.TOTRINNS_KLAGE_VURDERING)

  /* Brev */
  .withInjectedPath('brev-maler', FpsakApiKeys.BREVMALER)
  .withInjectedPath('brev-bestill', FpsakApiKeys.SUBMIT_MESSAGE)
  .withInjectedPath('har-apent-kontroller-revurdering-aksjonspunkt', FpsakApiKeys.HAR_APENT_KONTROLLER_REVURDERING_AP)

  /* Kontrollresultat */
  .withInjectedPath('kontrollresultat', FpsakApiKeys.KONTROLLRESULTAT)
  .withInjectedPath('risikoklassifisering-aksjonspunkt', FpsakApiKeys.RISIKO_AKSJONSPUNKT)
  .withInjectedPath('lagre-risikoklassifisering-aksjonspunkt', FpsakApiKeys.LAGRE_RISIKO_AKSJONSPUNKT)

  /* /api/dokument */
  .withGet('/fpsak/api/dokument/hent-dokumentliste', FpsakApiKeys.ALL_DOCUMENTS)
  .withGet('/fpsak/api/dokument/hent-dokument', FpsakApiKeys.DOCUMENT)

  /* /api/historikk */
  .withGet('/fpsak/api/historikk', FpsakApiKeys.HISTORY_FPSAK)
  .withGet('/fptilbake/api/historikk', FpsakApiKeys.HISTORY_FPTILBAKE)

  /* /api/kodeverk */
  .withGet('/fpsak/api/kodeverk', FpsakApiKeys.KODEVERK)
  .withGet('/fptilbake/api/kodeverk', FpsakApiKeys.KODEVERK_FPTILBAKE)
  .withGet('/fpsak/api/kodeverk/behandlende-enheter', FpsakApiKeys.BEHANDLENDE_ENHETER)

  /* /api/nav-ansatt */
  .withGet('/fpsak/api/nav-ansatt', FpsakApiKeys.NAV_ANSATT)

  /* /api/integrasjon */
  .withGet('/fpsak/api/integrasjon/status', FpsakApiKeys.INTEGRATION_STATUS)
  .withGet('/fpsak/api/integrasjon/status/vises', FpsakApiKeys.SHOW_DETAILED_ERROR_MESSAGES)

  /* /api/aktoer */
  .withGet('/fpsak/api/aktoer-info', FpsakApiKeys.AKTOER_INFO)


  /* fpformidling/api/brev */
  .withPostAndOpenBlob('/fpformidling/api/brev/forhaandsvis', FpsakApiKeys.PREVIEW_MESSAGE_FORMIDLING)
  .withPostAndOpenBlob('/fptilbake/api/brev/forhandsvis', FpsakApiKeys.PREVIEW_MESSAGE_TILBAKEKREVING)

  /* /sprak */
  .withGet('/fpsak/public/sprak/nb_NO.json', FpsakApiKeys.LANGUAGE_FILE)

  /* /api/feature-toggle */
  .withPost('/fpsak/api/feature-toggle', FpsakApiKeys.FEATURE_TOGGLE)

  .build();

const reducerName = 'dataContext';

export const reduxRestApi = new ReduxRestApiBuilder(endpoints, reducerName)
  .withReduxEvents(new ReduxEvents()
    .withErrorActionCreator(errorHandler.getErrorActionCreator())
    .withPollingMessageActionCreator(setRequestPollingMessage))
  .build();

reducerRegistry.register(reducerName, reduxRestApi.getDataReducer());

const fpsakApi = reduxRestApi.getEndpointApi();
export default fpsakApi;

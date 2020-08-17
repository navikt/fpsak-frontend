import { RestApiConfigBuilder, createRequestApi } from '@fpsak-frontend/rest-api-new';
import { RestApiHooks } from '@fpsak-frontend/rest-api-hooks';

export enum FpsakApiKeys {
  KODEVERK = 'KODEVERK',
  KODEVERK_FPTILBAKE = 'KODEVERK_FPTILBAKE',
  LANGUAGE_FILE = 'LANGUAGE_FILE',
  NAV_ANSATT = 'NAV_ANSATT',
  BEHANDLENDE_ENHETER = 'BEHANDLENDE_ENHETER',
  FEATURE_TOGGLE = 'FEATURE_TOGGLE',
  SEARCH_FAGSAK = 'SEARCH_FAGSAK',
  FETCH_FAGSAK = 'FETCH_FAGSAK',
  BEHANDLINGER_FPSAK = 'BEHANDLINGER_FPSAK',
  BEHANDLINGER_FPTILBAKE = 'BEHANDLINGER_FPTILBAKE',
  BEHANDLING_PERSONOPPLYSNINGER = 'BEHANDLING_PERSONOPPLYSNINGER',
  NEW_BEHANDLING_FPSAK = 'NEW_BEHANDLING_FPSAK',
  NEW_BEHANDLING_FPTILBAKE = 'NEW_BEHANDLING_FPTILBAKE',
  BEHANDLING_FAMILIE_HENDELSE = 'BEHANDLING_FAMILIE_HENDELSE',
  ANNEN_PART_BEHANDLING = 'ANNEN_PART_BEHANDLING',
  SHOW_DETAILED_ERROR_MESSAGES = 'SHOW_DETAILED_ERROR_MESSAGES',
  INTEGRATION_STATUS = 'INTEGRATION_STATUS',
  HISTORY_FPSAK = 'HISTORY_FPSAK',
  HISTORY_FPTILBAKE = 'HISTORY_FPTILBAKE',
  KONTROLLRESULTAT = 'KONTROLLRESULTAT',
  RISIKO_AKSJONSPUNKT = 'RISIKO_AKSJONSPUNKT',
  TOTRINNS_KLAGE_VURDERING = 'TOTRINNS_KLAGE_VURDERING',
  TOTRINNSAKSJONSPUNKT_ARSAKER = 'TOTRINNSAKSJONSPUNKT_ARSAKER',
  TOTRINNSAKSJONSPUNKT_ARSAKER_READONLY = 'TOTRINNSAKSJONSPUNKT_ARSAKER_READONLY',
  AKTOER_INFO = 'AKTOER_INFO',
  ALL_DOCUMENTS = 'ALL_DOCUMENTS',
  HAR_REVURDERING_SAMME_RESULTAT = 'HAR_REVURDERING_SAMME_RESULTAT',
  SAVE_TOTRINNSAKSJONSPUNKT = 'SAVE_TOTRINNSAKSJONSPUNKT',
  HAR_APENT_KONTROLLER_REVURDERING_AP = 'HAR_APENT_KONTROLLER_REVURDERING_AP',
  BREVMALER = 'BREVMALER',
  SUBMIT_MESSAGE = 'SUBMIT_MESSAGE',
  MENYHANDLING_RETTIGHETER = 'MENYHANDLING_RETTIGHETER',
  VERGE_MENYVALG = 'VERGE_MENYVALG',
  KAN_TILBAKEKREVING_OPPRETTES = 'KAN_TILBAKEKREVING_OPPRETTES',
  KAN_TILBAKEKREVING_REVURDERING_OPPRETTES = 'KAN_TILBAKEKREVING_REVURDERING_OPPRETTES',
  PREVIEW_MESSAGE_TILBAKEKREVING = 'PREVIEW_MESSAGE_TILBAKEKREVING',
  PREVIEW_MESSAGE_FORMIDLING = 'PREVIEW_MESSAGE_FORMIDLING',
  PREVIEW_MESSAGE_TILBAKEKREVING_HENLEGGELSE = 'PREVIEW_MESSAGE_TILBAKEKREVING_HENLEGGELSE',
}

const CONTEXT_PATH = '';

const endpoints = new RestApiConfigBuilder(CONTEXT_PATH)
  .withPost('/fpsak/api/fagsak/sok', FpsakApiKeys.SEARCH_FAGSAK)
  .withPost('/fpsak/api/feature-toggle', FpsakApiKeys.FEATURE_TOGGLE)
  .withPost('/fpformidling/api/brev/forhaandsvis', FpsakApiKeys.PREVIEW_MESSAGE_FORMIDLING)
  .withPost('/fptilbake/api/brev/forhandsvis', FpsakApiKeys.PREVIEW_MESSAGE_TILBAKEKREVING)
  .withPost('/fptilbake/api/dokument/forhandsvis-henleggelsesbrev', FpsakApiKeys.PREVIEW_MESSAGE_TILBAKEKREVING_HENLEGGELSE)
  .withAsyncPut('/fpsak/api/behandlinger', FpsakApiKeys.NEW_BEHANDLING_FPSAK)
  .withAsyncPost('/fptilbake/api/behandlinger/opprett', FpsakApiKeys.NEW_BEHANDLING_FPTILBAKE)
  .withGet('/fpsak/api/behandlinger/alle', FpsakApiKeys.BEHANDLINGER_FPSAK)
  .withGet('/fptilbake/api/behandlinger/alle', FpsakApiKeys.BEHANDLINGER_FPTILBAKE)
  .withGet('/fpsak/api/fagsak', FpsakApiKeys.FETCH_FAGSAK)
  .withGet('/fpsak/api/behandlinger/annen-part-behandling', FpsakApiKeys.ANNEN_PART_BEHANDLING)
  .withGet('/fpsak/api/nav-ansatt', FpsakApiKeys.NAV_ANSATT)
  .withGet('/fpsak/public/sprak/nb_NO.json', FpsakApiKeys.LANGUAGE_FILE)
  .withGet('/fpsak/api/kodeverk', FpsakApiKeys.KODEVERK)
  .withGet('/fpsak/api/kodeverk/behandlende-enheter', FpsakApiKeys.BEHANDLENDE_ENHETER)
  .withGet('/fpsak/api/integrasjon/status/vises', FpsakApiKeys.SHOW_DETAILED_ERROR_MESSAGES)
  .withGet('/fpsak/api/integrasjon/status', FpsakApiKeys.INTEGRATION_STATUS)
  .withGet('/fpsak/api/aktoer-info', FpsakApiKeys.AKTOER_INFO)
  .withGet('/fpsak/api/historikk', FpsakApiKeys.HISTORY_FPSAK)
  .withGet('/fptilbake/api/historikk', FpsakApiKeys.HISTORY_FPTILBAKE)
  .withGet('/fptilbake/api/kodeverk', FpsakApiKeys.KODEVERK_FPTILBAKE)
  .withGet('/fpsak/api/dokument/hent-dokumentliste', FpsakApiKeys.ALL_DOCUMENTS)
  .withGet('/fptilbake/api/behandlinger/kan-opprettes', FpsakApiKeys.KAN_TILBAKEKREVING_OPPRETTES)
  .withGet('/fptilbake/api/behandlinger/kan-revurdering-opprettes', FpsakApiKeys.KAN_TILBAKEKREVING_REVURDERING_OPPRETTES)
  .withRel('soeker-personopplysninger', FpsakApiKeys.BEHANDLING_PERSONOPPLYSNINGER)
  .withRel('familiehendelse-v2', FpsakApiKeys.BEHANDLING_FAMILIE_HENDELSE)
  .withRel('kontrollresultat', FpsakApiKeys.KONTROLLRESULTAT)
  .withRel('risikoklassifisering-aksjonspunkt', FpsakApiKeys.RISIKO_AKSJONSPUNKT)
  .withRel('klage-vurdering', FpsakApiKeys.TOTRINNS_KLAGE_VURDERING)
  .withRel('totrinnskontroll-arsaker', FpsakApiKeys.TOTRINNSAKSJONSPUNKT_ARSAKER)
  .withRel('totrinnskontroll-arsaker-readOnly', FpsakApiKeys.TOTRINNSAKSJONSPUNKT_ARSAKER_READONLY)
  .withRel('har-samme-resultat', FpsakApiKeys.HAR_REVURDERING_SAMME_RESULTAT)
  .withRel('bekreft-totrinnsaksjonspunkt', FpsakApiKeys.SAVE_TOTRINNSAKSJONSPUNKT)
  .withRel('har-apent-kontroller-revurdering-aksjonspunkt', FpsakApiKeys.HAR_APENT_KONTROLLER_REVURDERING_AP)
  .withRel('brev-maler', FpsakApiKeys.BREVMALER)
  .withRel('brev-bestill', FpsakApiKeys.SUBMIT_MESSAGE)
  .withRel('handling-rettigheter', FpsakApiKeys.MENYHANDLING_RETTIGHETER)
  .withRel('finn-menyvalg-for-verge', FpsakApiKeys.VERGE_MENYVALG)
  .build();

export const requestApi = createRequestApi(endpoints);

export const restApiHooks = RestApiHooks.initHooks(requestApi);

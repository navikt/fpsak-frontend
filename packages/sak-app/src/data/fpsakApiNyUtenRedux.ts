import { RestApiConfigBuilder, createRequestApi } from '@fpsak-frontend/rest-api-new';
import { getUseRestApi, getUseRestApiRunner, getUseGlobalStateRestApi } from '@fpsak-frontend/rest-api-hooks';

export enum FpsakApiKeys {
  KODEVERK = 'KODEVERK',
  KODEVERK_FPTILBAKE = 'KODEVERK_FPTILBAKE',
  LANGUAGE_FILE = 'LANGUAGE_FILE',
  NAV_ANSATT = 'NAV_ANSATT',
  BEHANDLENDE_ENHETER = 'BEHANDLENDE_ENHETER',
  FEATURE_TOGGLE = 'FEATURE_TOGGLE',
  SEARCH_FAGSAK = 'SEARCH_FAGSAK',
  BEHANDLING_PERSONOPPLYSNINGER = 'BEHANDLING_PERSONOPPLYSNINGER',
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
}

const CONTEXT_PATH = '';

const endpoints = new RestApiConfigBuilder(CONTEXT_PATH)
  .withPost('/fpsak/api/fagsak/sok', FpsakApiKeys.SEARCH_FAGSAK)
  .withPost('/fpsak/api/feature-toggle', FpsakApiKeys.FEATURE_TOGGLE)
  .withGet('/fpsak/api/behandlinger/annen-part-behandling', FpsakApiKeys.ANNEN_PART_BEHANDLING)
  .withGet('/fpsak/api/nav-ansatt', FpsakApiKeys.NAV_ANSATT)
  .withGet('/fpsak/public/sprak/nb_NO.json', FpsakApiKeys.LANGUAGE_FILE)
  .withGet('/fpsak/api/kodeverk', FpsakApiKeys.KODEVERK)
  .withGet('/fpsak/api/kodeverk/behandlende-enheter', FpsakApiKeys.BEHANDLENDE_ENHETER)
  .withGet('/fpsak/api/integrasjon/status/vises', FpsakApiKeys.SHOW_DETAILED_ERROR_MESSAGES)
  .withGet('/fpsak/api/integrasjon/status', FpsakApiKeys.INTEGRATION_STATUS)
  .withGet('/fpsak/api/historikk', FpsakApiKeys.HISTORY_FPSAK)
  .withGet('/fptilbake/api/historikk', FpsakApiKeys.HISTORY_FPTILBAKE)
  .withGet('/fptilbake/api/kodeverk', FpsakApiKeys.KODEVERK_FPTILBAKE)
  .withRel('soeker-personopplysninger', FpsakApiKeys.BEHANDLING_PERSONOPPLYSNINGER)
  .withRel('familiehendelse-v2', FpsakApiKeys.BEHANDLING_FAMILIE_HENDELSE)
  .withRel('kontrollresultat', FpsakApiKeys.KONTROLLRESULTAT)
  .withRel('risikoklassifisering-aksjonspunkt', FpsakApiKeys.RISIKO_AKSJONSPUNKT)
  .withRel('klage-vurdering', FpsakApiKeys.TOTRINNS_KLAGE_VURDERING)
  .withRel('totrinnskontroll-arsaker', FpsakApiKeys.TOTRINNSAKSJONSPUNKT_ARSAKER)
  .withRel('totrinnskontroll-arsaker-readOnly', FpsakApiKeys.TOTRINNSAKSJONSPUNKT_ARSAKER_READONLY)
  .build();

export const requestApi = createRequestApi(endpoints);

export const useRestApi = getUseRestApi(requestApi);
export const useRestApiRunner = getUseRestApiRunner(requestApi);
export const useGlobalStateRestApi = getUseGlobalStateRestApi(requestApi);

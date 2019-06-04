import {
  RestApiConfigBuilder, ReduxRestApiBuilder, ReduxEvents,
} from '@fpsak-frontend/rest-api-redux';
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
  NEW_BEHANDLING: 'NEW_BEHANDLING',
  SAVE_TOTRINNSAKSJONSPUNKT: 'SAVE_TOTRINNSAKSJONSPUNKT',
  SAVE_TOTRINNSAKSJONSPUNKT_FPTILBAKE: 'SAVE_TOTRINNSAKSJONSPUNKT_FPTILBAKE',
  ALL_DOCUMENTS: 'ALL_DOCUMENTS',
  DOCUMENT: 'DOCUMENT',
  FORHANDSVISNING_FORVED_BREV: 'FORHANDSVISNING_FORVED_BREV',
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
};

const endpoints = new RestApiConfigBuilder()

  /* /api/fagsak */
  .withPost('/fpsak/api/fagsak/sok', FpsakApiKeys.SEARCH_FAGSAK)
  .withGet('/fpsak/api/fagsak', FpsakApiKeys.FETCH_FAGSAK)

  /* /api/behandlinger */
  .withGet('/fpsak/api/behandlinger/alle', FpsakApiKeys.BEHANDLINGER_FPSAK, { fetchLinkDataAutomatically: false })
  .withGet('/fptilbake/api/behandlinger/alle', FpsakApiKeys.BEHANDLINGER_FPTILBAKE, { fetchLinkDataAutomatically: false })
  .withAsyncPut('/fpsak/api/behandlinger', FpsakApiKeys.NEW_BEHANDLING)
  .withGet('/fpsak/api/behandlinger/annen-part-behandling', FpsakApiKeys.ANNEN_PART_BEHANDLING)
  .withInjectedPath('bytt-behandlende-enhet', FpsakApiKeys.BEHANDLING_NY_BEHANDLENDE_ENHET)
  .withInjectedPath('opne-for-endringer', FpsakApiKeys.OPEN_BEHANDLING_FOR_CHANGES)
  .withInjectedPath('henlegg-behandling', FpsakApiKeys.HENLEGG_BEHANDLING)
  .withInjectedPath('gjenoppta-behandling', FpsakApiKeys.RESUME_BEHANDLING)
  .withInjectedPath('sett-behandling-pa-vent', FpsakApiKeys.BEHANDLING_ON_HOLD)

  /* /api/behandling */
  .withAsyncPost('/fpsak/api/behandling/aksjonspunkt', FpsakApiKeys.SAVE_TOTRINNSAKSJONSPUNKT)
  .withAsyncPost('/fptilbake/api/behandling/aksjonspunkt', FpsakApiKeys.SAVE_TOTRINNSAKSJONSPUNKT_FPTILBAKE)

  /* /api/dokument */
  .withGet('/fpsak/api/dokument/hent-dokumentliste', FpsakApiKeys.ALL_DOCUMENTS)
  .withGet('/fpsak/api/dokument/hent-dokument', FpsakApiKeys.DOCUMENT)

  /* /api/historikk */
  .withGet('/fpsak/api/historikk', FpsakApiKeys.HISTORY_FPSAK)
  .withGet('/fptilbake/api/historikk', FpsakApiKeys.HISTORY_FPTILBAKE)

  /* /api/dokumentbestiller */
  .withPostAndOpenBlob('/fpsak/api/dokumentbestiller/forhandsvis-vedtaksbrev', FpsakApiKeys.FORHANDSVISNING_FORVED_BREV)

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

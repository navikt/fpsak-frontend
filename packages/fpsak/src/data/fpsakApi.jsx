import {
  RestApiConfigBuilder, ReduxRestApiBuilder, ReduxEvents,
} from '@fpsak-frontend/rest-api-redux';
import errorHandler from '@fpsak-frontend/error-api-redux';
import { setRequestPollingMessage } from 'app/pollingMessageDuck';

import reducerRegistry from '../ReducerRegistry';

export const FpsakApiKeys = {
  LANGUAGE_FILE: 'LANGUAGE_FILE',
  SYSTEMRUTINE_URL: 'SYSTEMRUTINE_URL',
  RETTSKILDE_URL: 'RETTSKILDE_URL',
  KODEVERK: 'KODEVERK',
  AVSLAG_REASONS: 'AVSLAG_REASONS',
  NAV_ANSATT: 'NAV_ANSATT',
  SEARCH_FAGSAK: 'SEARCH_FAGSAK',
  FETCH_FAGSAK: 'FETCH_FAGSAK',
  BEHANDLINGER_FPSAK: 'BEHANDLINGER_FPSAK',
  BEHANDLINGER_FPTILBAKE: 'BEHANDLINGER_FPTILBAKE',
  BEHANDLENDE_ENHETER: 'BEHANDLENDE_ENHETER',
  NY_BEHANDLENDE_ENHET: 'NY_BEHANDLENDE_ENHET',
  NEW_BEHANDLING: 'NEW_BEHANDLING',
  SAVE_AKSJONSPUNKT: 'SAVE_AKSJONSPUNKT',
  SAVE_OVERSTYRT_AKSJONSPUNKT: 'SAVE_OVERSTYRT_AKSJONSPUNKT',
  BEHANDLING_ON_HOLD: 'BEHANDLING_ON_HOLD',
  RESUME_BEHANDLING: 'RESUME_BEHANDLING',
  HENLEGG_BEHANDLING: 'HENLEGG_BEHANDLING',
  OPEN_BEHANDLING_FOR_CHANGES: 'OPEN_BEHANDLING_FOR_CHANGES',
  ALL_DOCUMENTS_FPSAK: 'ALL_DOCUMENTS_FPSAK',
  ALL_DOCUMENTS_FPTILBAKE: 'ALL_DOCUMENTS_FPTILBAKE',
  DOCUMENT: 'DOCUMENT',
  FORHANDSVISNING_FORVED_BREV: 'FORHANDSVISNING_FORVED_BREV',
  SUBMIT_MESSAGE: 'SUBMIT_MESSAGE',
  HISTORY_FPSAK: 'HISTORY_FPSAK',
  HISTORY_FPTILBAKE: 'HISTORY_FPTILBAKE',
  ANNEN_PART_BEHANDLING: 'ANNEN_PART_BEHANDLING',
  SHOW_DETAILED_ERROR_MESSAGES: 'SHOW_DETAILED_ERROR_MESSAGES',
  INTEGRATION_STATUS: 'INTEGRATION_STATUS',
  FEATURE_TOGGLE: 'FEATURE_TOGGLE',
  PREVIEW_MESSAGE: 'PREVIEW_MESSAGE',
  AKTOER_INFO: 'AKTOER_INFO',
};

const endpoints = new RestApiConfigBuilder()
/* /api */

  /* /api/fagsak */
  .withPost('fpsak/api/fagsak/sok', FpsakApiKeys.SEARCH_FAGSAK)
  .withGet('fpsak/api/fagsak', FpsakApiKeys.FETCH_FAGSAK)

  /* /api/behandlinger */
  .withGet('fpsak/api/behandlinger/alle-fpsak', FpsakApiKeys.BEHANDLINGER_FPSAK)
  .withGet('fptilbake/api/behandlinger/alle', FpsakApiKeys.BEHANDLINGER_FPTILBAKE)
  .withAsyncPut('fpsak/api/behandlinger', FpsakApiKeys.NEW_BEHANDLING)
  .withPost('fpsak/api/behandlinger/bytt-enhet', FpsakApiKeys.NY_BEHANDLENDE_ENHET)
  .withPost('fpsak/api/behandlinger/sett-pa-vent', FpsakApiKeys.BEHANDLING_ON_HOLD)
  .withAsyncPost('fpsak/api/behandlinger/gjenoppta', FpsakApiKeys.RESUME_BEHANDLING)
  .withPost('fpsak/api/behandlinger/henlegg', FpsakApiKeys.HENLEGG_BEHANDLING)
  .withAsyncPost('fpsak/api/behandlinger/opne-for-endringer', FpsakApiKeys.OPEN_BEHANDLING_FOR_CHANGES)
  .withGet('fpsak/api/behandlinger/annen-part-behandling', FpsakApiKeys.ANNEN_PART_BEHANDLING)

  /* /api/behandling */
  .withAsyncPost('fpsak/api/behandling/aksjonspunkt', FpsakApiKeys.SAVE_AKSJONSPUNKT)
  .withAsyncPost('fpsak/api/behandling/aksjonspunkt/overstyr', FpsakApiKeys.SAVE_OVERSTYRT_AKSJONSPUNKT)

  /* /api/brev */
  .withPost('fpsak/api/brev/bestill', FpsakApiKeys.SUBMIT_MESSAGE)
  .withPostAndOpenBlob('fpsak/api/brev/forhandsvis', FpsakApiKeys.PREVIEW_MESSAGE)

  /* /api/dokument */
  .withGet('fpsak/api/dokument/hent-dokumentliste', FpsakApiKeys.ALL_DOCUMENTS_FPSAK)
  .withGet('fptilbake/api/dokument/hent-dokumentliste', FpsakApiKeys.ALL_DOCUMENTS_FPTILBAKE)
  .withGet('fpsak/api/dokument/hent-dokument', FpsakApiKeys.DOCUMENT)

  /* /api/historikk */
  .withGet('fpsak/api/historikk', FpsakApiKeys.HISTORY_FPSAK)
  .withGet('fptilbake/api/historikk', FpsakApiKeys.HISTORY_FPTILBAKE)

  /* /api/dokumentbestiller */
  .withPostAndOpenBlob('fpsak/api/dokumentbestiller/forhandsvis-vedtaksbrev', FpsakApiKeys.FORHANDSVISNING_FORVED_BREV)

  /* /api/konfig */
  .withGet('fpsak/api/konfig/systemrutine', FpsakApiKeys.SYSTEMRUTINE_URL)
  .withGet('fpsak/api/konfig/rettskilde', FpsakApiKeys.RETTSKILDE_URL)

  /* /api/kodeverk */
  .withGet('fpsak/api/kodeverk', FpsakApiKeys.KODEVERK)
  .withGet('fpsak/api/kodeverk/avslag-arsaker', FpsakApiKeys.AVSLAG_REASONS)
  .withGet('fpsak/api/kodeverk/behandlende-enheter', FpsakApiKeys.BEHANDLENDE_ENHETER)

  /* /api/nav-ansatt */
  .withGet('fpsak/api/nav-ansatt', FpsakApiKeys.NAV_ANSATT)

  /* /api/integrasjon */
  .withGet('fpsak/api/integrasjon/status', FpsakApiKeys.INTEGRATION_STATUS)
  .withGet('fpsak/api/integrasjon/status/vises', FpsakApiKeys.SHOW_DETAILED_ERROR_MESSAGES)

  /* /api/aktoer */
  .withGet('fpsak/api/aktoer-info', FpsakApiKeys.AKTOER_INFO)

  /* /sprak */
  .withGet('fpsak/public/sprak/nb_NO.json', FpsakApiKeys.LANGUAGE_FILE)

  /* /api/feature-toggle */
  .withPost('fpsak/api/feature-toggle', FpsakApiKeys.FEATURE_TOGGLE)
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

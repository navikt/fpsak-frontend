/* @flow */
import { getHttpClientApi, getRestApiBuilder, initReduxRestApi } from '@fpsak-frontend/rest-api-redux';
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
  BEHANDLINGER: 'BEHANDLINGER',
  BEHANDLENDE_ENHETER: 'BEHANDLENDE_ENHETER',
  NY_BEHANDLENDE_ENHET: 'NY_BEHANDLENDE_ENHET',
  NEW_BEHANDLING: 'NEW_BEHANDLING',
  SAVE_AKSJONSPUNKT: 'SAVE_AKSJONSPUNKT',
  SAVE_OVERSTYRT_AKSJONSPUNKT: 'SAVE_OVERSTYRT_AKSJONSPUNKT',
  BEHANDLING_ON_HOLD: 'BEHANDLING_ON_HOLD',
  RESUME_BEHANDLING: 'RESUME_BEHANDLING',
  HENLEGG_BEHANDLING: 'HENLEGG_BEHANDLING',
  OPEN_BEHANDLING_FOR_CHANGES: 'OPEN_BEHANDLING_FOR_CHANGES',
  ALL_DOCUMENTS: 'ALL_DOCUMENTS',
  DOCUMENT: 'DOCUMENT',
  FORHANDSVISNING_FORVED_BREV: 'FORHANDSVISNING_FORVED_BREV',
  SUBMIT_MESSAGE: 'SUBMIT_MESSAGE',
  HISTORY: 'HISTORY',
  ANNEN_PART_BEHANDLING: 'ANNEN_PART_BEHANDLING',
  SHOW_DETAILED_ERROR_MESSAGES: 'SHOW_DETAILED_ERROR_MESSAGES',
  INTEGRATION_STATUS: 'INTEGRATION_STATUS',
  FEATURE_TOGGLE: 'FEATURE_TOGGLE',
  PREVIEW_MESSAGE: 'PREVIEW_MESSAGE',
};

const httpClientApi = getHttpClientApi();
const endpoints = getRestApiBuilder(httpClientApi)
/* /api */

  /* /api/fagsak */
  .withPost('/api/fagsak/sok', FpsakApiKeys.SEARCH_FAGSAK)
  .withGet('/api/fagsak', FpsakApiKeys.FETCH_FAGSAK)

  /* /api/behandlinger */
  .withGet('/api/behandlinger/alle', FpsakApiKeys.BEHANDLINGER, { addLinkDataToArray: true })
  .withAsyncPut('/api/behandlinger', FpsakApiKeys.NEW_BEHANDLING)
  .withPost('/api/behandlinger/bytt-enhet', FpsakApiKeys.NY_BEHANDLENDE_ENHET)
  .withPost('/api/behandlinger/sett-pa-vent', FpsakApiKeys.BEHANDLING_ON_HOLD)
  .withAsyncPost('/api/behandlinger/gjenoppta', FpsakApiKeys.RESUME_BEHANDLING)
  .withPost('/api/behandlinger/henlegg', FpsakApiKeys.HENLEGG_BEHANDLING)
  .withAsyncPost('/api/behandlinger/opne-for-endringer', FpsakApiKeys.OPEN_BEHANDLING_FOR_CHANGES)
  .withGet('/api/behandlinger/annen-part-behandling', FpsakApiKeys.ANNEN_PART_BEHANDLING)

  /* /api/behandling */
  .withAsyncPost('/api/behandling/aksjonspunkt', FpsakApiKeys.SAVE_AKSJONSPUNKT)
  .withAsyncPost('/api/behandling/aksjonspunkt/overstyr', FpsakApiKeys.SAVE_OVERSTYRT_AKSJONSPUNKT)

  /* /api/brev */
  .withPost('/api/brev/bestill', FpsakApiKeys.SUBMIT_MESSAGE)
  .withPostAndOpenBlob('/api/brev/forhandsvis', FpsakApiKeys.PREVIEW_MESSAGE)

  /* /api/dokument */
  .withGet('/api/dokument/hent-dokumentliste', FpsakApiKeys.ALL_DOCUMENTS)
  .withGet('/api/dokument/hent-dokument', FpsakApiKeys.DOCUMENT)

  /* /api/historikk */
  .withGet('/api/historikk', FpsakApiKeys.HISTORY)

  /* /api/dokumentbestiller */
  .withPostAndOpenBlob('/api/dokumentbestiller/forhandsvis-vedtaksbrev', FpsakApiKeys.FORHANDSVISNING_FORVED_BREV)

  /* /api/konfig */
  .withGet('/api/konfig/systemrutine', FpsakApiKeys.SYSTEMRUTINE_URL)
  .withGet('/api/konfig/rettskilde', FpsakApiKeys.RETTSKILDE_URL)

  /* /api/kodeverk */
  .withGet('/api/kodeverk', FpsakApiKeys.KODEVERK)
  .withGet('/api/kodeverk/avslag-arsaker', FpsakApiKeys.AVSLAG_REASONS)
  .withGet('/api/kodeverk/behandlende-enheter', FpsakApiKeys.BEHANDLENDE_ENHETER)

  /* /api/nav-ansatt */
  .withGet('/api/nav-ansatt', FpsakApiKeys.NAV_ANSATT)

  /* /api/integrasjon */
  .withGet('/api/integrasjon/status', FpsakApiKeys.INTEGRATION_STATUS)
  .withGet('/api/integrasjon/status/vises', FpsakApiKeys.SHOW_DETAILED_ERROR_MESSAGES)

  /* /sprak */
  .withGet('/sprak/nb_NO.json', FpsakApiKeys.LANGUAGE_FILE)

  /* /api/feature-toggle */
  .withPost('/api/feature-toggle', FpsakApiKeys.FEATURE_TOGGLE)
  .build();

const reducerName = 'dataContext';
const fpsakApi = initReduxRestApi(httpClientApi, 'fpsak', endpoints, reducerName);
reducerRegistry.register(reducerName, fpsakApi.getDataReducer());

export default fpsakApi;

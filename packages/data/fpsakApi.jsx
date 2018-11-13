import ReduxRestApi from './rest/ReduxRestApi';

export const FpsakApi = {
  LANGUAGE_FILE: 'languageFile',
  SYSTEMRUTINE_URL: 'systemrutineUrl',
  RETTSKILDE_URL: 'rettskildeUrl',
  KODEVERK: 'kodeverk',
  AVSLAG_REASONS: 'avslagReasons',
  NAV_ANSATT: 'navAnsatt',
  SEARCH_FAGSAK: 'searchFagsak',
  FETCH_FAGSAK: 'fetchFagsak',
  BEHANDLINGER: 'behandlinger',
  BEHANDLING: 'behandling',
  ORIGINAL_BEHANDLING: 'originalBehandling',
  BEHANDLENDE_ENHETER: 'behandlendeEnheter',
  NY_BEHANDLENDE_ENHET: 'nyBehandlendeEnhet',
  NEW_BEHANDLING: 'newBehandling',
  BEHANDLING_ON_HOLD: 'behandlingOnHold',
  UPDATE_ON_HOLD: 'updateOnHold',
  RESUME_BEHANDLING: 'resumeBehandling',
  HENLEGG_BEHANDLING: 'henleggBehandling',
  OPEN_BEHANDLING_FOR_CHANGES: 'openBehandlingForChanges',
  SAVE_AKSJONSPUNKT: 'saveAksjonspunkt',
  SAVE_OVERSTYRT_AKSJONSPUNKT: 'saveOverstyrtAksjonspunkt',
  ALL_DOCUMENTS: 'allDocuments',
  DOCUMENT: 'document',
  FORHANDSVISNING_FORVED_BREV: 'forhandsvisningForvedBrev',
  PREVIEW_MESSAGE: 'previewMessage',
  SUBMIT_MESSAGE: 'submitMessage',
  HISTORY: 'history',
  ANNEN_PART_BEHANDLING: 'annenPartBehandling',
  SHOW_DETAILED_ERROR_MESSAGES: 'showDetailedErrorMessages',
  INTEGRATION_STATUS: 'integrationStatus',
  FEATURE_TOGGLE: 'featureToggle',
};

const fpsakReduxApiBuilder = ReduxRestApi.build()
/* /api */

  /* /api/fagsak */
  .withPost('/fpsak/api/fagsak/sok', FpsakApi.SEARCH_FAGSAK)
  .withGet('/fpsak/api/fagsak', FpsakApi.FETCH_FAGSAK)

  /* /api/behandlinger */
  .withGet('/fpsak/api/behandlinger/alle', FpsakApi.BEHANDLINGER)
  .withAsyncPost('/fpsak/api/behandlinger', FpsakApi.BEHANDLING)
  .withAsyncPost('/fpsak/api/behandlinger', FpsakApi.ORIGINAL_BEHANDLING)
  .withAsyncPut('/fpsak/api/behandlinger', FpsakApi.NEW_BEHANDLING)
  .withPost('/fpsak/api/behandlinger/bytt-enhet', FpsakApi.NY_BEHANDLENDE_ENHET)
  .withPost('/fpsak/api/behandlinger/sett-pa-vent', FpsakApi.BEHANDLING_ON_HOLD)
  .withPost('/fpsak/api/behandlinger/endre-pa-vent', FpsakApi.UPDATE_ON_HOLD)
  .withAsyncPost('/fpsak/api/behandlinger/gjenoppta', FpsakApi.RESUME_BEHANDLING)
  .withPost('/fpsak/api/behandlinger/henlegg', FpsakApi.HENLEGG_BEHANDLING)
  .withAsyncPost('/fpsak/api/behandlinger/opne-for-endringer', FpsakApi.OPEN_BEHANDLING_FOR_CHANGES)
  .withGet('/fpsak/api/behandlinger/annen-part-behandling', FpsakApi.ANNEN_PART_BEHANDLING)

  /* /api/behandling */
  .withAsyncPost('/fpsak/api/behandling/aksjonspunkt', FpsakApi.SAVE_AKSJONSPUNKT)
  .withAsyncPost('/fpsak/api/behandling/aksjonspunkt/overstyr', FpsakApi.SAVE_OVERSTYRT_AKSJONSPUNKT)

  /* /api/brev */
  .withPost('/fpsak/api/brev/bestill', FpsakApi.SUBMIT_MESSAGE)
  .withPostAndOpenBlob('/fpsak/api/brev/forhandsvis', FpsakApi.PREVIEW_MESSAGE)

  /* /api/dokument */
  .withGet('/fpsak/api/dokument/hent-dokumentliste', FpsakApi.ALL_DOCUMENTS)
  .withGet('/fpsak/api/dokument/hent-dokument', FpsakApi.DOCUMENT)

  /* /api/historikk */
  .withGet('/fpsak/api/historikk', FpsakApi.HISTORY)

  /* /api/dokumentbestiller */
  .withPostAndOpenBlob('/fpsak/api/dokumentbestiller/forhandsvis-vedtaksbrev', FpsakApi.FORHANDSVISNING_FORVED_BREV)

  /* /api/konfig */
  .withGet('/fpsak/api/konfig/systemrutine', FpsakApi.SYSTEMRUTINE_URL)
  .withGet('/fpsak/api/konfig/rettskilde', FpsakApi.RETTSKILDE_URL)

  /* /api/kodeverk */
  .withGet('/fpsak/api/kodeverk', FpsakApi.KODEVERK)
  .withGet('/fpsak/api/kodeverk/avslag-arsaker', FpsakApi.AVSLAG_REASONS)
  .withGet('/fpsak/api/kodeverk/behandlende-enheter', FpsakApi.BEHANDLENDE_ENHETER)

  /* /api/nav-ansatt */
  .withGet('/fpsak/api/nav-ansatt', FpsakApi.NAV_ANSATT)

  /* /api/integrasjon */
  .withGet('/fpsak/api/integrasjon/status', FpsakApi.INTEGRATION_STATUS)
  .withGet('/fpsak/api/integrasjon/status/vises', FpsakApi.SHOW_DETAILED_ERROR_MESSAGES)

  /* /sprak */
  .withGet('/fpsak/sprak/nb_NO.json', FpsakApi.LANGUAGE_FILE)

  /* /api/feature-toggle */
  .withPost('/fpsak/api/feature-toggle', FpsakApi.FEATURE_TOGGLE);

export const createFpsakReduxApi = restApiSelector => fpsakReduxApiBuilder
  .withRestApiSelector(restApiSelector)
  .create();

export const getFpsakApiPath = (endpointName) => {
  const endpoint = fpsakReduxApiBuilder.endpoints.find(ep => ep.name === endpointName) || {};
  return endpoint.path;
};

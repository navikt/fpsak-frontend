import {
  reducerRegistry, setRequestPollingMessage, ReduxEvents, ReduxRestApiBuilder, RestApiConfigBuilder,
} from '@fpsak-frontend/rest-api-redux';
import errorHandler from '@fpsak-frontend/error-api-redux';

export enum FpsakApiKeys {
  FETCH_FAGSAK = 'FETCH_FAGSAK',
  BEHANDLINGER_FPSAK = 'BEHANDLINGER_FPSAK',
  BEHANDLINGER_FPTILBAKE = 'BEHANDLINGER_FPTILBAKE',
  NEW_BEHANDLING_FPSAK = 'NEW_BEHANDLING_FPSAK',
  NEW_BEHANDLING_FPTILBAKE = 'NEW_BEHANDLING_FPTILBAKE',
  ALL_DOCUMENTS = 'ALL_DOCUMENTS',
  DOCUMENT = 'DOCUMENT',
  AKTOER_INFO = 'AKTOER_INFO',
  SAVE_TOTRINNSAKSJONSPUNKT = 'SAVE_TOTRINNSAKSJONSPUNKT',
  BREVMALER = 'BREVMALER',
  SUBMIT_MESSAGE = 'SUBMIT_MESSAGE',
  PREVIEW_MESSAGE_TILBAKEKREVING = 'PREVIEW_MESSAGE_TILBAKEKREVING',
  PREVIEW_MESSAGE_FORMIDLING = 'PREVIEW_MESSAGE_FORMIDLING',
  PREVIEW_MESSAGE_TILBAKEKREVING_HENLEGGELSE = 'PREVIEW_MESSAGE_TILBAKEKREVING_HENLEGGELSE',
  KAN_TILBAKEKREVING_OPPRETTES = 'KAN_TILBAKEKREVING_OPPRETTES',
  KAN_TILBAKEKREVING_REVURDERING_OPPRETTES = 'KAN_TILBAKEKREVING_REVURDERING_OPPRETTES',
  VERGE_MENYVALG = 'VERGE_MENYVALG',
  MENYHANDLING_RETTIGHETER = 'MENYHANDLING_RETTIGHETER',
  HAR_APENT_KONTROLLER_REVURDERING_AP = 'HAR_APENT_KONTROLLER_REVURDERING_AP',
  HAR_REVURDERING_SAMME_RESULTAT = 'HAR_REVURDERING_SAMME_RESULTAT',
}

const endpoints = new RestApiConfigBuilder()

  /* /api/fagsak */
  .withGet('/fpsak/api/fagsak', FpsakApiKeys.FETCH_FAGSAK)

  /* /fpsak/api/behandlinger */
  .withGet('/fpsak/api/behandlinger/alle', FpsakApiKeys.BEHANDLINGER_FPSAK)
  .withAsyncPut('/fpsak/api/behandlinger', FpsakApiKeys.NEW_BEHANDLING_FPSAK)
  .withRel('finn-menyvalg-for-verge', FpsakApiKeys.VERGE_MENYVALG)
  .withRel('handling-rettigheter', FpsakApiKeys.MENYHANDLING_RETTIGHETER)

  /* /fptilbake/api/behandlinger */
  .withAsyncPost('/fptilbake/api/behandlinger/opprett', FpsakApiKeys.NEW_BEHANDLING_FPTILBAKE)
  .withGet('/fptilbake/api/behandlinger/kan-opprettes', FpsakApiKeys.KAN_TILBAKEKREVING_OPPRETTES)
  .withGet('/fptilbake/api/behandlinger/kan-revurdering-opprettes', FpsakApiKeys.KAN_TILBAKEKREVING_REVURDERING_OPPRETTES)
  .withGet('/fptilbake/api/behandlinger/alle', FpsakApiKeys.BEHANDLINGER_FPTILBAKE)

  /* /api/behandling/beregningsresultat */
  .withRel('har-samme-resultat', FpsakApiKeys.HAR_REVURDERING_SAMME_RESULTAT)

  /* Totrinnskontroll */
  .withRel('bekreft-totrinnsaksjonspunkt', FpsakApiKeys.SAVE_TOTRINNSAKSJONSPUNKT)

  /* Brev */
  .withRel('brev-maler', FpsakApiKeys.BREVMALER)
  .withRel('brev-bestill', FpsakApiKeys.SUBMIT_MESSAGE)
  .withRel('har-apent-kontroller-revurdering-aksjonspunkt', FpsakApiKeys.HAR_APENT_KONTROLLER_REVURDERING_AP)

  /* /api/dokument */
  .withGet('/fpsak/api/dokument/hent-dokumentliste', FpsakApiKeys.ALL_DOCUMENTS)
  .withGet('/fpsak/api/dokument/hent-dokument', FpsakApiKeys.DOCUMENT)

  /* /api/aktoer */
  .withGet('/fpsak/api/aktoer-info', FpsakApiKeys.AKTOER_INFO)

  .withPostAndOpenBlob('/fpformidling/api/brev/forhaandsvis', FpsakApiKeys.PREVIEW_MESSAGE_FORMIDLING)

  .withPostAndOpenBlob('/fptilbake/api/brev/forhandsvis', FpsakApiKeys.PREVIEW_MESSAGE_TILBAKEKREVING)
  .withPostAndOpenBlob('/fptilbake/api/dokument/forhandsvis-henleggelsesbrev', FpsakApiKeys.PREVIEW_MESSAGE_TILBAKEKREVING_HENLEGGELSE)

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

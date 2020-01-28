import { ReduxEvents, ReduxRestApiBuilder, RestApiConfigBuilder } from '@fpsak-frontend/rest-api-redux';
import errorHandler from '@fpsak-frontend/error-api-redux';
import { reducerRegistry, setRequestPollingMessage } from '@fpsak-frontend/fp-felles';

export const AnkeBehandlingApiKeys = {
  BEHANDLING_ANKE: 'BEHANDLING_ANKE',
  AKSJONSPUNKTER: 'AKSJONSPUNKTER',
  VILKAR: 'VILKAR',
  ANKE_VURDERING: 'ANKE_VURDERING',
  BEHANDLING_NY_BEHANDLENDE_ENHET: 'BEHANDLING_NY_BEHANDLENDE_ENHET',
  HENLEGG_BEHANDLING: 'HENLEGG_BEHANDLING',
  RESUME_BEHANDLING: 'RESUME_BEHANDLING',
  BEHANDLING_ON_HOLD: 'BEHANDLING_ON_HOLD',
  UPDATE_ON_HOLD: 'UPDATE_ON_HOLD',
  SAVE_AKSJONSPUNKT: 'SAVE_AKSJONSPUNKT',
  PREVIEW_MESSAGE: 'PREVIEW_MESSAGE',
  SAVE_ANKE_VURDERING: 'SAVE_ANKE_VURDERING',
  SAVE_REOPEN_ANKE_VURDERING: 'SAVE_REOPEN_ANKE_VURDERING',
};

const endpoints = new RestApiConfigBuilder()
  .withAsyncPost('/fpsak/api/behandlinger', AnkeBehandlingApiKeys.BEHANDLING_ANKE)
  .withInjectedPath('aksjonspunkter', AnkeBehandlingApiKeys.AKSJONSPUNKTER)
  .withInjectedPath('vilkar', AnkeBehandlingApiKeys.VILKAR)
  .withInjectedPath('anke-vurdering', AnkeBehandlingApiKeys.ANKE_VURDERING)

  .withPost('/fpsak/api/behandlinger/bytt-enhet', AnkeBehandlingApiKeys.BEHANDLING_NY_BEHANDLENDE_ENHET)
  .withPost('/fpsak/api/behandlinger/henlegg', AnkeBehandlingApiKeys.HENLEGG_BEHANDLING)
  .withAsyncPost('/fpsak/api/behandlinger/gjenoppta', AnkeBehandlingApiKeys.RESUME_BEHANDLING, {
    storeResultKey: AnkeBehandlingApiKeys.BEHANDLING_ANKE,
  })
  .withPost('/fpsak/api/behandlinger/sett-pa-vent', AnkeBehandlingApiKeys.BEHANDLING_ON_HOLD)

  .withPost('/fpsak/api/behandlinger/endre-pa-vent', AnkeBehandlingApiKeys.UPDATE_ON_HOLD)
  .withAsyncPost('/fpsak/api/behandling/aksjonspunkt', AnkeBehandlingApiKeys.SAVE_AKSJONSPUNKT, {
    storeResultKey: AnkeBehandlingApiKeys.BEHANDLING_ANKE,
  })

  .withAsyncPost('/fpsak/api/behandling/anke/mellomlagre-anke', AnkeBehandlingApiKeys.SAVE_ANKE_VURDERING)
  .withAsyncPost('/fpsak/api/behandling/anke/mellomlagre-gjennapne-anke', AnkeBehandlingApiKeys.SAVE_REOPEN_ANKE_VURDERING, {
    storeResultKey: AnkeBehandlingApiKeys.BEHANDLING_ANKE,
  })

  /* fpformidling */
  .withPostAndOpenBlob('/fpformidling/api/brev/forhaandsvis', AnkeBehandlingApiKeys.PREVIEW_MESSAGE)
  .build();

const reducerName = 'dataContextAnkeBehandling';

export const reduxRestApi = new ReduxRestApiBuilder(endpoints, reducerName)
  .withReduxEvents(new ReduxEvents()
    .withErrorActionCreator(errorHandler.getErrorActionCreator())
    .withPollingMessageActionCreator(setRequestPollingMessage))
  .build();

reducerRegistry.register(reducerName, reduxRestApi.getDataReducer());

const ankeBehandlingApi = reduxRestApi.getEndpointApi();
export default ankeBehandlingApi;

import { ReduxEvents, ReduxRestApiBuilder, RestApiConfigBuilder } from '@fpsak-frontend/rest-api-redux';
import errorHandler from '@fpsak-frontend/error-api-redux';
import { reducerRegistry, setRequestPollingMessage } from '@fpsak-frontend/fp-felles';

export const KlageBehandlingApiKeys = {
  BEHANDLING_KLAGE: 'BEHANDLING_KLAGE',
  AKSJONSPUNKTER: 'AKSJONSPUNKTER',
  VILKAR: 'VILKAR',
  KLAGE_VURDERING: 'KLAGE_VURDERING',
  BEHANDLING_NY_BEHANDLENDE_ENHET: 'BEHANDLING_NY_BEHANDLENDE_ENHET',
  HENLEGG_BEHANDLING: 'HENLEGG_BEHANDLING',
  RESUME_BEHANDLING: 'RESUME_BEHANDLING',
  BEHANDLING_ON_HOLD: 'BEHANDLING_ON_HOLD',
  UPDATE_ON_HOLD: 'UPDATE_ON_HOLD',
  SAVE_AKSJONSPUNKT: 'SAVE_AKSJONSPUNKT',
  PREVIEW_MESSAGE: 'PREVIEW_MESSAGE',
  SAVE_KLAGE_VURDERING: 'SAVE_KLAGE_VURDERING',
  SAVE_REOPEN_KLAGE_VURDERING: 'SAVE_REOPEN_KLAGE_VURDERING',
};

const endpoints = new RestApiConfigBuilder()
  .withAsyncPost('/fpsak/api/behandlinger', KlageBehandlingApiKeys.BEHANDLING_KLAGE)
  .withInjectedPath('aksjonspunkter', KlageBehandlingApiKeys.AKSJONSPUNKTER)
  .withInjectedPath('vilkar', KlageBehandlingApiKeys.VILKAR)
  .withInjectedPath('klage-vurdering', KlageBehandlingApiKeys.KLAGE_VURDERING)

  .withPost('/fpsak/api/behandlinger/bytt-enhet', KlageBehandlingApiKeys.BEHANDLING_NY_BEHANDLENDE_ENHET)
  .withPost('/fpsak/api/behandlinger/henlegg', KlageBehandlingApiKeys.HENLEGG_BEHANDLING)
  .withAsyncPost('/fpsak/api/behandlinger/gjenoppta', KlageBehandlingApiKeys.RESUME_BEHANDLING, {
    storeResultKey: KlageBehandlingApiKeys.BEHANDLING_KLAGE,
  })
  .withPost('/fpsak/api/behandlinger/sett-pa-vent', KlageBehandlingApiKeys.BEHANDLING_ON_HOLD)

  .withPost('/fpsak/api/behandlinger/endre-pa-vent', KlageBehandlingApiKeys.UPDATE_ON_HOLD)
  .withAsyncPost('/fpsak/api/behandling/aksjonspunkt', KlageBehandlingApiKeys.SAVE_AKSJONSPUNKT, {
    storeResultKey: KlageBehandlingApiKeys.BEHANDLING_KLAGE,
  })
  .withAsyncPost('/fpsak/api/behandling/klage/mellomlagre-klage', KlageBehandlingApiKeys.SAVE_KLAGE_VURDERING)
  .withAsyncPost('/fpsak/api/behandling/klage/mellomlagre-gjennapne-klage', KlageBehandlingApiKeys.SAVE_REOPEN_KLAGE_VURDERING, {
    storeResultKey: KlageBehandlingApiKeys.BEHANDLING_KLAGE,
  })

  /* fpformidling */
  .withPostAndOpenBlob('/fpformidling/api/brev/forhaandsvis', KlageBehandlingApiKeys.PREVIEW_MESSAGE)
  .build();

const reducerName = 'dataContextKlageBehandling';

export const reduxRestApi = new ReduxRestApiBuilder(endpoints, reducerName)
  .withReduxEvents(new ReduxEvents()
    .withErrorActionCreator(errorHandler.getErrorActionCreator())
    .withPollingMessageActionCreator(setRequestPollingMessage))
  .build();

reducerRegistry.register(reducerName, reduxRestApi.getDataReducer());

const klageBehandlingApi = reduxRestApi.getEndpointApi();
export default klageBehandlingApi;

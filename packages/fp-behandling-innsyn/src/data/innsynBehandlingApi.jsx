import { ReduxEvents, ReduxRestApiBuilder, RestApiConfigBuilder } from '@fpsak-frontend/rest-api-redux';
import errorHandler from '@fpsak-frontend/error-api-redux';
import { reducerRegistry, setRequestPollingMessage } from '@fpsak-frontend/fp-felles';

export const InnsynBehandlingApiKeys = {
  BEHANDLING: 'BEHANDLING',
  UPDATE_ON_HOLD: 'UPDATE_ON_HOLD',
  SAVE_AKSJONSPUNKT: 'SAVE_AKSJONSPUNKT',
  PREVIEW_MESSAGE: 'PREVIEW_MESSAGE',
  INNSYN: 'INNSYN',
};

const endpoints = new RestApiConfigBuilder()
  .withAsyncPost('/fpsak/api/behandlinger', InnsynBehandlingApiKeys.BEHANDLING)
  .withPost('/fpsak/api/behandlinger/endre-pa-vent', InnsynBehandlingApiKeys.UPDATE_ON_HOLD)
  .withAsyncPost('/fpsak/api/behandling/aksjonspunkt', InnsynBehandlingApiKeys.SAVE_AKSJONSPUNKT, {
    storeResultKey: InnsynBehandlingApiKeys.BEHANDLING,
  })
  // TODO (TOR) Bør få lenke fra backend og så åpne blob (Flytt open blob ut av rest-apis)
  .withPostAndOpenBlob('/fpformidling/api/brev/forhaandsvis', InnsynBehandlingApiKeys.PREVIEW_MESSAGE)

  // TODO (TOR) Desse er ikkje i bruk enno. Må flytta ut prosess- og fakta-komponentar først
  .withInjectedPath('innsyn', InnsynBehandlingApiKeys.INNSYN)
  .build();


const reducerName = 'dataContextInnsynBehandling';

export const reduxRestApi = new ReduxRestApiBuilder(endpoints, reducerName)
  .withReduxEvents(new ReduxEvents()
    .withErrorActionCreator(errorHandler.getErrorActionCreator())
    .withPollingMessageActionCreator(setRequestPollingMessage))
  .build();

reducerRegistry.register(reducerName, reduxRestApi.getDataReducer());

const innsynBehandlingApi = reduxRestApi.getEndpointApi();
export default innsynBehandlingApi;

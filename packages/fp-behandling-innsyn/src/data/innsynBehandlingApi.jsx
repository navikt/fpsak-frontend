import {
  RestApiConfigBuilder, ReduxRestApiBuilder, ReduxEvents,
} from '@fpsak-frontend/rest-api-redux';
import errorHandler from '@fpsak-frontend/error-api-redux';
import { reducerRegistry, setRequestPollingMessage } from '@fpsak-frontend/fp-felles';

export const InnsynBehandlingApiKeys = {
  BEHANDLING: 'BEHANDLING',
  UPDATE_ON_HOLD: 'UPDATE_ON_HOLD',
  SAVE_AKSJONSPUNKT: 'SAVE_AKSJONSPUNKT',
  PREVIEW_MESSAGE: 'PREVIEW_MESSAGE',
  SUBMIT_MESSAGE: 'SUBMIT_MESSAGE',
};

const endpoints = new RestApiConfigBuilder()
  .withAsyncPost('/fpsak/api/behandlinger', InnsynBehandlingApiKeys.BEHANDLING, { linksToFetchAutomatically: ['innsyn', 'aksjonspunkter', 'vilkar'] })
  .withInjectedPath('endre-pa-vent', InnsynBehandlingApiKeys.UPDATE_ON_HOLD)
  .withInjectedPath('bekreft-aksjonspunkt', InnsynBehandlingApiKeys.SAVE_AKSJONSPUNKT, {
    storeResultKey: InnsynBehandlingApiKeys.BEHANDLING,
  })
  .withInjectedPath('bestill-brev', InnsynBehandlingApiKeys.SUBMIT_MESSAGE)
  // TODO (TOR) Bør få lenke fra backend og så åpne blob (Flytt open blob ut av rest-apis)
  .withPostAndOpenBlob('/fpsak/api/brev/forhandsvis', InnsynBehandlingApiKeys.PREVIEW_MESSAGE)
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

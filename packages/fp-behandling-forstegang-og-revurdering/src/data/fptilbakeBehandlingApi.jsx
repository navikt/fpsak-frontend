import {
  RestApiConfigBuilder, ReduxRestApiBuilder, ReduxEvents,
} from '@fpsak-frontend/rest-api-redux';
import errorHandler from '@fpsak-frontend/error-api-redux';
import { reducerRegistry, setRequestPollingMessage } from '@fpsak-frontend/fp-felles';

export const BehandlingFptilbakeApiKeys = {
  PREVIEW_MESSAGE: 'PREVIEW_MESSAGE',
};

const endpoints = new RestApiConfigBuilder()
/* /api */

  /* /api/brev */
  .withPostAndOpenBlob('/api/dokument/forhandsvis', BehandlingFptilbakeApiKeys.PREVIEW_MESSAGE)
  .build();

const reducerName = 'dataContextSimulering';

export const reduxRestApi = new ReduxRestApiBuilder(endpoints, reducerName)
  .withContextPath('fptilbake')
  .withReduxEvents(new ReduxEvents()
    .withErrorActionCreator(errorHandler.getErrorActionCreator())
    .withPollingMessageActionCreator(setRequestPollingMessage))
  .build();

reducerRegistry.register(reducerName, reduxRestApi.getDataReducer());

const fptilbakeBehandlingApi = reduxRestApi.getEndpointApi();
export default fptilbakeBehandlingApi;

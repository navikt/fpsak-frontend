import {
  reducerRegistry, setRequestPollingMessage, ReduxEvents, ReduxRestApiBuilder, RestApiConfigBuilder,
} from '@fpsak-frontend/rest-api-redux';
import errorHandler from '@fpsak-frontend/error-api-redux';

export enum FpsakApiKeys {
  BEHANDLINGER_FPSAK = 'BEHANDLINGER_FPSAK',
  BEHANDLINGER_FPTILBAKE = 'BEHANDLINGER_FPTILBAKE',
  NEW_BEHANDLING_FPSAK = 'NEW_BEHANDLING_FPSAK',
  NEW_BEHANDLING_FPTILBAKE = 'NEW_BEHANDLING_FPTILBAKE',
}

const endpoints = new RestApiConfigBuilder()
  /* /fpsak/api/behandlinger */
  .withGet('/fpsak/api/behandlinger/alle', FpsakApiKeys.BEHANDLINGER_FPSAK)
  .withAsyncPut('/fpsak/api/behandlinger', FpsakApiKeys.NEW_BEHANDLING_FPSAK)

  /* /fptilbake/api/behandlinger */
  .withAsyncPost('/fptilbake/api/behandlinger/opprett', FpsakApiKeys.NEW_BEHANDLING_FPTILBAKE)
  .withGet('/fptilbake/api/behandlinger/alle', FpsakApiKeys.BEHANDLINGER_FPTILBAKE)

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

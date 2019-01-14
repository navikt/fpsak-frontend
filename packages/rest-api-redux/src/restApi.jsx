/* @flow */
import {
  getAxiosHttpClientApi, RequestApi, RestApiContextModifier, RestApiConfigBuilder,
} from '@fpsak-frontend/rest-api';
import type { RequestConfig } from '@fpsak-frontend/rest-api/src/RequestConfigFlowType';
import type { HttpClientApi } from '@fpsak-frontend/rest-api/src/HttpClientApiFlowType';

import createReduxRestApi from './redux/duck';
import EndpointOperations from './redux/EndpointOperations';
import ReduxEvents from './redux/ReduxEvents';

type ApiMappedByKey = {
  [key: string]: {}
}

const createApiForEachKey = (contextPath: string, config: RequestConfig[], restApi): ApiMappedByKey => config.reduce((acc, c) => ({
  ...acc,
  [c.name]: new EndpointOperations(restApi, contextPath, c),
}), {});

export const initReduxRestApi = (httpClientApi: HttpClientApi, contextPath: string, config: RequestConfig[], reducerName: string,
  reduxEvents: ReduxEvents) => {
  const requestApi = new RequestApi(httpClientApi, contextPath, config);
  const reduxRestApi = createReduxRestApi(requestApi, reducerName, reduxEvents);

  return {
    ...createApiForEachKey(contextPath, config, reduxRestApi),
    getDataReducer: () => reduxRestApi.dataReducer,
    getAxiosHttpClientApi: () => httpClientApi.axiosInstance,
    getDataContextModifier: () => new RestApiContextModifier(requestApi),
    setRestResponseHandlers: (successHandler, errorHandler) => httpClientApi.setResponseHandlers(successHandler, errorHandler),
  };
};

export const getHttpClientApi = () => getAxiosHttpClientApi();

export const getRestApiBuilder = (httpClientApi: HttpClientApi) => new RestApiConfigBuilder(httpClientApi);

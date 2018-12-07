/* @flow */
import createReduxRestApi from './redux/duck';
import getAxiosHttpClientApi from './axios/axiosHttpClientApi';
import RequestApi from './requestApi/RequestApi';
import RestApiContextModifier from './requestApi/RestApiContextModifier';
import RestApiConfigBuilder from './RestApiConfigBuilder';
import type { RequestConfig } from './RequestConfigFlowType';
import type { HttpClientApi } from './HttpClientApiFlowType';

const getActions = (restApi, endpointName) => ({
  makeRestApiRequest: () => restApi.makeRestApiRequest(endpointName),
  cancelRestApiRequest: () => restApi.cancelRestApiRequest(endpointName),
  resetRestApi: () => restApi.resetRestApi(endpointName),
  setDataRestApi: () => restApi.setDataRestApi(endpointName),
});

const getSelectors = (restApi, endpointName) => ({
  getRestApiData: () => restApi.getRestApiData(endpointName),
  getRestApiMeta: () => restApi.getRestApiMeta(endpointName),
  getRestApiError: () => restApi.getRestApiError(endpointName),
  getRestApiStarted: () => restApi.getRestApiStarted(endpointName),
  getRestApiFinished: () => restApi.getRestApiFinished(endpointName),
});

type ApiMappedByKey = {
  [key: string]: {}
}

const createApiForEachKey = (contextPath: string, config: RequestConfig[], restApi): ApiMappedByKey => config.reduce((acc, c) => ({
  ...acc,
  [c.name]: {
    ...getActions(restApi, c.name),
    ...getSelectors(restApi, c.name),
    path: `/${contextPath}${c.path}`,
    name: c.name,
  },
}), {});

export const initRestApi = (httpClientApi: HttpClientApi, contextPath: string, config: RequestConfig[], reducerName: string) => {
  const requestApi = new RequestApi(httpClientApi, contextPath, config);
  const reduxRestApi = createReduxRestApi(requestApi, reducerName);

  return {
    ...createApiForEachKey(contextPath, config, reduxRestApi),
    getAllAsyncPollingMessages: reduxRestApi.getAllAsyncPollingMessages,
    getAllAsyncErrorMessages: reduxRestApi.getAllAsyncErrorMessages,
    getDataReducer: () => reduxRestApi.dataReducer,
    getAxiosHttpClientApi: () => httpClientApi.axiosInstance,
    getDataContextModifier: () => new RestApiContextModifier(requestApi),
    setRestResponseHandlers: (successHandler, errorHandler) => httpClientApi.setResponseHandlers(successHandler, errorHandler),
  };
};

export const getHttpClientApi = () => getAxiosHttpClientApi();

export const getRestApiBuilder = (httpClientApi: HttpClientApi) => new RestApiConfigBuilder(httpClientApi);

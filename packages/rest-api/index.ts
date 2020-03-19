import getAxiosHttpClientApi from './src/axios/getAxiosHttpClientApi';
import RequestApi from './src/requestApi/RequestApi';
import RequestConfig from './src/RequestConfig';

export { default as RequestApi } from './src/requestApi/RequestApi';
export { default as RequestConfig } from './src/RequestConfig';
export { default as NotificationMapper } from './src/requestApi/NotificationMapper';
export { default as RequestRunner } from './src/requestApi/RequestRunner';
export { default as asyncPollingStatus } from './src/requestApi/asyncPollingStatus';
export { default as RestApiConfigBuilder } from './src/RestApiConfigBuilder';
export { default as getAxiosHttpClientApi } from './src/axios/getAxiosHttpClientApi';
export { ErrorTypes, errorOfType, getErrorResponseData } from './src/requestApi/error/ErrorTypes';

export const createRequestApi = (contextPath: string, configs: RequestConfig[]) => new RequestApi(getAxiosHttpClientApi(), contextPath, configs);

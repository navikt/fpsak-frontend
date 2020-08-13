import getAxiosHttpClientApi from './src/axios/getAxiosHttpClientApi';
import RequestApi from './src/requestApi/RequestApi';
import RequestConfig from './src/RequestConfig';
import AbstractRequestApi from './src/requestApi/AbstractRequestApi';
import RequestApiMock from './src/requestApi/RequestApiMock';

export { default as RequestApi } from './src/requestApi/RequestApi';
export { default as AbstractRequestApi } from './src/requestApi/AbstractRequestApi';
export { default as RequestConfig } from './src/RequestConfig';
export { default as NotificationMapper } from './src/requestApi/NotificationMapper';
export { default as RequestRunner } from './src/requestApi/RequestRunner';
export { REQUEST_POLLING_CANCELLED } from './src/requestApi/RequestProcess';
export { default as asyncPollingStatus } from './src/requestApi/asyncPollingStatus';
export { default as RestApiConfigBuilder } from './src/RestApiConfigBuilder';
export { default as getAxiosHttpClientApi } from './src/axios/getAxiosHttpClientApi';
export { ErrorTypes, errorOfType, getErrorResponseData } from './src/requestApi/error/ErrorTypes';
export { default as ErrorType } from './src/requestApi/error/errorTsType';

let isUnitTestModeOn = false;
export const switchOnTestMode = () => {
  isUnitTestModeOn = true;
};

export const createRequestApi = (configs: RequestConfig[]): AbstractRequestApi => (isUnitTestModeOn
  ? new RequestApiMock() : new RequestApi(getAxiosHttpClientApi(), configs));

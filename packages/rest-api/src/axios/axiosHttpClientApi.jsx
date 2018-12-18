/* @flow */
import axios from 'axios';

import initRestMethods from './axiosRestMethods';

/**
 * setAxiosResponseHandlers
 * Setter Axios response interceptors. Det kan kun settes ett par suksess/error-interceptors. Eksisterer det et par fra før blir dette overskrevet.
 */
const setAxiosResponseHandlers = (axiosInstance, onSuccessResponse, onErrorResponse) => {
  if (axiosInstance.interceptors.response.handlers.length === 1) {
    axiosInstance.interceptors.response.eject(0);
  }

  axiosInstance.interceptors.response.use(onSuccessResponse, onErrorResponse);
};

/**
 * getAxiosHttpClientApi
 * Oppretter nytt http-klient api basert på Axios.
 */
const getAxiosHttpClientApi = () => {
  const axiosInstance = axios.create();
  axiosInstance.CancelToken = axios.CancelToken;
  axiosInstance.isCancel = axios.isCancel;
  axiosInstance.interceptors.request.use((c) => {
    const config = Object.assign({}, c);
    config.headers['Nav-Callid'] = `CallId_${(new Date()).getTime()}_${Math.floor(Math.random() * 1000000000)}`;
    return config;
  });
  const restMethods = initRestMethods(axiosInstance);

  return {
    get: restMethods.get,
    post: restMethods.post,
    put: restMethods.put,
    getBlob: restMethods.getBlob,
    postBlob: restMethods.postBlob,
    postAndOpenBlob: restMethods.postAndOpenBlob,
    getAsync: restMethods.getAsync,
    postAsync: restMethods.postAsync,
    putAsync: restMethods.putAsync,
    isAsyncRestMethod: restMethods.isAsyncRestMethod,
    getMethodName: restMethods.getMethodName,
    setResponseHandlers: (successHandler, errorHandler) => setAxiosResponseHandlers(axiosInstance, successHandler, errorHandler),
    axiosInstance,
  };
};

export default getAxiosHttpClientApi;

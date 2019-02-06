/* @flow */
import axios from 'axios';
import { withScope } from '@sentry/browser';
import initRestMethods from './axiosRestMethods';

/**
 * getAxiosHttpClientApi
 * Oppretter nytt http-klient api basert på Axios.
 */
const getAxiosHttpClientApi = () => {
  const axiosInstance = axios.create();

  // $FlowFixMe
  axiosInstance.CancelToken = axios.CancelToken;
  // $FlowFixMe
  axiosInstance.isCancel = axios.isCancel;

  axiosInstance.interceptors.request.use((c): Object => {
    const navCallId = `CallId_${(new Date()).getTime()}_${Math.floor(Math.random() * 1000000000)}`;
    const config = Object.assign({}, c);
    withScope((scope) => {
      scope.setTag('Nav-CallId', navCallId);
    });
    config.headers['Nav-Callid'] = navCallId;

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
    axiosInstance,
  };
};

export default getAxiosHttpClientApi;

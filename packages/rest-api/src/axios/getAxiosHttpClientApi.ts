import axios from 'axios';
import { withScope } from '@sentry/browser';

import initRestMethods from './initRestMethods';

/**
 * getAxiosHttpClientApi
 * Oppretter nytt http-klient api basert på Axios.
 */
const getAxiosHttpClientApi = () => {
  const axiosInstance = axios.create();

  // @ts-ignore
  axiosInstance.CancelToken = axios.CancelToken;

  // @ts-ignore
  axiosInstance.isCancel = axios.isCancel;

  // TODO (TOR) sentry bør ikkje vera ein avhengighet til pakka "rest-api". Konfigurer dette utanfor
  axiosInstance.interceptors.request.use((c): any => {
    const navCallId = `CallId_${(new Date()).getTime()}_${Math.floor(Math.random() * 1000000000)}`;
    const config = { ...c };
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
    axiosInstance,
  };
};

export default getAxiosHttpClientApi;

import axios from 'axios';

import initRestMethods from './axiosRestMethods';

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

  axiosInstance.interceptors.request.use((c): Record<string, any> => {
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
    axiosInstance,
  };
};

export default getAxiosHttpClientApi;

import axios, { CancelToken } from 'axios';

const openPreview = (data) => {
  if (window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(data);
  } else {
    window.open(URL.createObjectURL(data));
  }
};

const cancellable = (config) => {
  let cancel;
  const request = axios({
    ...config,
    cancelToken: new CancelToken((c) => { cancel = c; }),
  });
  request.cancel = cancel;
  return request.catch(error => (axios.isCancel(error) ? Promise.reject(new Error(null)) : Promise.reject(error)));
};

const defaultHeaders = {
  'Cache-Control': 'no-cache',
  Pragma: 'no-cache',
  Expires: 0,
};

const defaultPostHeaders = {
  'Content-Type': 'application/json',
};

export const get = (url, params, responseType = 'json') => cancellable({
  url,
  params,
  responseType,
  method: 'get',
  headers: {
    ...defaultHeaders,
  },
});

export const post = (url, data, responseType = 'json') => cancellable({
  url,
  responseType,
  data: JSON.stringify(data),
  method: 'post',
  headers: {
    ...defaultHeaders,
    ...defaultPostHeaders,
  },
  cache: false,
});

export const put = (url, data, responseType = 'json') => cancellable({
  url,
  responseType,
  data: JSON.stringify(data),
  method: 'put',
  headers: {
    ...defaultHeaders,
    ...defaultPostHeaders,
  },
  cache: false,
});

export const getBlob = (url, params) => get(url, params, 'blob');

export const postBlob = (url, data) => post(url, data, 'blob');

export const postAndOpenBlob = (url, data) => postBlob(url, data)
  .then((response) => {
    openPreview(response.data);
    return {
      ...response,
      data: 'blob opened as preview', // Don't waste memory by storing blob in state
    };
  });

export const getAsync = (url, params) => get(url, params);
export const postAsync = (url, params) => post(url, params);
export const putAsync = (url, params) => put(url, params);

export const isAsyncRestMethod = restMethod => restMethod === getAsync || restMethod === postAsync || restMethod === putAsync;

export const getRestMethod = (restMethodString) => {
  switch (restMethodString) {
    case 'POST':
      return post;
    case 'PUT':
      return put;
    default:
      return get;
  }
};

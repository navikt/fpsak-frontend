const openPreview = (data) => {
  if (window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(data);
  } else {
    window.open(URL.createObjectURL(data));
  }
};

const cancellable = (axiosInstance, config) => {
  let cancel;
  const request = axiosInstance({
    ...config,
    cancelToken: new axiosInstance.CancelToken((c) => { cancel = c; }),
  });
  request.cancel = cancel;
  return request.catch((error) => (axiosInstance.isCancel(error) ? Promise.reject(new Error(null)) : Promise.reject(error)));
};

const defaultHeaders = {
  'Cache-Control': 'no-cache',
  Pragma: 'no-cache',
  Expires: 0,
};

const defaultPostHeaders = {
  'Content-Type': 'application/json',
};

const get = (axiosInstance) => (url: string, params: any, responseType = 'json') => cancellable(axiosInstance, {
  url,
  params,
  responseType,
  method: 'get',
  headers: {
    ...defaultHeaders,
  },
});

const post = (axiosInstance) => (url: string, data: any, responseType = 'json') => cancellable(axiosInstance, {
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

const put = (axiosInstance) => (url: string, data: any, responseType = 'json') => cancellable(axiosInstance, {
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

const getBlob = (axiosInstance) => (url: string, params: any) => get(axiosInstance)(url, params, 'blob');

const postBlob = (axiosInstance) => (url: string, data: any) => post(axiosInstance)(url, data, 'blob');

// TODO (TOR) Åpninga av dokument bør vel ikkje ligga her?
const postAndOpenBlob = (axiosInstance) => (url: string, data: any) => postBlob(axiosInstance)(url, data)
  .then((response) => {
    openPreview(response.data);
    return {
      ...response,
      data: 'blob opened as preview', // Don't waste memory by storing blob in state
    };
  });

const getAsync = (axiosInstance) => (url: string, params: any) => get(axiosInstance)(url, params);
const postAsync = (axiosInstance) => (url: string, params: any) => post(axiosInstance)(url, params);
const putAsync = (axiosInstance) => (url: string, params: any) => put(axiosInstance)(url, params);

const initRestMethods = (axiosInstance: any) => {
  const restMethods = {
    get: get(axiosInstance),
    post: post(axiosInstance),
    put: put(axiosInstance),
    getBlob: getBlob(axiosInstance),
    postBlob: postBlob(axiosInstance),
    postAndOpenBlob: postAndOpenBlob(axiosInstance),
    getAsync: getAsync(axiosInstance),
    postAsync: postAsync(axiosInstance),
    putAsync: putAsync(axiosInstance),
  };

  return {
    ...restMethods,
  };
};

export default initRestMethods;

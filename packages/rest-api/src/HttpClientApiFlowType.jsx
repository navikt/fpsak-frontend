export type HttpClientApi = {
  get: (url: string, params: any, responseType?: string) => Promise<string>,
  post: (url: string, data: any, responseType?: string) => Promise<string>,
  put: (url: string, data: any, responseType?: string) =>  Promise<string>,
  getBlob: (url: string, params: any) => Promise<string>,
  postBlob: (url: string, params: any) => Promise<string>,
  postAndOpenBlob: (url: string, params: any) => Promise<string>,
  getAsync: (url: string, params: any) => Promise<string>,
  postAsync: (url: string, params: any) => Promise<string>,
  putAsync: (url: string, params: any) => Promise<string>,
  isAsyncRestMethod: (restMethod: any) => boolean,
  getMethodName: (restMethod: any) => string,
  setResponseHandlers: (successHandler: (response: any) => void, errorHandler: (error: any) => void) => void,
}

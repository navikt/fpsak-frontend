import RequestProcess from './RequestProcess';
import NotificationMapper from './NotificationMapper';
import RestApiRequestContext from './RestApiRequestContext';
import RequestConfig, { RequestType } from '../RequestConfig';
import { HttpClientApi } from '../HttpClientApiTsType';

const getMethod = (httpClientApi: HttpClientApi, restMethod: string) => {
  if (restMethod === RequestType.GET) {
    return httpClientApi.get;
  }
  if (restMethod === RequestType.GET_ASYNC) {
    return httpClientApi.getAsync;
  }
  if (restMethod === RequestType.POST) {
    return httpClientApi.post;
  }
  if (restMethod === RequestType.POST_ASYNC) {
    return httpClientApi.postAsync;
  }
  if (restMethod === RequestType.PUT) {
    return httpClientApi.put;
  }
  if (restMethod === RequestType.PUT_ASYNC) {
    return httpClientApi.putAsync;
  }
  return httpClientApi.postAndOpenBlob;
};

/**
 * RequestRunner
 *
 * Denne klassen håndterer kall mot en spesifikk URL.
 *
 * Ved start av nytt kall blir eventuelt pågåande kall stoppet først (kan skje ved long-polling). En kan eventuelt
 * stoppe et kall manuelt ved å bruke metoden @see stopProcess.
 */
class RequestRunner {
  httpClientApi: HttpClientApi;

  context: RestApiRequestContext

  process: RequestProcess;

  constructor(httpClientApi: HttpClientApi, context: RestApiRequestContext) {
    this.httpClientApi = httpClientApi;
    this.context = context;
  }

  getConfig = () => this.context.getConfig();

  getName = (): string => this.getConfig().name

  getRestMethod = () => getMethod(this.httpClientApi, this.getConfig().restMethod)

  getPath = (): string => {
    const contextPath = this.context.getContextPath() ? `/${this.context.getContextPath()}` : '';
    return `${this.context.getHostname()}${contextPath}${this.getConfig().path}`;
  }

  getRestMethodName = (): string => this.getConfig().restMethod

  stopProcess = () => {
    if (this.process) {
      this.process.cancel();
    }
  }

  startProcess = (params: any, notificationMapper?: NotificationMapper) => {
    this.stopProcess();

    this.process = new RequestProcess(this.httpClientApi, this.getRestMethod(), this.getPath(), this.getConfig().config);
    if (notificationMapper) {
      this.process.setNotificationEmitter(notificationMapper.getNotificationEmitter());
    }

    return this.process.run(params);
  }

  injectLink = (rel: string, href: string, type: string) => {
    const contextConfig = this.context.getConfig();
    const newConfig = new RequestConfig(contextConfig.name, href, contextConfig.config);
    newConfig.withRestMethod(type).withRel(rel);
    this.context = new RestApiRequestContext(this.context.getContextPath(), newConfig);
  }
}

export default RequestRunner;

/* @flow */
import RequestProcess from './RequestProcess';
import NotificationMapper from './NotificationMapper';
import RestApiRequestContext from './RestApiRequestContext';
import type { HttpClientApi } from '../HttpClientApiFlowType';

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

  replaceContext = (context: RestApiRequestContext) => {
    this.context = context;
  }

  getContext = () => this.context;

  getConfig = () => this.getContext().getConfig();

  getName = (): string => this.getConfig().name

  getRestMethod = (): () => void => this.getConfig().restMethod

  getPath = (): string => `${this.context.getHostname()}/${this.context.getContextPath()}${this.getConfig().path}`

  getRestMethodName = (): string => this.httpClientApi.getMethodName(this.getConfig().restMethod)

  isAsyncRestMethod = (): boolean => this.httpClientApi.isAsyncRestMethod(this.getConfig().restMethod)

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
}

export default RequestRunner;

import EventType from './eventType';
import asyncPollingStatus from './asyncPollingStatus';
import { HttpClientApi } from '../HttpClientApiTsType';
import { Response } from './ResponseTsType';
import { RequestAdditionalConfig } from '../RequestAdditionalConfigTsType';
import TimeoutError from './error/TimeoutError';
import RequestErrorEventHandler from './error/RequestErrorEventHandler';

const HTTP_ACCEPTED = 202;
const MAX_POLLING_ATTEMPTS = 150;
const CANCELLED = 'INTERNAL_CANCELLATION';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const hasLocationAndStatusDelayedOrHalted = (responseData) => responseData.location && (responseData.status === asyncPollingStatus.DELAYED
  || responseData.status === asyncPollingStatus.HALTED);

type Notify = (eventType: keyof typeof EventType, data?: any, isPolling?: boolean) => void
type NotificationEmitter = (eventType: keyof typeof EventType, data?: any) => void

interface ResponseDataLink {
  href: string;
  type: string;
  requestPayload: any;
  rel: string;
}

/**
 * RequestProcess
 *
 * Denne klassen utfører et spesifikt kall mot en URL. Tilbyr automatisk henting av data
 * fra "links" i kall-responsen. Håndterer også "long-polling".
 *
 * En starter prosess med run og avbryter med cancel.
 */
class RequestProcess {
  httpClientApi: HttpClientApi;

  restMethod: (url: string, params: any, responseType?: string) => Promise<Response>;

  path: string;

  config: RequestAdditionalConfig;

  maxPollingLimit: number = MAX_POLLING_ATTEMPTS;

  notify: Notify = () => undefined;

  isCancelled = false;

  isPollingRequest = false;

  constructor(httpClientApi: HttpClientApi, restMethod: (url: string, params: any, responseType?: string) => Promise<Response>,
    path: string, config: RequestAdditionalConfig) {
    this.httpClientApi = httpClientApi;
    this.restMethod = restMethod;
    this.path = path;
    this.config = config;
    this.maxPollingLimit = config.maxPollingLimit || this.maxPollingLimit;
  }

  setNotificationEmitter = (notificationEmitter: NotificationEmitter) => {
    this.notify = notificationEmitter;
  }

  execLongPolling = async (location: string, pollingInterval = 0, pollingCounter = 0): Promise<Response> => {
    if (pollingCounter === this.maxPollingLimit) {
      throw new TimeoutError(location);
    }

    await wait(pollingInterval);

    if (this.isCancelled) {
      return null;
    }

    this.notify(EventType.STATUS_REQUEST_STARTED);
    const statusOrResultResponse = await this.httpClientApi.get(location);
    this.notify(EventType.STATUS_REQUEST_FINISHED);

    if (!('data' in statusOrResultResponse)) {
      return statusOrResultResponse;
    }
    const responseData = statusOrResultResponse.data;
    if (responseData && responseData.status === asyncPollingStatus.PENDING) {
      const { pollIntervalMillis, message } = responseData;
      this.notify(EventType.UPDATE_POLLING_MESSAGE, message);
      return this.execLongPolling(location, pollIntervalMillis, pollingCounter + 1);
    }

    return statusOrResultResponse;
  };

  execute = async (path: string, restMethod: (path: string, params?: any) => Promise<Response>, params: any): Promise<Response> => {
    let response = await restMethod(path, params);
    if ('status' in response && response.status === HTTP_ACCEPTED) {
      this.isPollingRequest = true;
      try {
        response = await this.execLongPolling(response.headers.location);
      } catch (error) {
        const responseData = error.response ? error.response.data : undefined;
        if (responseData && hasLocationAndStatusDelayedOrHalted(responseData)) {
          response = await this.httpClientApi.get(responseData.location);
          if ('data' in response) {
            this.notify(EventType.POLLING_HALTED_OR_DELAYED, response.data.taskStatus);
          }
        } else {
          throw error;
        }
      }
    }
    return response;
  }

  cancel = () => {
    this.isCancelled = true;
  }

  run = async (params: any): Promise<{payload: any}> => {
    this.notify(EventType.REQUEST_STARTED);

    try {
      const response = await this.execute(this.path, this.restMethod, params);
      if (this.isCancelled) {
        return { payload: CANCELLED };
      }

      const responseData = response.data;
      this.notify(EventType.REQUEST_FINISHED, responseData, this.isPollingRequest);
      return responseData ? { payload: responseData } : { payload: undefined };
    } catch (error) {
      new RequestErrorEventHandler(this.notify, this.isPollingRequest).handleError(error);
      throw error;
    }
  }
}

export default RequestProcess;

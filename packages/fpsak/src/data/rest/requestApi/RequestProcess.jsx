/* @flow */
import EventType from './eventType';
import asyncPollingStatus from './asyncPollingStatus';
import type { HttpClientApi } from '../HttpClientApiFlowType';
import type { RequestAdditionalConfig } from '../RequestAdditionalConfigFlowType';

const HTTP_ACCEPTED = 202;
const MAX_POLLING_ATTEMPTS = 150;
const CANCELLED = 'CANCELLED';

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

const getMaxPollingAttemptsMessage = (location, pollingMessage) => `Maximum polling attempts exceeded. URL: ${location}. Message: ${pollingMessage}`;

const getRestMethod = (httpClientApi, restMethodString) => {
  switch (restMethodString) {
    case 'POST':
      return httpClientApi.post;
    case 'PUT':
      return httpClientApi.put;
    default:
      return httpClientApi.get;
  }
};

type Notify = (eventType: $Keys<typeof EventType>, data?: any) => void

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

  restMethod: () => void;

  url: string;

  config: RequestAdditionalConfig;

  maxPollingLimit: number = MAX_POLLING_ATTEMPTS;

  notify: Notify = () => undefined;

  isCancelled: boolean = false;

  constructor(httpClientApi: HttpClientApi, restMethod: () => any, path: string, config: RequestAdditionalConfig) {
    this.httpClientApi = httpClientApi;
    this.restMethod = restMethod;
    this.url = path;
    this.config = config;
    this.maxPollingLimit = config.maxPollingLimit || this.maxPollingLimit;
  }

  setNotificationEmitter = (notify: Notify) => {
    this.notify = notify;
  }

  execLongPolling = async (location: string, pollingInterval: number = 0, pollingCounter: number = 0, previousMessage: string = '') => {
    if (pollingCounter === this.maxPollingLimit) {
      throw new Error(getMaxPollingAttemptsMessage(location, previousMessage));
    }

    await wait(pollingInterval);

    if (this.isCancelled) {
      return CANCELLED;
    }

    this.notify(EventType.STATUS_REQUEST_STARTED);
    const statusOrResultResponse = await this.httpClientApi.get(location);
    this.notify(EventType.STATUS_REQUEST_FINISHED);

    const responseData = statusOrResultResponse.data;
    if (responseData && responseData.status === asyncPollingStatus.PENDING) {
      const { pollIntervalMillis, message } = responseData;
      this.notify(EventType.UPDATE_POLLING_MESSAGE, message);
      return this.execLongPolling(location, pollIntervalMillis, pollingCounter + 1, message);
    }

    return statusOrResultResponse;
  };

  execLinkRequests = async (responseData) => {
    const requestList = responseData.links
      .map(link => () => this.execute(// eslint-disable-line no-use-before-define
        link.href, getRestMethod(this.httpClientApi, link.type), link.requestPayload,
      )
        .then(response => Promise.resolve({ [link.rel]: response.data })));

    // TODO (TOR) Må kunna konfigurera om ein skal feila om eitt av kalla feilar. Og kva med logging?
    return Promise.all([Promise.resolve(responseData), ...requestList.map(request => request())])
      .then(allResponses => (this.config.addLinkDataToArray
        ? allResponses.reduce((acc, rData) => (rData.links ? acc : acc.concat(Object.values(rData)[0])), [])
        : allResponses.reduce((acc, rData) => ({ ...acc, ...rData }), {})));
  }

  execute = async (url: string, restMethod: (url: string, params?: any) => void, params: any) => {
    let response = await restMethod(url, params);
    if (response.status === HTTP_ACCEPTED) {
      try {
        response = await this.execLongPolling(response.headers.location);
      } catch (error) {
        const responseData = error.response ? error.response.data : undefined;
        if (responseData && (responseData.status === asyncPollingStatus.DELAYED || responseData.status === asyncPollingStatus.HALTED)) {
          response = await this.httpClientApi.get(responseData.location);
        } else {
          throw error;
        }
      }
    }
    const responseData = response.data;
    if (this.config.fetchLinkDataAutomatically && responseData && responseData.links && responseData.links.length > 0) {
      response = await this.execLinkRequests(responseData);
    }
    return response;
  }

  cancel = () => {
    this.isCancelled = true;
  }

  run = async (params: any) => {
    this.notify(EventType.REQUEST_STARTED);

    try {
      const response = await this.execute(this.url, this.restMethod, params);
      if (response === CANCELLED) {
        return response;
      }

      // FIXME
      const responseData = response.data !== null && response.data !== undefined ? response.data : response;

      this.notify(EventType.REQUEST_FINISHED, responseData);
      return responseData ? { payload: responseData } : { payload: [] };
    } catch (error) {
      if (!error.response) { // Håndter feil som er kastet manuelt
        this.notify(EventType.REQUEST_ERROR, error.message);
        throw error;
      }
      const data = error.response.data ? error.response.data : error;
      this.notify(EventType.REQUEST_ERROR, data);
      throw error;
    }
  }
}

export default RequestProcess;

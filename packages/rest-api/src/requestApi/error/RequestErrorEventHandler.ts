import EventType from '../eventType';
import { ErrorType } from './errorTsType';
import { isHandledError, is401Error, is418Error } from './ErrorTypes';
import TimeoutError from './TimeoutError';

const isDevelopment = process.env.NODE_ENV === 'development';

type NotificationEmitter = (eventType: keyof typeof EventType, data?: any, isPollingRequest?: boolean) => void

const isString = value => typeof value === 'string';

const isOfTypeBlob = error => error && error.config && error.config.responseType === 'blob';

const blobParser = (blob: any): Promise<string> => {
  const fileReader = new FileReader();

  return new Promise((resolve, reject) => {
    fileReader.onerror = () => {
      fileReader.abort();
      reject(new Error('Problem parsing blob'));
    };

    fileReader.onload = () => {
      if (!(fileReader.result instanceof ArrayBuffer)) {
        resolve(fileReader.result);
      } else {
        reject(new Error('Problem parsing blob'));
      }
    };

    if (blob instanceof Blob) {
      fileReader.readAsText(blob);
    }
  });
};

class RequestErrorEventHandler {
  notify: NotificationEmitter

  isPollingRequest: boolean

  constructor(notificationEmitter: NotificationEmitter, isPollingRequest: boolean) {
    this.notify = notificationEmitter;
    this.isPollingRequest = isPollingRequest;
  }

  handleError = async (error: ErrorType | TimeoutError) => {
    if (error instanceof TimeoutError) {
      this.notify(EventType.POLLING_TIMEOUT, { location: error.location });
      return;
    }

    const formattedError = this.formatError(error);

    if (isOfTypeBlob(error)) {
      const jsonErrorString = await blobParser(formattedError.data);
      if (isString(jsonErrorString)) {
        formattedError.data = JSON.parse(jsonErrorString);
      }
    }
    if (is401Error(formattedError.status) && !isDevelopment) {
      this.notify(EventType.REQUEST_ERROR, { message: error.message }, this.isPollingRequest);
    } else if (is418Error(formattedError.status)) {
      this.notify(EventType.POLLING_HALTED_OR_DELAYED, formattedError.data);
    } else if (!error.response && error.message) {
      this.notify(EventType.REQUEST_ERROR, { message: error.message }, this.isPollingRequest);
    } else if (!isHandledError(formattedError.type)) {
      this.notify(EventType.REQUEST_ERROR, this.getFormattedData(formattedError.data), this.isPollingRequest);
    }
  };

  getFormattedData = (data: string | Record<string, any>) => (isString(data) ? { message: data } : data);

  findErrorData = (response: {data?: any; status?: number; statusText?: string}) => (response.data ? response.data : response.statusText);

  formatError = (error: ErrorType) => {
    const response = error && error.response ? error.response : undefined;
    return {
      data: response ? this.findErrorData(response) : undefined,
      type: response && response.data ? response.data.type : undefined,
      status: response ? response.status : undefined,
    };
  };
}

export default RequestErrorEventHandler;

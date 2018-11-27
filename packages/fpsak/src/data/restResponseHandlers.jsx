/* @flow */
import { dateFormat, timeFormat } from 'utils/dateUtils';
import { addErrorMessage, addErrorMessageCode } from 'app/duck';
import { isHandledError, is401Error, is418Error } from 'app/ErrorTypes';
import asyncPollingStatus from './rest/requestApi/asyncPollingStatus';

const isDevelopment = process.env.NODE_ENV === 'development';

// TODO (TOR) Flyttast inn i RequestProcess.

const HALTED_PROCESS_TASK_MESSAGE_CODE = 'Rest.ErrorMessage.General';
const DELAYED_PROCESS_TASK_MESSAGE_CODE = 'Rest.ErrorMessage.DownTime';

const blobParser = (blob: any) => {
  const fileReader = new FileReader();

  return new Promise((resolve, reject) => {
    fileReader.onerror = () => {
      fileReader.abort();
      reject(new Error('Problem parsing blob'));
    };

    fileReader.onload = () => {
      resolve(fileReader.result);
    };

    fileReader.readAsText(blob);
  });
};

const handleTaskStatus = (store, taskStatus) => {
  const { message, status, eta } = taskStatus;
  if (status === asyncPollingStatus.HALTED) {
    store.dispatch(addErrorMessageCode({ code: HALTED_PROCESS_TASK_MESSAGE_CODE, params: { errorDetails: message } }));
  } else if (status === asyncPollingStatus.DELAYED) {
    store.dispatch(addErrorMessageCode({ code: DELAYED_PROCESS_TASK_MESSAGE_CODE, params: { date: dateFormat(eta), time: timeFormat(eta), message } }));
  }
};

const handleSuccess = (store, response) => {
  const responseData = response.data;
  if (responseData && responseData.taskStatus) {
    handleTaskStatus(store, responseData.taskStatus);
  }
  return response;
};

const findErrorText = response => (response.data ? response.data : response.statusText);

const handleError = async (store, error) => {
  const response = error && error.response ? error.response : undefined;
  const formattedError = {
    data: response ? findErrorText(response) : undefined,
    type: response && response.data ? response.data.type : undefined,
    status: response ? response.status : undefined,
  };

  if (error && error.config && error.config.responseType === 'blob') {
    const jsonErrorString = await blobParser(formattedError.data);
    if (typeof jsonErrorString === 'string') {
      formattedError.data = JSON.parse(jsonErrorString);
    }
  }

  if (is401Error(formattedError.status) && !isDevelopment) {
    window.location.reload();
  } else if (is418Error(formattedError.status)) {
    handleTaskStatus(store, formattedError.data);
  } else if (!error.response && error.message) {
    store.dispatch(addErrorMessage({ message: error.message }));
  } else if (!isHandledError(formattedError.type)) {
    store.dispatch(addErrorMessage(formattedError.data));
  }

  return Promise.reject(error);
};

type Store = {
  dispatch: (actionCreator: any) => void,
}

type SuccessResponse = {
  data: {
    taskStatus: {
      message: string,
      status: string,
      eta: string,
    }
  }
}

type ErrorResponse = {
  response: {
    data: {
      type: string,
    },
    status: string,
  },
  config: {
    responseType: string,
  }
}

export const getSuccessResponseHandler = (store: Store) => (response: SuccessResponse) => handleSuccess(store, response);
export const getErrorResponseHandler = (store: Store) => (error: ErrorResponse) => handleError(store, error);

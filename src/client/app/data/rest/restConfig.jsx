import axios from 'axios';

import { dateFormat, timeFormat } from '@fpsak-frontend/utils/dateUtils';
import { addErrorMessage, addErrorMessageCode } from 'app/duck';
import { isHandledError, is401Error, is418Error } from 'app/ErrorTypes';
import asyncPollingStatus from './redux/asyncPollingStatus';
import blobParser from './blobParser';

const isDevelopment = process.env.NODE_ENV === 'development';

const HALTED_PROCESS_TASK_MESSAGE_CODE = 'Rest.ErrorMessage.General';
const DELAYED_PROCESS_TASK_MESSAGE_CODE = 'Rest.ErrorMessage.DownTime';

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


const handleError = async (store, error) => {
  const response = error && error.response ? error.response : undefined;
  const formattedError = {
    data: response ? response.data : undefined,
    type: response && response.data ? response.data.type : undefined,
    status: response && response ? response.status : undefined,
  };

  if (error && error.config && error.config.responseType === 'blob') {
    const jsonErrorString = await blobParser(formattedError.data);
    formattedError.data = JSON.parse(jsonErrorString);
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

const configureResponseInterceptors = (store) => {
  const onSuccessResponse = response => handleSuccess(store, response);
  const onErrorResponse = error => handleError(store, error);
  axios.interceptors.response.use(onSuccessResponse, onErrorResponse);
};

const configureRestInterceptors = (store) => {
  configureResponseInterceptors(store);
};

export default configureRestInterceptors;

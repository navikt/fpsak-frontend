import { createSelector } from 'reselect';

import {
  addErrorMessage, getCrashMessage, removeErrorMessage, showCrashMessage, errorReducer, reducerName, getErrorMessages,
} from './errorDuck';
import ErrorFormatter from './ErrorFormatter';

class ErrorHandler {
  errorFormatter: ErrorFormatter;

  constructor() {
    this.errorFormatter = new ErrorFormatter();
  }

  getErrorReducerName = () => reducerName;

  getErrorReducer = () => errorReducer;

  getErrorActionCreator = () => addErrorMessage;

  showCrashMessage = showCrashMessage;

  removeErrorMessage = removeErrorMessage;

  getAllErrorMessages = createSelector([getErrorMessages, getCrashMessage],
    (errorMessages, crashMessage) => this.errorFormatter
      .format(errorMessages, crashMessage));

  getCrashMessage = createSelector([getCrashMessage], message => message);
}

const errorHandler = new ErrorHandler();
export default errorHandler;

import { createSelector } from 'reselect';
import { getRestApiData } from 'data/duck';
import { FpsakApi } from 'data/fpsakApi';

/* Action types */
export const ADD_ERROR_MESSAGE = 'ADD_ERROR_MESSAGE';
export const ADD_ERROR_MESSAGE_CODE = 'ADD_ERROR_MESSAGE_CODE';
export const REMOVE_ERROR_MESSAGE = 'REMOVE_ERROR_MESSAGE';
const SHOW_CRASH_MESSAGE = 'SHOW_CRASH_MESSAGE';

/* Action creators */
export const addErrorMessage = message => ({
  type: ADD_ERROR_MESSAGE,
  data: message,
});

export const addErrorMessageCode = messageObject => ({
  type: ADD_ERROR_MESSAGE_CODE,
  data: messageObject,
});


export const removeErrorMessage = () => ({
  type: REMOVE_ERROR_MESSAGE,
});

export const showCrashMessage = message => ({
  type: SHOW_CRASH_MESSAGE,
  data: message,
});

/* Reducers */
const extractErrorMessage = (data) => {
  if (data.feilmelding) {
    return data.feilmelding;
  }
  return data.message
    ? data.message
    : data;
};

const addToExistingErrorMessages = (existingErrorMessages, newErrorMessage) => {
  const newArray = existingErrorMessages.slice();
  if (!existingErrorMessages.includes(newErrorMessage)) {
    newArray.push(newErrorMessage);
  }
  return newArray;
};

const initialState = {
  errorMessages: [],
  errorMessageCodeWithParams: undefined,
  crashMessage: '',
};

export const errorHandlingReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case ADD_ERROR_MESSAGE:
      return {
        ...state,
        errorMessages: addToExistingErrorMessages(state.errorMessages, extractErrorMessage(action.data)),
      };
    case ADD_ERROR_MESSAGE_CODE:
      return {
        ...state,
        errorMessageCodeWithParams: action.data,
      };
    case REMOVE_ERROR_MESSAGE:
      return {
        ...state,
        errorMessages: [],
        errorMessageCodeWithParams: undefined,
        crashMessage: '',
      };
    case SHOW_CRASH_MESSAGE:
      return {
        ...state,
        crashMessage: action.data,
      };
    default:
      return state;
  }
};

/* Selectors */
const getErrorHandlingContext = state => state.default.errorHandlingContext;
export const getErrorMessages = createSelector([getErrorHandlingContext], errorHandlingContext => errorHandlingContext.errorMessages);
export const getErrorMessageCodeWithParams = createSelector([getErrorHandlingContext], errorHandlingContext => errorHandlingContext.errorMessageCodeWithParams);
export const getCrashMessage = createSelector([getErrorHandlingContext], errorHandlingContext => errorHandlingContext.crashMessage);
export const getNavAnsattName = createSelector([getRestApiData(FpsakApi.NAV_ANSATT)], (navAnsatt = {}) => navAnsatt.navn);
export const getRettskildeUrl = createSelector([getRestApiData(FpsakApi.RETTSKILDE_URL)], (rettskildeData = {}) => rettskildeData.verdi);
export const getSystemrutineUrl = createSelector([getRestApiData(FpsakApi.SYSTEMRUTINE_URL)], (systemrutineData = {}) => systemrutineData.verdi);
export const getFunksjonellTid = createSelector([getRestApiData(FpsakApi.NAV_ANSATT)], (navAnsatt = {}) => navAnsatt.funksjonellTid);
export const getShowDetailedErrorMessages = createSelector(
  [getRestApiData(FpsakApi.SHOW_DETAILED_ERROR_MESSAGES)], (showDetailedErrorMessages = false) => showDetailedErrorMessages,
);
export const getIntegrationStatusList = createSelector(
  [getRestApiData(FpsakApi.INTEGRATION_STATUS)], (integrationStatusList = []) => integrationStatusList,
);

import { createSelector } from 'reselect';
import fpsakApi from 'data/fpsakApi';
import featureToggle from 'kodeverk/featureToggle';

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

export const fetchFeatureToggleActionCreator = toggles => dispatch => (
  dispatch(fpsakApi.FEATURE_TOGGLE.makeRestApiRequest()({ toggles }))
);

/* Selectors */
const getErrorHandlingContext = state => state.default.errorHandlingContext;
export const getErrorMessages = createSelector([getErrorHandlingContext], errorHandlingContext => errorHandlingContext.errorMessages);
export const getErrorMessageCodeWithParams = createSelector([getErrorHandlingContext], errorHandlingContext => errorHandlingContext.errorMessageCodeWithParams);
export const getCrashMessage = createSelector([getErrorHandlingContext], errorHandlingContext => errorHandlingContext.crashMessage);
export const getNavAnsattName = createSelector([fpsakApi.NAV_ANSATT.getRestApiData()], (navAnsatt = {}) => navAnsatt.navn);
export const getRettskildeUrl = createSelector([fpsakApi.RETTSKILDE_URL.getRestApiData()], (rettskildeData = {}) => rettskildeData.verdi);
export const getSystemrutineUrl = createSelector([fpsakApi.SYSTEMRUTINE_URL.getRestApiData()], (systemrutineData = {}) => systemrutineData.verdi);
export const getFunksjonellTid = createSelector([fpsakApi.NAV_ANSATT.getRestApiData()], (navAnsatt = {}) => navAnsatt.funksjonellTid);
export const getFeatureToggleSimulering = createSelector(
  [fpsakApi.FEATURE_TOGGLE.getRestApiData()], (ftData = {}) => ftData.featureToggles[featureToggle.SIMULER_OPPDRAG],
);
export const getFeatureToggleLøpendeMedlemskap = createSelector(
  [fpsakApi.FEATURE_TOGGLE.getRestApiData()], (ftData = {}) => ftData.featureToggles[featureToggle.LØPENDE_MEDLESMKAP],
);
export const getFeatureToggleFormkrav = createSelector(
  [fpsakApi.FEATURE_TOGGLE.getRestApiData()], (ftData = {}) => ftData.featureToggles[featureToggle.FORMKRAV],
);
export const getShowDetailedErrorMessages = createSelector(
  [fpsakApi.SHOW_DETAILED_ERROR_MESSAGES.getRestApiData()], (showDetailedErrorMessages = false) => showDetailedErrorMessages,
);
export const getIntegrationStatusList = createSelector(
  [fpsakApi.INTEGRATION_STATUS.getRestApiData()], (integrationStatusList = []) => integrationStatusList,
);

import { isAsyncRestMethod } from 'data/rest/restMethods';

const initialStateAsync = {
  data: undefined,
  meta: undefined,
  error: undefined,
  started: false,
  finished: false,
  statusRequestStarted: false,
  statusRequestFinished: false,
  pollingMessage: undefined,
};

const initialStateSync = {
  data: undefined,
  meta: undefined,
  error: undefined,
  started: false,
  finished: false,
};

/**
   * createRequestReducer
   *
   * Hjelpefunksjon som lager en reducer for et AJAX-kall.
   * Reduceren endrer state for actionene med navn definert av
   *   actionTypes.requestStarted
   *   actionTypes.requestFinished
   *   actionTypes.requestError
   */
const createRequestReducer = (restMethod, resourceName, actionTypes) => {
  const isAsync = isAsyncRestMethod(restMethod);
  const initialState = isAsync ? initialStateAsync : initialStateSync;

  return (state = initialState, action = {}) => { // NOSONAR Switch brukes som standard i reducers
    switch (action.type) {
      case actionTypes.requestStarted:
      case actionTypes.copyDataStarted:
        return {
          ...initialState,
          data: action.meta.options.keepData ? state.data : initialState.data,
          started: true,
          meta: action.payload,
        };
      case actionTypes.statusRequestStarted:
        return {
          ...state,
          statusRequestStarted: true,
          statusRequestFinished: false,
        };
      case actionTypes.updatePollingMessage:
        return {
          ...state,
          pollingMessage: action.payload,
        };
      case actionTypes.statusRequestFinished:
        return {
          ...state,
          statusRequestStarted: false,
          statusRequestFinished: true,
        };
      case actionTypes.requestFinished:
      case actionTypes.copyDataFinished: {
        const newState = {
          ...state,
          started: false,
          finished: true,
          data: action.payload,
        };
        return isAsync ? { ...newState, pollingMessage: undefined } : newState;
      }
      case actionTypes.requestError: {
        const newState = {
          ...state,
          data: undefined,
          started: false,
          error: action.payload,
        };
        return isAsync ? { ...newState, pollingMessage: undefined } : newState;
      }
      case actionTypes.reset:
        return {
          ...initialState,
        };
      default:
        return state;
    }
  };
};

export default createRequestReducer;

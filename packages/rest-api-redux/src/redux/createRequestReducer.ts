import { ActionTypes } from './ActionTypesTsType';

const initialStateAsync = {
  data: undefined,
  meta: undefined,
  error: undefined,
  started: false,
  finished: false,
  statusRequestStarted: false,
  statusRequestFinished: false,
  pollingMessage: undefined,
  pollingTimeout: false,
};

const initialStateSync = {
  data: undefined,
  meta: undefined,
  error: undefined,
  started: false,
  finished: false,
};

export interface State {
  data: any;
  meta: any;
  error?: any;
  started: boolean;
  finished: boolean;
  statusRequestStarted?: boolean;
  statusRequestFinished?: boolean;
  pollingMessage?: string;
  pollingTimeout?: boolean;
}

interface Action {
  type: string;
  meta?: {
    options: {
      keepData: boolean;
    };
  };
  payload?: any;
}

/**
   * createRequestReducer
   *
   * Hjelpefunksjon som lager en reducer for et AJAX-kall.
   * Reduceren endrer state for actionene med navn definert av
   *   actionTypes.requestStarted
   *   actionTypes.requestFinished
   *   actionTypes.requestError
   */
const createRequestReducer = (isAsync: boolean, actionTypes: ActionTypes) => {
  const initialState = isAsync ? initialStateAsync : initialStateSync;

  return (state: State = initialState, action: Action = { type: '' }) => { // NOSONAR Switch brukes som standard i reducers
    switch (action.type) {
      case actionTypes.requestStarted:
      case actionTypes.copyDataStarted: {
        return {
          ...initialState,
          data: action.meta && action.meta.options.keepData ? state.data : initialState.data,
          started: true,
          meta: action.payload,
        };
      }
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
      case actionTypes.pollingTimeout:
        return {
          ...state,
          pollingTimeout: true,
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

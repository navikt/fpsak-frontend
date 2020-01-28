import { ActionTypes } from './ActionTypesTsType';

const initialState = {
  data: undefined,
  previousData: undefined,
  meta: undefined,
  cacheParams: undefined,
  error: undefined,
  started: false,
  finished: false,
  statusRequestStarted: false,
  statusRequestFinished: false,
  pollingMessage: undefined,
  pollingTimeout: false,
};

export interface State {
  data: any;
  previousData: any;
  meta: any;
  cacheParams: any;
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
      cacheParams: {};
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
const createRequestReducer = (actionTypes: ActionTypes, name: string) => (state: State = initialState,
  action: Action = { type: '' }) => { // NOSONAR Switch brukes som standard i reducers
  if (!action.type.includes(`@@REST/${name}`)) {
    return state;
  }
  switch (action.type) {
    case actionTypes.requestStarted():
      return {
        ...initialState,
        data: action.meta && action.meta.options.keepData ? state.data : initialState.data,
        started: true,
        meta: action.payload,
        cacheParams: action.meta.options.cacheParams,
        previousData: state.previousData,
      };
    case actionTypes.statusRequestStarted():
      return {
        ...state,
        statusRequestStarted: true,
        statusRequestFinished: false,
      };
    case actionTypes.updatePollingMessage():
      return {
        ...state,
        pollingMessage: action.payload,
      };
    case actionTypes.pollingTimeout():
      return {
        ...state,
        pollingTimeout: true,
      };
    case actionTypes.statusRequestFinished():
      return {
        ...state,
        statusRequestStarted: false,
        statusRequestFinished: true,
      };
    case actionTypes.requestFinished():
      return {
        ...state,
        started: false,
        finished: true,
        data: action.payload,
        pollingMessage: undefined,
        previousData: state.data,
      };
    case actionTypes.requestError():
      return {
        ...state,
        data: undefined,
        started: false,
        finished: true,
        error: action.payload,
        pollingMessage: undefined,
      };
    case actionTypes.reset():
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

export default createRequestReducer;

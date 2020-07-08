import { createSelector } from 'reselect';

/* Action types */
export const ADD_ERROR_MESSAGE = 'ADD_ERROR_MESSAGE';
const ADD_CRASH_MESSAGE = 'ADD_CRASH_MESSAGE';
export const REMOVE_ERROR_MESSAGE = 'REMOVE_ERROR_MESSAGE';

/* Action creators */
export const addErrorMessage = (data) => ({
  type: ADD_ERROR_MESSAGE,
  data,
});

export const showCrashMessage = (message) => ({
  type: ADD_CRASH_MESSAGE,
  data: message,
});

export const removeErrorMessage = () => ({
  type: REMOVE_ERROR_MESSAGE,
});

/* Reducers */
export const reducerName = 'error';

const initialState = {
  errorMessages: [],
  crashMessage: undefined,
};

interface ActionTsType {
  type?: string;
  data?: any;
}
interface StateTsType {
  errorMessages: any;
  crashMessage?: string;
}

export const errorReducer = (state: StateTsType = initialState, action: ActionTsType = {}) => {
  switch (action.type) {
    case ADD_ERROR_MESSAGE:
      return {
        ...state,
        errorMessages: state.errorMessages.concat(action.data),
      };
    case ADD_CRASH_MESSAGE:
      return {
        ...state,
        crashMessage: action.data,
      };
    case REMOVE_ERROR_MESSAGE:
      return {
        ...state,
        errorMessages: [],
        crashMessage: undefined,
      };
    default:
      return state;
  }
};

/* Selectors */
const getErrorContext = (state) => state.default[reducerName];

export const getErrorMessages = createSelector([getErrorContext], (appContext) => appContext.errorMessages);
export const getCrashMessage = createSelector([getErrorContext], (appContext) => appContext.crashMessage);

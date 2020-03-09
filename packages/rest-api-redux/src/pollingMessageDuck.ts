import { createSelector } from 'reselect';

import reducerRegistry from './ReducerRegistry';

// DETTE ER KUN MIDLERTIDIG. IKKJE LEGG NOKO MEIR HER!
// TODO (TOR) Flytt denne

const reducerName = 'pollingMessage';

/* Action types */
const actionType = (name) => `${reducerName}/${name}`;
const SET_REQUEST_POLLING_MESSAGE = actionType('SET_REQUEST_POLLING_MESSAGE');

/* Action creators */
export const setRequestPollingMessage = (data) => ({
  type: SET_REQUEST_POLLING_MESSAGE,
  data,
});

/* Reducers */
const initialState = {
  restRequestPollingMessage: undefined,
};

interface Action {
  type: string;
  data?: string;
}

const pollingMessageReducer = (state = initialState, action: Action = { type: '' }) => { // NOSONAR Switch brukes som standard i reducers
  switch (action.type) { // NOSONAR Switch brukes som standard i reducers
    case SET_REQUEST_POLLING_MESSAGE:
      return {
        restRequestPollingMessage: action.data,
      };
    default:
      return state;
  }
};

reducerRegistry.register(reducerName, pollingMessageReducer);

// Selectors (Kun de knyttet til reducer)
const getAppContext = (state) => state.default[reducerName];
export const getRequestPollingMessage = createSelector([getAppContext], (appContext) => appContext.restRequestPollingMessage);

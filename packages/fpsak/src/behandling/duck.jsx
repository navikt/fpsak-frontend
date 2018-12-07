import { createSelector } from 'reselect';

/* Action types */
const SET_BEHANDLING_ID = 'SET_BEHANDLING_ID';

export const setSelectedBehandlingId = behandlingId => ({
  type: SET_BEHANDLING_ID,
  data: behandlingId,
});

/* Reducer */
const initialState = {
  behandlingId: undefined,
};

export const behandlingReducer = (state = initialState, action = {}) => { // NOSONAR Switch brukes som standard i reducers
  switch (action.type) {
    case SET_BEHANDLING_ID:
      return {
        ...initialState,
        behandlingId: action.data,
      };
    default:
      return state;
  }
};

// Selectors (Kun de knyttet til reducer)
const getBehandlingContext = state => state.default.behandlingContext;
export const getSelectedBehandlingId = createSelector([getBehandlingContext], behandlingContext => behandlingContext.behandlingId);

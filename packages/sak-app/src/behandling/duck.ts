import { createSelector } from 'reselect';

import { reducerRegistry } from '@fpsak-frontend/rest-api-redux';

const reducerName = 'behandling';

/* Action types */
const actionType = (name) => `${reducerName}/${name}`;
const SET_URL_BEHANDLING_ID = actionType('SET_URL_BEHANDLING_ID');
const SET_BEHANDLING_ID_OG_VERSJON = actionType('SET_BEHANDLING_ID_OG_VERSJON');
const OPPDATER_BEHANDLING_VERSJON = actionType('OPPDATER_BEHANDLING_VERSJON');
const RESET_BEHANDLING_CONTEXT = actionType('RESET_BEHANDLING_CONTEXT');

export const setUrlBehandlingId = (behandlingId) => ({
  type: SET_URL_BEHANDLING_ID,
  data: behandlingId,
});

export const setSelectedBehandlingIdOgVersjon = (versjon) => ({
  type: SET_BEHANDLING_ID_OG_VERSJON,
  data: versjon,
});

export const oppdaterBehandlingVersjon = (behandlingVersjon) => ({
  type: OPPDATER_BEHANDLING_VERSJON,
  data: behandlingVersjon,
});

export const resetBehandlingContext = () => ({
  type: RESET_BEHANDLING_CONTEXT,
});

/* Reducer */
const initialState = {
  urlBehandlingId: undefined,
  behandlingId: undefined,
  behandlingVersjon: undefined,
};

interface Action {
  type: string;
  data?: number;
}

export const behandlingReducer = (state = initialState, action: Action = { type: '' }) => { // NOSONAR Switch brukes som standard i reducers
  switch (action.type) {
    case SET_URL_BEHANDLING_ID:
      return {
        ...state,
        urlBehandlingId: action.data,
      };
    case SET_BEHANDLING_ID_OG_VERSJON:
      return {
        ...state,
        behandlingId: state.urlBehandlingId,
        behandlingVersjon: action.data,
      };
    case OPPDATER_BEHANDLING_VERSJON:
      return {
        ...state,
        behandlingVersjon: action.data,
      };
    case RESET_BEHANDLING_CONTEXT:
      return initialState;
    default:
      return state;
  }
};

reducerRegistry.register(reducerName, behandlingReducer);

// Selectors (Kun de knyttet til reducer)
const getBehandlingContext = (state) => state.default[reducerName];
export const getUrlBehandlingId = createSelector([getBehandlingContext], (behandlingContext) => behandlingContext.urlBehandlingId);
export const getSelectedBehandlingId = createSelector([getBehandlingContext], (behandlingContext) => behandlingContext.behandlingId);
export const getBehandlingVersjon = createSelector([getBehandlingContext], (behandlingContext) => behandlingContext.behandlingVersjon);

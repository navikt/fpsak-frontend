import { reducerRegistry } from '@fpsak-frontend/rest-api-redux';

const reducerName = 'behandlingSupport';

/* Action types */
const actionType = (name) => `${reducerName}/${name}`;
const SET_SELECTED_SUPPORT_PANEL = actionType('SET_SELECTED_SUPPORT_PANEL');
const RESET_BEHANDLING_SUPPORT = actionType('RESET_BEHANDLING_SUPPORT');

/* Action creators */
export const setSelectedSupportPanel = (panelName) => ({
  type: SET_SELECTED_SUPPORT_PANEL,
  payload: panelName,
});

export const resetBehandlingSupport = () => ({
  type: RESET_BEHANDLING_SUPPORT,
});

/* Reducer */
const initialState = {
  selectedSupportPanel: undefined,
};

interface Action {
  type: string;
  payload?: string;
}

export const behandlingSupportReducer = (state = initialState, action: Action = { type: '' }) => {
  switch (action.type) {
    case SET_SELECTED_SUPPORT_PANEL:
      return {
        ...state,
        selectedSupportPanel: action.payload,
      };
    case RESET_BEHANDLING_SUPPORT:
      return initialState;
    default:
      return state;
  }
};

reducerRegistry.register(reducerName, behandlingSupportReducer);

const getBehandlingSupportContext = (state) => state.default[reducerName];
export const getSelectedSupportPanel = (state) => getBehandlingSupportContext(state).selectedSupportPanel;

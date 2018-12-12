import fpsakApi from 'data/fpsakApi';

import reducerRegistry from '../ReducerRegistry';

const reducerName = 'behandlingSupport';

/* Action types */
const actionType = name => `${reducerName}/${name}`;
const SET_SELECTED_SUPPORT_PANEL = actionType('SET_SELECTED_SUPPORT_PANEL');
const RESET_BEHANDLING_SUPPORT = actionType('RESET_BEHANDLING_SUPPORT');

/* Action creators */
export const setSelectedSupportPanel = panelName => ({
  type: SET_SELECTED_SUPPORT_PANEL,
  payload: panelName,
});

export const resetBehandlingSupport = () => ({
  type: RESET_BEHANDLING_SUPPORT,
});

export const resetBehandlingsupportInfo = () => (dispatch) => {
  dispatch(fpsakApi.ALL_DOCUMENTS.resetRestApi()());
  dispatch(fpsakApi.HISTORY.resetRestApi()());
};

export const updateBehandlingsupportInfo = saksnummer => dispatch => Promise.all([
  dispatch(fpsakApi.ALL_DOCUMENTS.makeRestApiRequest()({ saksnummer }, { keepData: true })),
  dispatch(fpsakApi.HISTORY.makeRestApiRequest()({ saksnummer }, { keepData: true })),
]);

/* Reducer */
const initialState = {
  selectedSupportPanel: undefined,
};

export const behandlingSupportReducer = (state = initialState, action = {}) => {
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

const getBehandlingSupportContext = state => state.default[reducerName];
export const getSelectedSupportPanel = state => getBehandlingSupportContext(state).selectedSupportPanel;

import { makeRestApiRequest, resetRestApi } from 'data/duck';
import { FpsakApi } from 'data/fpsakApi';

/* Action types */
const actionType = name => `behandlingSupport/${name}`;
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
  dispatch(resetRestApi(FpsakApi.ALL_DOCUMENTS)());
  dispatch(resetRestApi(FpsakApi.HISTORY)());
};

export const updateBehandlingsupportInfo = saksnummer => dispatch => Promise.all([
  dispatch(makeRestApiRequest(FpsakApi.ALL_DOCUMENTS)({ saksnummer }, { keepData: true })),
  dispatch(makeRestApiRequest(FpsakApi.HISTORY)({ saksnummer }, { keepData: true })),
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

const getBehandlingSupportContext = state => state.default.behandlingSupportContext;
export const getSelectedSupportPanel = state => getBehandlingSupportContext(state).selectedSupportPanel;

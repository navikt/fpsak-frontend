import { createSelector } from 'reselect';

import { makeRestApiRequest, setDataRestApi } from 'data/duck';
import { FpsakApi } from 'data/fpsakApi';
import { updateFagsakInfo } from 'fagsak/duck';

/* Action types */
export const SET_SELECTED_BEHANDLINGSPUNKT_NAVN = 'SET_SELECTED_BEHANDLINGSPUNKT_NAVN';
export const RESET_BEHANDLINGSPUNKTER = 'RESET_BEHANDLINGSPUNKTER';
export const RESOLVE_PROSESS_AKSJONSPUNKTER_STARTED = 'RESOLVE_PROSESS_AKSJONSPUNKTER_STARTED';
export const RESOLVE_PROSESS_AKSJONSPUNKTER_SUCCESS = 'RESOLVE_PROSESS_AKSJONSPUNKTER_SUCCESS';
export const TOGGLE_BEHANDLINGSPUNKT_OVERSTYRING = 'TOGGLE_BEHANDLINGSPUNKT_OVERSTYRING';

export const resetBehandlingspunkter = () => ({
  type: RESET_BEHANDLINGSPUNKTER,
});

export const setSelectedBehandlingspunktNavn = selectedBehandlingspunktNavn => ({
  type: SET_SELECTED_BEHANDLINGSPUNKT_NAVN,
  data: selectedBehandlingspunktNavn,
});

export const toggleBehandlingspunktOverstyring = behandlingspunkt => ({
  type: TOGGLE_BEHANDLINGSPUNKT_OVERSTYRING,
  data: behandlingspunkt,
});

const resolveProsessAksjonspunkterStarted = () => ({
  type: RESOLVE_PROSESS_AKSJONSPUNKTER_STARTED,
});

const resolveProsessAksjonspunkterSuccess = (response, behandlingIdentifier, shouldUpdateInfo) => (dispatch) => {
  dispatch({
    type: RESOLVE_PROSESS_AKSJONSPUNKTER_SUCCESS,
  });
  if (shouldUpdateInfo) {
    return dispatch(updateFagsakInfo(behandlingIdentifier.saksnummer))
      .then(() => dispatch(setDataRestApi(FpsakApi.BEHANDLING)(response.payload, behandlingIdentifier.toJson(), { keepData: true })));
  }
  return true;
};

export const resolveProsessAksjonspunkter = (behandlingIdentifier, params, shouldUpdateInfo) => (dispatch) => {
  dispatch(resolveProsessAksjonspunkterStarted());
  return dispatch(makeRestApiRequest(FpsakApi.SAVE_AKSJONSPUNKT)(params))
    .then(response => dispatch(resolveProsessAksjonspunkterSuccess(response, behandlingIdentifier, shouldUpdateInfo)));
};

export const overrideProsessAksjonspunkter = (behandlingIdentifier, params, shouldUpdateInfo) => (dispatch) => {
  dispatch(resolveProsessAksjonspunkterStarted());
  return dispatch(makeRestApiRequest(FpsakApi.SAVE_OVERSTYRT_AKSJONSPUNKT)(params))
    .then(response => dispatch(resolveProsessAksjonspunkterSuccess(response, behandlingIdentifier, shouldUpdateInfo)));
};

export const fetchPreviewBrev = makeRestApiRequest(FpsakApi.PREVIEW_MESSAGE);

/* Reducer */
const initialState = {
  overrideBehandlingspunkter: [],
  selectedBehandlingspunktNavn: undefined,
  resolveProsessAksjonspunkterStarted: false,
  resolveProsessAksjonspunkterSuccess: false,
};

const toggleBehandlingspunkt = (overrideBehandlingspunkter, toggledBehandlingspunkt) => (overrideBehandlingspunkter.includes(toggledBehandlingspunkt)
  ? overrideBehandlingspunkter.filter(bp => bp !== toggledBehandlingspunkt)
  : [...overrideBehandlingspunkter, toggledBehandlingspunkt]);

export const behandlingsprosessReducer = (state = initialState, action = {}) => {
  switch (action.type) { // NOSONAR Switch brukes som standard i reducers
    case SET_SELECTED_BEHANDLINGSPUNKT_NAVN:
      return {
        ...state,
        selectedBehandlingspunktNavn: action.data,
      };
    case TOGGLE_BEHANDLINGSPUNKT_OVERSTYRING: {
      return {
        ...state,
        overrideBehandlingspunkter: toggleBehandlingspunkt(state.overrideBehandlingspunkter, action.data),
      };
    }
    case RESOLVE_PROSESS_AKSJONSPUNKTER_STARTED:
      return {
        ...state,
        resolveProsessAksjonspunkterStarted: true,
        resolveProsessAksjonspunkterSuccess: false,
      };
    case RESOLVE_PROSESS_AKSJONSPUNKTER_SUCCESS:
      return {
        ...state,
        resolveProsessAksjonspunkterStarted: false,
        resolveProsessAksjonspunkterSuccess: true,
      };
    case RESET_BEHANDLINGSPUNKTER:
      return {
        ...initialState,
        selectedBehandlingspunktNavn: state.selectedBehandlingspunktNavn,
      };
    default:
      return state;
  }
};

// Selectors (Kun de knyttet til reducer)
const getBehandlingsprosessContext = state => state.default.behandlingsprosessContext;
export const getSelectedBehandlingspunktNavn = createSelector([getBehandlingsprosessContext], bpCtx => bpCtx.selectedBehandlingspunktNavn);
export const getOverrideBehandlingspunkter = createSelector([getBehandlingsprosessContext], bpCtx => bpCtx.overrideBehandlingspunkter);

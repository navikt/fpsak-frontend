import { createSelector } from 'reselect';

import tilbakekrevingBehandlingApi from 'behandlingTilbakekreving/tilbakekrevingBehandlingApi';
import reducerRegistry from '../../ReducerRegistry';

const reducerName = 'tilbakekrevingBehandlingsprosess';

/* Action types */
const actionType = name => `${reducerName}/${name}`;
export const SET_SELECTED_BEHANDLINGSPUNKT_NAVN = actionType('SET_SELECTED_BEHANDLINGSPUNKT_NAVN');
export const RESET_BEHANDLINGSPUNKTER = actionType('RESET_BEHANDLINGSPUNKTER');
export const RESOLVE_PROSESS_AKSJONSPUNKTER_STARTED = actionType('RESOLVE_PROSESS_AKSJONSPUNKTER_STARTED');
export const RESOLVE_PROSESS_AKSJONSPUNKTER_SUCCESS = actionType('RESOLVE_PROSESS_AKSJONSPUNKTER_SUCCESS');
export const TOGGLE_BEHANDLINGSPUNKT_OVERSTYRING = actionType('TOGGLE_BEHANDLINGSPUNKT_OVERSTYRING');

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

const resolveProsessAksjonspunkterSuccess = (response, behandlingIdentifier, shouldUpdateInfo, updateFagsakInfo) => (dispatch) => {
  dispatch({
    type: RESOLVE_PROSESS_AKSJONSPUNKTER_SUCCESS,
  });
  if (shouldUpdateInfo) {
    return dispatch(updateFagsakInfo(behandlingIdentifier.saksnummer))
      .then(() => dispatch(tilbakekrevingBehandlingApi.BEHANDLING.setDataRestApi()(response.payload, behandlingIdentifier.toJson(), { keepData: true })));
  }
  return true;
};

export const resolveProsessAksjonspunkter = (behandlingIdentifier, params, shouldUpdateInfo, updateFagsakInfo) => (dispatch) => {
  dispatch(resolveProsessAksjonspunkterStarted());
  return dispatch(tilbakekrevingBehandlingApi.SAVE_AKSJONSPUNKT.makeRestApiRequest()(params))
    .then(response => dispatch(resolveProsessAksjonspunkterSuccess(response, behandlingIdentifier, shouldUpdateInfo, updateFagsakInfo)));
};

export const overrideProsessAksjonspunkter = (behandlingIdentifier, params, shouldUpdateInfo, updateFagsakInfo) => (dispatch) => {
  dispatch(resolveProsessAksjonspunkterStarted());
  return dispatch(tilbakekrevingBehandlingApi.SAVE_OVERSTYRT_AKSJONSPUNKT.makeRestApiRequest()(params))
    .then(response => dispatch(resolveProsessAksjonspunkterSuccess(response, behandlingIdentifier, shouldUpdateInfo, updateFagsakInfo)));
};

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

export const tilbakekrevingBehandlingsprosessReducer = (state = initialState, action = {}) => {
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

reducerRegistry.register(reducerName, tilbakekrevingBehandlingsprosessReducer);

// Selectors (Kun de knyttet til reducer)
const getBehandlingsprosessContext = state => state.default[reducerName];
export const getSelectedBehandlingspunktNavn = createSelector([getBehandlingsprosessContext], bpCtx => bpCtx.selectedBehandlingspunktNavn);
export const getOverrideBehandlingspunkter = createSelector([getBehandlingsprosessContext], bpCtx => bpCtx.overrideBehandlingspunkter);

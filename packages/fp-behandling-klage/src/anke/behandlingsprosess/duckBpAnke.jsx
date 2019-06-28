import { createSelector } from 'reselect';

import { sakOperations } from '@fpsak-frontend/fp-behandling-felles';
import { reducerRegistry } from '@fpsak-frontend/fp-felles';
import ankeBehandlingApi from '../data/ankeBehandlingApi';

const reducerName = 'ankeBehandlingsprosess';

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

const resolveProsessAksjonspunkterSuccess = (response, behandlingIdentifier, shouldUpdateInfo) => (dispatch) => {
  dispatch({
    type: RESOLVE_PROSESS_AKSJONSPUNKTER_SUCCESS,
  });
  if (shouldUpdateInfo) {
    return dispatch(sakOperations.updateFagsakInfo(behandlingIdentifier.saksnummer))
      .then(() => dispatch(ankeBehandlingApi.BEHANDLING.setDataRestApi()(response.payload, behandlingIdentifier.toJson(), { keepData: true })));
  }
  return true;
};

export const resolveKlageTemp = (behandlingIdentifier, params) => (dispatch) => {
  dispatch(ankeBehandlingApi.SAVE_REOPEN_ANKE_VURDERING.makeRestApiRequest()(params))
    .then(response => dispatch(ankeBehandlingApi.BEHANDLING.setDataRestApi()(response.payload, behandlingIdentifier.toJson(), { keepData: true })))
    .then(ankeBehandlingApi.SAVE_ANKE_VURDERING.resetRestApi());
};

export const saveKlage = params => dispatch => (
  dispatch(ankeBehandlingApi.SAVE_ANKE_VURDERING.makeRestApiRequest()(params))
);

export const resolveProsessAksjonspunkter = (behandlingIdentifier, params, shouldUpdateInfo) => (dispatch) => {
  dispatch(resolveProsessAksjonspunkterStarted());
  return dispatch(ankeBehandlingApi.SAVE_AKSJONSPUNKT.makeRestApiRequest()(params))
    .then(response => dispatch(resolveProsessAksjonspunkterSuccess(response, behandlingIdentifier, shouldUpdateInfo)));
};

export const overrideProsessAksjonspunkter = (behandlingIdentifier, params, shouldUpdateInfo) => (dispatch) => {
  dispatch(resolveProsessAksjonspunkterStarted());
  return dispatch(ankeBehandlingApi.SAVE_OVERSTYRT_AKSJONSPUNKT.makeRestApiRequest()(params))
    .then(response => dispatch(resolveProsessAksjonspunkterSuccess(response, behandlingIdentifier, shouldUpdateInfo)));
};

export const fetchPreviewBrev = ankeBehandlingApi.PREVIEW_MESSAGE.makeRestApiRequest();

export const fetchPreviewAnkeBrev = ankeBehandlingApi.PREVIEW_MESSAGE_ANKE.makeRestApiRequest();

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

reducerRegistry.register(reducerName, behandlingsprosessReducer);

// Selectors (Kun de knyttet til reducer)
const getBehandlingsprosessContext = state => state.default[reducerName];
export const getSelectedBehandlingspunktNavn = createSelector([getBehandlingsprosessContext], bpCtx => bpCtx.selectedBehandlingspunktNavn);
export const getOverrideBehandlingspunkter = createSelector([getBehandlingsprosessContext], bpCtx => bpCtx.overrideBehandlingspunkter);
export const getResolveProsessAksjonspunkterSuccess = createSelector([getBehandlingsprosessContext], bpCtx => bpCtx.resolveProsessAksjonspunkterSuccess);

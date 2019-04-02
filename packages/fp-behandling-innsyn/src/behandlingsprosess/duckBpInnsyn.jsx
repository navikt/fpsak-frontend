import { createSelector } from 'reselect';

import { sakOperations } from '@fpsak-frontend/fp-behandling-felles';
import { reducerRegistry } from '@fpsak-frontend/fp-felles';
import innsynBehandlingApi from '../data/innsynBehandlingApi';

const reducerName = 'innsynBehandlingsprosess';

/* Action types */
const actionType = name => `${reducerName}/${name}`;
export const SET_SELECTED_BEHANDLINGSPUNKT_NAVN = actionType('SET_SELECTED_BEHANDLINGSPUNKT_NAVN');
export const RESET_BEHANDLINGSPUNKTER = actionType('RESET_BEHANDLINGSPUNKTER');
export const RESOLVE_PROSESS_AKSJONSPUNKTER_STARTED = actionType('RESOLVE_PROSESS_AKSJONSPUNKTER_STARTED');
export const RESOLVE_PROSESS_AKSJONSPUNKTER_SUCCESS = actionType('RESOLVE_PROSESS_AKSJONSPUNKTER_SUCCESS');

export const resetBehandlingspunkter = () => ({
  type: RESET_BEHANDLINGSPUNKTER,
});

export const setSelectedBehandlingspunktNavn = selectedBehandlingspunktNavn => ({
  type: SET_SELECTED_BEHANDLINGSPUNKT_NAVN,
  data: selectedBehandlingspunktNavn,
});

const resolveProsessAksjonspunkterStarted = () => ({
  type: RESOLVE_PROSESS_AKSJONSPUNKTER_STARTED,
});

const resolveProsessAksjonspunkterSuccess = (response, behandlingIdentifier) => (dispatch) => {
  dispatch({
    type: RESOLVE_PROSESS_AKSJONSPUNKTER_SUCCESS,
  });
  return dispatch(sakOperations.updateFagsakInfo(behandlingIdentifier.saksnummer))
    .then(() => dispatch(innsynBehandlingApi.BEHANDLING.setDataRestApi()(response.payload, behandlingIdentifier.toJson(), { keepData: true })));
};

export const resolveProsessAksjonspunkter = (behandlingIdentifier, params) => (dispatch) => {
  dispatch(resolveProsessAksjonspunkterStarted());
  return dispatch(innsynBehandlingApi.SAVE_AKSJONSPUNKT.makeRestApiRequest()(params))
    .then(response => dispatch(resolveProsessAksjonspunkterSuccess(response, behandlingIdentifier)));
};

export const fetchPreviewBrev = innsynBehandlingApi.PREVIEW_MESSAGE.makeRestApiRequest();

/* Reducer */
const initialState = {
  selectedBehandlingspunktNavn: undefined,
  resolveProsessAksjonspunkterStarted: false,
  resolveProsessAksjonspunkterSuccess: false,
};

export const behandlingsprosessReducer = (state = initialState, action = {}) => {
  switch (action.type) { // NOSONAR Switch brukes som standard i reducers
    case SET_SELECTED_BEHANDLINGSPUNKT_NAVN:
      return {
        ...state,
        selectedBehandlingspunktNavn: action.data,
      };
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
export const getResolveProsessAksjonspunkterSuccess = createSelector([getBehandlingsprosessContext], bpCtx => bpCtx.resolveProsessAksjonspunkterSuccess);

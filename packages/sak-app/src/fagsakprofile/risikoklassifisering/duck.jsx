import { sakOperations } from '@fpsak-frontend/fp-behandling-felles';
import { reducerRegistry } from '@fpsak-frontend/fp-felles';

import fpsakApi from '../../data/fpsakApi';

const reducerName = 'kontrollresultat';

/* Action types */
const actionType = (name) => `${reducerName}/${name}`;
const RESOLVE_KONTROLLRESULTAT_AKSJONSPUNKTER_STARTED = actionType('RESOLVE_KONTROLLRESULTAT_AKSJONSPUNKTER_STARTED');
const RESOLVE_KONTROLLRESULTAT_AKSJONSPUNKTER_SUCCESS = actionType('RESOLVE_KONTROLLRESULTAT_AKSJONSPUNKTER_SUCCESS');
const SET_RISK_PANEL_OPEN = actionType('SET_RISK_PANEL_OPEN');

/* Action creators */
export const setRiskPanelOpen = (isOpen) => ({
  type: SET_RISK_PANEL_OPEN,
  data: isOpen,
});

const resolveAksjonspunktStarted = () => ({
  type: RESOLVE_KONTROLLRESULTAT_AKSJONSPUNKTER_STARTED, // Bedre navn for denne?
});

export const hentKontrollresultat = (params) => (dispatch) => dispatch(fpsakApi.KONTROLLRESULTAT.makeRestApiRequest()(params));

const resolveAksjonspunktSuccess = (response, behandlingIdentifier) => (dispatch) => {
  dispatch({
    type: RESOLVE_KONTROLLRESULTAT_AKSJONSPUNKTER_SUCCESS,
  });
  return dispatch(sakOperations.updateFagsakInfo(behandlingIdentifier.saksnummer))
    .then(() => dispatch(fpsakApi.BEHANDLING.setDataRestApi()(response.payload, behandlingIdentifier.toJson(), { keepData: true })));
};

export const resolveAksjonspunkter = (params, behandlingIdentifier) => (dispatch) => {
  dispatch(resolveAksjonspunktStarted());
  return dispatch(fpsakApi.SAVE_AKSJONSPUNKT.makeRestApiRequest()(params))
    .then((response) => dispatch(resolveAksjonspunktSuccess(response, behandlingIdentifier)));
};

/* Reducer */
const initialState = {
  isRiskPanelOpen: false,
  resolveKontrollresultatAksjonspunkerStarted: false,
  resolveKontrollresultatAksjonspunkterSuccess: false,
};

export const kontrollresultatReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case RESOLVE_KONTROLLRESULTAT_AKSJONSPUNKTER_STARTED:
      return {
        ...state,
        resolveKontrollresultatAksjonspunkerStarted: true,
        resolveKontrollresultatAksjonspunkterSuccess: false,
      };
    case RESOLVE_KONTROLLRESULTAT_AKSJONSPUNKTER_SUCCESS:
      return {
        ...state,
        resolveKontrollresultatAksjonspunkerStarted: false,
        resolveKontrollresultatAksjonspunkterSuccess: true,
      };
    case SET_RISK_PANEL_OPEN: {
      return {
        ...state,
        isRiskPanelOpen: action.data,
      };
    }
    default:
      return state;
  }
};

reducerRegistry.register(reducerName, kontrollresultatReducer);

// Selectors (Kun tilknyttet reducer)
const getKontrollresultatContext = (state) => state.default[reducerName];
export const isRiskPanelOpen = (state) => getKontrollresultatContext(state).isRiskPanelOpen;

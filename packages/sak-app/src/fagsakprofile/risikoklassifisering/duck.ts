import { reducerRegistry } from '@fpsak-frontend/rest-api-redux';

import behandlingEventHandler from '../../behandling/BehandlingEventHandler';

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

export const resolveAksjonspunkter = (params) => (dispatch) => {
  dispatch({ type: RESOLVE_KONTROLLRESULTAT_AKSJONSPUNKTER_STARTED });
  return behandlingEventHandler.lagreRisikoklassifiseringAksjonspunkt(params)
    .then(() => dispatch({ type: RESOLVE_KONTROLLRESULTAT_AKSJONSPUNKTER_SUCCESS }));
};

/* Reducer */
const initialState = {
  isRiskPanelOpen: false,
  resolveKontrollresultatAksjonspunkerStarted: false,
  resolveKontrollresultatAksjonspunkterSuccess: false,
};

interface Action {
  type: string;
  data?: boolean;
}

export const kontrollresultatReducer = (state = initialState, action: Action = { type: '' }) => {
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

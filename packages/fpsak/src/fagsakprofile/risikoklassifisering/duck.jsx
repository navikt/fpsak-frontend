import { sakOperations } from '@fpsak-frontend/fp-behandling-felles';

import fpsakApi from '../../data/fpsakApi';

export const getKontrollresultat = params => dispatch => dispatch(fpsakApi.KONTROLLRESULTAT.makeRestApiRequest()(params));

const reducerName = 'kontrollresultat';

const actionType = name => `${reducerName}/${name}`;

export const RESOLVE_KONTROLLRESULTAT_AKSJONSPUNKTER_STARTED = actionType('RESOLVE_KONTROLLRESULTAT_AKSJONSPUNKTER_STARTED');
export const RESOLVE_KONTROLLRESULTAT_AKSJONSPUNKTER_SUCCESS = actionType('RESOLVE_KONTROLLRESULTAT_AKSJONSPUNKTER_SUCCESS');

const resolveFaktaAksjonspunkterStarted = () => ({
  type: RESOLVE_KONTROLLRESULTAT_AKSJONSPUNKTER_STARTED, // Bedre navn for denne?
});

const resolveFaktaAksjonspunkterSuccess = (response, behandlingIdentifier) => (dispatch) => {
  dispatch({
    type: RESOLVE_KONTROLLRESULTAT_AKSJONSPUNKTER_SUCCESS,
  });
  return dispatch(sakOperations.updateFagsakInfo(behandlingIdentifier.saksnummer))
    .then(() => dispatch(fpsakApi.BEHANDLING.setDataRestApi()(response.payload, behandlingIdentifier.toJson(), { keepData: true })));
};

export const resolveAksjonspunkter = (params, behandlingIdentifier) => (dispatch) => {
  dispatch(resolveFaktaAksjonspunkterStarted());
  return dispatch(fpsakApi.SAVE_AKSJONSPUNKT.makeRestApiRequest()(params))
    .then(response => dispatch(resolveFaktaAksjonspunkterSuccess(response, behandlingIdentifier)));
};

/* Reducer */
// Hvor mye trengs egentlig her?
const initialState = {
  openInfoPanels: [],
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
      default:
        return state;
  }
};

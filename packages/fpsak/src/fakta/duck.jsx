import { makeRestApiRequest, setDataRestApi } from '@fpsak-frontend/data/duck';
import { FpsakApi } from '@fpsak-frontend/data/fpsakApi';
import { createSelector } from 'reselect';
import { updateFagsakInfo } from 'fagsak/duck';

/* Action types */
export const SET_OPEN_INFO_PANELS = 'SET_OPEN_INFO_PANELS';
export const RESET_FAKTA = 'RESET_FAKTA';
export const RESOLVE_FAKTA_AKSJONSPUNKTER_STARTED = 'RESOLVE_FAKTA_AKSJONSPUNKTER_STARTED';
export const RESOLVE_FAKTA_AKSJONSPUNKTER_SUCCESS = 'RESOLVE_FAKTA_AKSJONSPUNKTER_SUCCESS';


/* Action creators */
export const setOpenInfoPanels = openInfoPanels => ({
  type: SET_OPEN_INFO_PANELS,
  data: openInfoPanels,
});

export const resetFakta = () => ({
  type: RESET_FAKTA,
});

const resolveFaktaAksjonspunkterStarted = () => ({
  type: RESOLVE_FAKTA_AKSJONSPUNKTER_STARTED,
});

const resolveFaktaAksjonspunkterSuccess = (response, behandlingIdentifier) => (dispatch) => {
  dispatch({
    type: RESOLVE_FAKTA_AKSJONSPUNKTER_SUCCESS,
  });
  return dispatch(updateFagsakInfo(behandlingIdentifier.saksnummer))
    .then(() => dispatch(setDataRestApi(FpsakApi.BEHANDLING)(response.payload, behandlingIdentifier.toJson(), { keepData: true })));
};

export const resolveFaktaAksjonspunkter = (params, behandlingIdentifier) => (dispatch) => {
  dispatch(resolveFaktaAksjonspunkterStarted());
  return dispatch(makeRestApiRequest(FpsakApi.SAVE_AKSJONSPUNKT)(params))
    .then(response => dispatch(resolveFaktaAksjonspunkterSuccess(response, behandlingIdentifier)));
};

/* Reducer */
const initialState = {
  openInfoPanels: [],
  resolveFaktaAksjonspunkterStarted: false,
  resolveFaktaAksjonspunkterSuccess: false,
};

export const faktaReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case SET_OPEN_INFO_PANELS:
      return {
        ...state,
        openInfoPanels: action.data,
      };
    case RESOLVE_FAKTA_AKSJONSPUNKTER_STARTED:
      return {
        ...state,
        resolveFaktaAksjonspunkterStarted: true,
        resolveFaktaAksjonspunkterSuccess: false,
      };
    case RESOLVE_FAKTA_AKSJONSPUNKTER_SUCCESS:
      return {
        ...state,
        resolveFaktaAksjonspunkterStarted: false,
        resolveFaktaAksjonspunkterSuccess: true,
      };
    case RESET_FAKTA:
      return initialState;
    default:
      return state;
  }
};

/* Selectors */
const getFaktaContext = state => state.default.faktaContext;
export const getOpenInfoPanels = createSelector([getFaktaContext], ctx => ctx.openInfoPanels);

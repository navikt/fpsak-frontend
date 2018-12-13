import tilbakekrevingBehandlingApi from 'behandlingTilbakekreving/tilbakekrevingBehandlingApi';
import { createSelector } from 'reselect';

import reducerRegistry from '../../ReducerRegistry';

const reducerName = 'tilbakekrevingFakta';

/* Action types */
const actionType = name => `${reducerName}/${name}`;
export const SET_OPEN_INFO_PANELS = actionType('SET_OPEN_INFO_PANELS');
export const RESET_FAKTA = actionType('RESET_FAKTA');
export const RESOLVE_FAKTA_AKSJONSPUNKTER_STARTED = actionType('RESOLVE_FAKTA_AKSJONSPUNKTER_STARTED');
export const RESOLVE_FAKTA_AKSJONSPUNKTER_SUCCESS = actionType('RESOLVE_FAKTA_AKSJONSPUNKTER_SUCCESS');


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

const resolveFaktaAksjonspunkterSuccess = (response, behandlingIdentifier, updateFagsakInfo) => (dispatch) => {
  dispatch({
    type: RESOLVE_FAKTA_AKSJONSPUNKTER_SUCCESS,
  });
  return dispatch(updateFagsakInfo(behandlingIdentifier.saksnummer))
    .then(() => dispatch(tilbakekrevingBehandlingApi.BEHANDLING.setDataRestApi()(response.payload, behandlingIdentifier.toJson(), { keepData: true })));
};

export const resolveFaktaAksjonspunkter = (params, behandlingIdentifier, updateFagsakInfo) => (dispatch) => {
  dispatch(resolveFaktaAksjonspunkterStarted());
  return dispatch(tilbakekrevingBehandlingApi.SAVE_AKSJONSPUNKT.makeRestApiRequest()(params))
    .then(response => dispatch(resolveFaktaAksjonspunkterSuccess(response, behandlingIdentifier, updateFagsakInfo)));
};

export const resolveFaktaOverstyrAksjonspunkter = (params, behandlingIdentifier, updateFagsakInfo) => (dispatch) => {
  dispatch(resolveFaktaAksjonspunkterStarted());
  return dispatch(tilbakekrevingBehandlingApi.SAVE_OVERSTYRT_AKSJONSPUNKT.makeRestApiRequest()(params))
    .then(response => dispatch(resolveFaktaAksjonspunkterSuccess(response, behandlingIdentifier, updateFagsakInfo)));
};

/* Reducer */
const initialState = {
  openInfoPanels: [],
  resolveFaktaAksjonspunkterStarted: false,
  resolveFaktaAksjonspunkterSuccess: false,
};

export const tilbakekrevingFaktaReducer = (state = initialState, action = {}) => {
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

reducerRegistry.register(reducerName, tilbakekrevingFaktaReducer);

/* Selectors */
const getFaktaContext = state => state.default[reducerName];
export const getOpenInfoPanels = createSelector([getFaktaContext], ctx => ctx.openInfoPanels);

import { createSelector } from 'reselect';

/* Reducer */
const getFaktaReducer = (initialState, actionTypes) => (state = initialState, action = {}) => {
  switch (action.type) {
    case actionTypes.SET_OPEN_INFO_PANELS:
      return {
        ...state,
        openInfoPanels: action.data,
      };
    case actionTypes.RESOLVE_FAKTA_AKSJONSPUNKTER_STARTED:
      return {
        ...state,
        resolveFaktaAksjonspunkterStarted: true,
        resolveFaktaAksjonspunkterSuccess: false,
      };
    case actionTypes.RESOLVE_FAKTA_AKSJONSPUNKTER_SUCCESS:
      return {
        ...state,
        resolveFaktaAksjonspunkterStarted: false,
        resolveFaktaAksjonspunkterSuccess: true,
      };
    case actionTypes.RESET_FAKTA:
      return initialState;
    default:
      return state;
  }
};

const getFaktaRedux = (reducerName) => {
  const actionType = (name) => `${reducerName}/${name}`;
  const actionTypes = {
    SET_OPEN_INFO_PANELS: actionType('SET_OPEN_INFO_PANELS'),
    RESET_FAKTA: actionType('RESET_FAKTA'),
    RESOLVE_FAKTA_AKSJONSPUNKTER_STARTED: actionType('RESOLVE_FAKTA_AKSJONSPUNKTER_STARTED'),
    RESOLVE_FAKTA_AKSJONSPUNKTER_SUCCESS: actionType('RESOLVE_FAKTA_AKSJONSPUNKTER_SUCCESS'),
  };

  const actionCreators = {
    setOpenInfoPanels: (openInfoPanels) => ({
      type: actionTypes.SET_OPEN_INFO_PANELS,
      data: openInfoPanels,
    }),
    resetFakta: () => ({
      type: actionTypes.RESET_FAKTA,
    }),
    resolveFaktaAksjonspunkterStarted: () => ({
      type: actionTypes.RESOLVE_FAKTA_AKSJONSPUNKTER_STARTED,
    }),
    resolveFaktaAksjonspunkterSuccess: () => ({
      type: actionTypes.RESOLVE_FAKTA_AKSJONSPUNKTER_SUCCESS,
    }),
  };

  const initialState = {
    openInfoPanels: [],
    resolveFaktaAksjonspunkterStarted: false,
    resolveFaktaAksjonspunkterSuccess: false,
  };

  /* Selectors */
  const getFaktaContext = (state) => state.default[reducerName];
  const selectors = {
    getOpenInfoPanels: createSelector([getFaktaContext], (ctx) => ctx.openInfoPanels),
    getResolveFaktaAksjonspunkterSuccess: createSelector([getFaktaContext], (ctx) => ctx.resolveFaktaAksjonspunkterSuccess),
  };

  return {
    actionTypes,
    actionCreators,
    reducer: getFaktaReducer(initialState, actionTypes),
    selectors,
  };
};

export default getFaktaRedux;

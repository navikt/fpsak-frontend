import { createSelector } from 'reselect';

const toggleBehandlingspunkt = (overrideBehandlingspunkter, toggledBehandlingspunkt) => (overrideBehandlingspunkter.includes(toggledBehandlingspunkt)
  ? overrideBehandlingspunkter.filter((bp) => bp !== toggledBehandlingspunkt)
  : [...overrideBehandlingspunkter, toggledBehandlingspunkt]);

const getBehandlingsprosessReducer = (initialState, actionTypes) => (state = initialState, action = {}) => {
  switch (action.type) { // NOSONAR Switch brukes som standard i reducers
    case actionTypes.SET_SELECTED_BEHANDLINGSPUNKT_NAVN:
      return {
        ...state,
        selectedBehandlingspunktNavn: action.data,
      };
    case actionTypes.TOGGLE_BEHANDLINGSPUNKT_OVERSTYRING: {
      return {
        ...state,
        overrideBehandlingspunkter: toggleBehandlingspunkt(state.overrideBehandlingspunkter, action.data),
      };
    }
    case actionTypes.RESOLVE_PROSESS_AKSJONSPUNKTER_STARTED:
      return {
        ...state,
        resolveProsessAksjonspunkterStarted: true,
        resolveProsessAksjonspunkterSuccess: false,
      };
    case actionTypes.RESOLVE_PROSESS_AKSJONSPUNKTER_SUCCESS:
      return {
        ...state,
        resolveProsessAksjonspunkterStarted: false,
        resolveProsessAksjonspunkterSuccess: true,
      };
    case actionTypes.RESET_BEHANDLINGSPUNKTER:
      return {
        ...initialState,
        selectedBehandlingspunktNavn: state.selectedBehandlingspunktNavn,
      };
    default:
      return state;
  }
};

const getBehandlingsprosessRedux = (reducerName) => {
  const actionType = (name) => `${reducerName}/${name}`;
  const actionTypes = {
    SET_SELECTED_BEHANDLINGSPUNKT_NAVN: actionType('SET_SELECTED_BEHANDLINGSPUNKT_NAVN'),
    RESET_BEHANDLINGSPUNKTER: actionType('RESET_BEHANDLINGSPUNKTER'),
    RESOLVE_PROSESS_AKSJONSPUNKTER_STARTED: actionType('RESOLVE_PROSESS_AKSJONSPUNKTER_STARTED'),
    RESOLVE_PROSESS_AKSJONSPUNKTER_SUCCESS: actionType('RESOLVE_PROSESS_AKSJONSPUNKTER_SUCCESS'),
    TOGGLE_BEHANDLINGSPUNKT_OVERSTYRING: actionType('TOGGLE_BEHANDLINGSPUNKT_OVERSTYRING'),
  };

  const actionCreators = {
    resetBehandlingspunkter: () => ({
      type: actionTypes.RESET_BEHANDLINGSPUNKTER,
    }),
    setSelectedBehandlingspunktNavn: (selectedBehandlingspunktNavn) => ({
      type: actionTypes.SET_SELECTED_BEHANDLINGSPUNKT_NAVN,
      data: selectedBehandlingspunktNavn,
    }),
    toggleBehandlingspunktOverstyring: (behandlingspunkt) => ({
      type: actionTypes.TOGGLE_BEHANDLINGSPUNKT_OVERSTYRING,
      data: behandlingspunkt,
    }),
    resolveProsessAksjonspunkterStarted: () => ({
      type: actionTypes.RESOLVE_PROSESS_AKSJONSPUNKTER_STARTED,
    }),
    resolveProsessAksjonspunkterSuccess: () => ({
      type: actionTypes.RESOLVE_PROSESS_AKSJONSPUNKTER_SUCCESS,
    }),
  };

  const initialState = {
    overrideBehandlingspunkter: [],
    selectedBehandlingspunktNavn: undefined,
    resolveProsessAksjonspunkterStarted: false,
    resolveProsessAksjonspunkterSuccess: false,
  };

  const getBehandlingsprosessContext = (state) => state.default[reducerName];
  const selectors = {
    getSelectedBehandlingspunktNavn: createSelector([getBehandlingsprosessContext], (bpCtx) => bpCtx.selectedBehandlingspunktNavn),
    getOverrideBehandlingspunkter: createSelector([getBehandlingsprosessContext], (bpCtx) => bpCtx.overrideBehandlingspunkter),
    getResolveProsessAksjonspunkterSuccess: createSelector([getBehandlingsprosessContext], (bpCtx) => bpCtx.resolveProsessAksjonspunkterSuccess),
  };

  return {
    actionTypes,
    actionCreators,
    reducer: getBehandlingsprosessReducer(initialState, actionTypes),
    selectors,
  };
};

export default getBehandlingsprosessRedux;

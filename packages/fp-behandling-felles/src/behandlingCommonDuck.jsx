import { createSelector } from 'reselect';

import { BehandlingIdentifier } from '@fpsak-frontend/fp-felles';
import sakOperations from './SakOperations';

// TODO (TOR) Rydd opp i dette. Kan ein legge rehenting av fagsakInfo i resolver i staden?
const getUpdateBehandling = behandlingApi => (
  behandlingIdentifier, behandlingerVersjonMappedById,
) => dispatch => dispatch(behandlingApi.BEHANDLING.makeRestApiRequest()(behandlingIdentifier.toJson(), { keepData: true }))
  .then((response) => {
    if (behandlingerVersjonMappedById && behandlingerVersjonMappedById[response.payload.id] !== response.payload.versjon) {
      dispatch(sakOperations.updateFagsakInfo(behandlingIdentifier.saksnummer));
    }
    return Promise.resolve(response);
  });

const getResetBehandling = (behandlingApi, resetBehandlingContext) => dispatch => Promise.all([
  dispatch(behandlingApi.BEHANDLING.resetRestApi()()),
  dispatch(resetBehandlingContext()),
]);

const getFetchBehandling = (behandlingApi, updateBehandling) => (behandlingIdentifier, allBehandlinger) => (dispatch) => {
  dispatch(behandlingApi.BEHANDLING.resetRestApi()());
  dispatch(updateBehandling(behandlingIdentifier, allBehandlinger));
};

const getUpdateFagsakAndBehandling = updateBehandling => behandlingIdentifier => dispatch => dispatch(
  sakOperations.updateFagsakInfo(behandlingIdentifier.saksnummer),
).then(() => dispatch(updateBehandling(behandlingIdentifier)));

const getUpdateOnHold = (behandlingApi, updateFagsakAndBehandling) => (
  params, behandlingIdentifier,
) => dispatch => dispatch(behandlingApi.UPDATE_ON_HOLD.makeRestApiRequest()(params))
  .then(() => dispatch(updateFagsakAndBehandling(behandlingIdentifier)));

const getResetBehandlingFpsakContext = (behandlingApi, behandlingApiKeys, resetBehandlingContext) => () => (dispatch) => {
  Object.values(behandlingApiKeys)
    .forEach((value) => {
      dispatch(behandlingApi[value].resetRestApi()());
    });
  dispatch(resetBehandlingContext());
};

/* Reducer */
const getBehandlingReducer = (initialState, actionTypes) => (state = initialState, action = {}) => {
  switch (action.type) {
    case actionTypes.SET_BEHANDLING_INFO:
      return {
        ...initialState,
        ...action.data,
      };
    case actionTypes.HAS_SHOWN_BEHANDLING_PA_VENT:
      return {
        ...state,
        hasShownBehandlingPaVent: true,
      };
    case actionTypes.RESET_FPSAK_BEHANDLING:
      return initialState;
    default:
      return state;
  }
};

const getBehandlingRedux = (reducerName, behandlingApi, behandlingApiKeys, additionalInitalState = {}) => {
  const actionType = name => `${reducerName}/${name}`;
  const actionTypes = {
    SET_BEHANDLING_INFO: actionType('SET_BEHANDLING_INFO'),
    HAS_SHOWN_BEHANDLING_PA_VENT: actionType('HAS_SHOWN_BEHANDLING_PA_VENT'),
    RESET_FPSAK_BEHANDLING: actionType('RESET_FPSAK_BEHANDLING'),
  };

  const resetBehandlingContext = () => ({
    type: actionTypes.RESET_FPSAK_BEHANDLING,
  });
  const updateBehandling = getUpdateBehandling(behandlingApi);
  const updateFagsakAndBehandling = getUpdateFagsakAndBehandling(updateBehandling);
  const actionCreators = {
    resetBehandlingContext,
    updateBehandling,
    updateFagsakAndBehandling,
    setBehandlingInfo: info => ({
      type: actionTypes.SET_BEHANDLING_INFO,
      data: info,
    }),
    setHasShownBehandlingPaVent: () => ({
      type: actionTypes.HAS_SHOWN_BEHANDLING_PA_VENT,
    }),
    resetBehandling: getResetBehandling(behandlingApi, resetBehandlingContext),
    fetchBehandling: getFetchBehandling(behandlingApi, updateBehandling),
    updateOnHold: getUpdateOnHold(behandlingApi, updateFagsakAndBehandling),
    resetBehandlingFpsakContext: getResetBehandlingFpsakContext(behandlingApi, behandlingApiKeys, resetBehandlingContext),
  };

  const initialState = {
    behandlingId: undefined,
    fagsakSaksnummer: undefined,
    featureToggles: {},
    kodeverk: {},
    fagsak: {},
    hasShownBehandlingPaVent: false,
    ...additionalInitalState,
  };

  /* Selectors */
  const getBehandlingContext = state => state.default[reducerName];
  const getSelectedBehandlingId = createSelector([getBehandlingContext], behandlingContext => behandlingContext.behandlingId);
  const getSelectedSaksnummer = createSelector([getBehandlingContext], behandlingContext => behandlingContext.fagsakSaksnummer);
  const selectors = {
    getBehandlingContext,
    getSelectedBehandlingId,
    getSelectedSaksnummer,
    getBehandlingIdentifier: createSelector(
      [getSelectedBehandlingId, getSelectedSaksnummer],
      (behandlingId, saksnummer) => (behandlingId ? new BehandlingIdentifier(saksnummer, behandlingId) : undefined),
    ),
    getFagsakStatus: createSelector([getBehandlingContext], behandlingContext => behandlingContext.fagsak.fagsakStatus),
    getFagsakPerson: createSelector([getBehandlingContext], behandlingContext => behandlingContext.fagsak.fagsakPerson),
    getFagsakYtelseType: createSelector([getBehandlingContext], behandlingContext => behandlingContext.fagsak.fagsakYtelseType),
    isForeldrepengerFagsak: createSelector([getBehandlingContext], behandlingContext => behandlingContext.fagsak.isForeldrepengerFagsak),
    getKodeverk: kodeverkType => createSelector(
      [getBehandlingContext], behandlingContext => behandlingContext.kodeverk[kodeverkType],
    ),
    getAlleKodeverk: createSelector(
      [getBehandlingContext], behandlingContext => behandlingContext.kodeverk,
    ),
    getFeatureToggles: createSelector([getBehandlingContext], behandlingContext => behandlingContext.featureToggles),
    getHasShownBehandlingPaVent: createSelector([getBehandlingContext], behandlingContext => behandlingContext.hasShownBehandlingPaVent),
  };

  return {
    actionTypes,
    actionCreators,
    reducer: getBehandlingReducer(initialState, actionTypes),
    selectors,
  };
};

export default getBehandlingRedux;

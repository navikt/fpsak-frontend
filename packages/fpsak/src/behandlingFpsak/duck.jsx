import { createSelector } from 'reselect';

import BehandlingIdentifier from 'behandlingFelles/BehandlingIdentifier';
import { updateFagsakInfo } from 'fagsak/duck';
import fpsakBehandlingApi from './data/fpsakBehandlingApi';
import reducerRegistry from '../ReducerRegistry';

const reducerName = 'fpsakBehandling';

/* Action types */
const actionType = name => `${reducerName}/${name}`;
const SET_BEHANDLING_INFO = actionType('SET_BEHANDLING_INFO');
const HAS_SHOWN_BEHANDLING_PA_VENT = actionType('HAS_SHOWN_BEHANDLING_PA_VENT');

export const setBehandlingInfo = info => ({
  type: SET_BEHANDLING_INFO,
  data: info,
});

export const setHasShownBehandlingPaVent = () => ({
  type: HAS_SHOWN_BEHANDLING_PA_VENT,
});

// TODO (TOR) Rydd opp i dette. Kan ein legge rehenting av fagsakInfo og original-behandling i resolver i staden?
export const updateBehandling = (
  behandlingIdentifier, behandlingerVersjonMappedById,
) => dispatch => dispatch(fpsakBehandlingApi.BEHANDLING.makeRestApiRequest()(behandlingIdentifier.toJson(), { keepData: true }))
  .then((response) => {
    if (behandlingerVersjonMappedById && behandlingerVersjonMappedById[response.payload.id] !== response.payload.versjon) {
      dispatch(updateFagsakInfo(behandlingIdentifier.saksnummer));
    }
    return Promise.resolve(response);
  })
  .then((response) => {
    if (response.payload && response.payload.originalBehandlingId) {
      const { originalBehandlingId } = response.payload;
      const origianalBehandlingRequestParams = new BehandlingIdentifier(behandlingIdentifier.saksnummer, originalBehandlingId);
      return dispatch(fpsakBehandlingApi.ORIGINAL_BEHANDLING.makeRestApiRequest()(origianalBehandlingRequestParams.toJson(), { keepData: true }));
    }
    return Promise.resolve(response);
  });

export const resetBehandling = dispatch => Promise.all([
  dispatch(fpsakBehandlingApi.BEHANDLING.resetRestApi()()),
  dispatch(fpsakBehandlingApi.ORIGINAL_BEHANDLING.resetRestApi()()),
]);

export const fetchBehandling = (behandlingIdentifier, allBehandlinger) => (dispatch) => {
  resetBehandling(dispatch);
  dispatch(updateBehandling(behandlingIdentifier, allBehandlinger));
};

const updateFagsakAndBehandling = behandlingIdentifier => dispatch => dispatch(updateFagsakInfo(behandlingIdentifier.saksnummer))
  .then(() => dispatch(updateBehandling(behandlingIdentifier)));

export const updateOnHold = (params, behandlingIdentifier) => dispatch => dispatch(fpsakBehandlingApi.UPDATE_ON_HOLD.makeRestApiRequest()(params))
  .then(() => dispatch(updateFagsakAndBehandling(behandlingIdentifier)));

/* Reducer */
const initialState = {
  behandlingId: undefined,
  fagsakSaksnummer: undefined,
  hasShownBehandlingPaVent: false,
};

export const fpsakBehandlingReducer = (state = initialState, action = {}) => { // NOSONAR Switch brukes som standard i reducers
  switch (action.type) {
    case SET_BEHANDLING_INFO:
      return {
        ...initialState,
        ...action.data,
      };
    case HAS_SHOWN_BEHANDLING_PA_VENT:
      return {
        ...state,
        hasShownBehandlingPaVent: true,
      };
    default:
      return state;
  }
};

reducerRegistry.register(reducerName, fpsakBehandlingReducer);

// Selectors (Kun de knyttet til reducer)
const getBehandlingContext = state => state.default[reducerName];
export const getSelectedBehandlingId = createSelector([getBehandlingContext], behandlingContext => behandlingContext.behandlingId);
export const getSelectedSaksnummer = createSelector([getBehandlingContext], behandlingContext => behandlingContext.fagsakSaksnummer);
export const getBehandlingIdentifier = createSelector(
  [getSelectedBehandlingId, getSelectedSaksnummer],
  (behandlingId, saksnummer) => (behandlingId ? new BehandlingIdentifier(saksnummer, behandlingId) : undefined
  ),
);

export const getHasShownBehandlingPaVent = createSelector([getBehandlingContext], behandlingContext => behandlingContext.hasShownBehandlingPaVent);

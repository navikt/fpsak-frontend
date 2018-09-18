import { createSelector } from 'reselect';

import BehandlingIdentifier from 'behandling/BehandlingIdentifier';
import { makeRestApiRequest, resetRestApi } from 'data/duck';
import { updateFagsakInfo } from 'fagsak/duck';
import { FpsakApi } from 'data/fpsakApi';

/* Action types */
const SET_BEHANDLING_ID = 'SET_BEHANDLING_ID';
const HAS_SHOWN_BEHANDLING_PA_VENT = 'HAS_SHOWN_BEHANDLING_PA_VENT';

export const setSelectedBehandlingId = behandlingId => ({
  type: SET_BEHANDLING_ID,
  data: behandlingId,
});

export const setHasShownBehandlingPaVent = () => ({
  type: HAS_SHOWN_BEHANDLING_PA_VENT,
});

// TODO (TOR) Rydd opp i dette. Kan ein legge rehenting av fagsakInfo og original-behandling i resolver i staden?
export const updateBehandling = (
  behandlingIdentifier, behandlingerVersjonMappedById,
) => dispatch => dispatch(makeRestApiRequest(FpsakApi.BEHANDLING)(behandlingIdentifier.toJson(), { keepData: true }))
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
      return dispatch(makeRestApiRequest(FpsakApi.ORIGINAL_BEHANDLING)(origianalBehandlingRequestParams.toJson(), { keepData: true }));
    }
    return Promise.resolve(response);
  });

export const resetBehandling = dispatch => Promise.all([
  dispatch(resetRestApi(FpsakApi.BEHANDLING)()),
  dispatch(resetRestApi(FpsakApi.ORIGINAL_BEHANDLING)()),
]);

export const fetchBehandling = (behandlingIdentifier, allBehandlinger) => (dispatch) => {
  resetBehandling(dispatch);
  dispatch(updateBehandling(behandlingIdentifier, allBehandlinger));
};

const updateFagsakAndBehandling = behandlingIdentifier => dispatch => dispatch(updateFagsakInfo(behandlingIdentifier.saksnummer))
  .then(() => dispatch(updateBehandling(behandlingIdentifier)));

export const updateOnHold = (params, behandlingIdentifier) => dispatch => dispatch(makeRestApiRequest(FpsakApi.UPDATE_ON_HOLD)(params))
  .then(() => dispatch(updateFagsakAndBehandling(behandlingIdentifier)));

/* Reducer */
const initialState = {
  behandlingId: undefined,
  hasShownBehandlingPaVent: false,
};

export const behandlingReducer = (state = initialState, action = {}) => { // NOSONAR Switch brukes som standard i reducers
  switch (action.type) {
    case SET_BEHANDLING_ID:
      return {
        ...initialState,
        behandlingId: action.data,
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

// Selectors (Kun de knyttet til reducer)
const getBehandlingContext = state => state.default.behandlingContext;

export const getSelectedBehandlingId = createSelector([getBehandlingContext], behandlingContext => behandlingContext.behandlingId);

export const getHasShownBehandlingPaVent = createSelector([getBehandlingContext], behandlingContext => behandlingContext.hasShownBehandlingPaVent);

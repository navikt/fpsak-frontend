import { createSelector } from 'reselect';

import { reducerRegistry, BehandlingIdentifier } from '@fpsak-frontend/fp-felles';
import tilbakekrevingBehandlingApi, { TilbakekrevingBehandlingApiKeys } from './data/tilbakekrevingBehandlingApi';

const reducerName = 'tilbakekrevingBehandling';

/* Action types */
const actionType = name => `${reducerName}/${name}`;
const SET_BEHANDLING_INFO = actionType('SET_BEHANDLING_INFO');
const HAS_SHOWN_BEHANDLING_PA_VENT = actionType('HAS_SHOWN_BEHANDLING_PA_VENT');
const RESET_FPTILBAKE_BEHANDLING = actionType('RESET_FPTILBAKE_BEHANDLING');

export const setBehandlingInfo = info => ({
  type: SET_BEHANDLING_INFO,
  data: info,
});

export const setHasShownBehandlingPaVent = () => ({
  type: HAS_SHOWN_BEHANDLING_PA_VENT,
});

const resetBehandlingContext = () => ({
  type: RESET_FPTILBAKE_BEHANDLING,
});


// TODO (TOR) Rydd opp i dette. Kan ein legge rehenting av fagsakInfo og original-behandling i resolver i staden?
export const updateBehandling = (
  behandlingIdentifier, behandlingerVersjonMappedById, updateFagsakInfo,
) => dispatch => dispatch(tilbakekrevingBehandlingApi.BEHANDLING.makeRestApiRequest()(behandlingIdentifier.toJson(), { keepData: true }))
  .then((response) => {
    if (behandlingerVersjonMappedById && behandlingerVersjonMappedById[response.payload.id] !== response.payload.versjon) {
      dispatch(updateFagsakInfo(behandlingIdentifier.saksnummer));
    }
    return Promise.resolve(response);
  });

export const resetBehandling = dispatch => Promise.all([
  dispatch(tilbakekrevingBehandlingApi.BEHANDLING.resetRestApi()()),
  dispatch(resetBehandlingContext()),
]);

export const fetchBehandling = (behandlingIdentifier, allBehandlinger, updateFagsakInfo) => (dispatch) => {
  dispatch(tilbakekrevingBehandlingApi.KODEVERK.makeRestApiRequest()());
  dispatch(tilbakekrevingBehandlingApi.BEHANDLING.resetRestApi()());
  dispatch(updateBehandling(behandlingIdentifier, allBehandlinger, updateFagsakInfo));
};

const updateFagsakAndBehandling = (behandlingIdentifier, updateFagsakInfo) => dispatch => dispatch(updateFagsakInfo(behandlingIdentifier.saksnummer))
  .then(() => dispatch(updateBehandling(behandlingIdentifier)));

export const updateOnHold = (params, behandlingIdentifier, updateFagsakInfo) => dispatch => dispatch(
  tilbakekrevingBehandlingApi.UPDATE_ON_HOLD.makeRestApiRequest()(params),
)
  .then(() => dispatch(updateFagsakAndBehandling(behandlingIdentifier, updateFagsakInfo)));

export const resetTilbakekrevingContext = () => (dispatch) => {
  Object.values(TilbakekrevingBehandlingApiKeys)
    .forEach((value) => {
      dispatch(tilbakekrevingBehandlingApi[value].resetRestApi()());
    });

  dispatch(resetBehandlingContext());
};

/* Reducer */
const initialState = {
  behandlingId: undefined,
  fagsakSaksnummer: undefined,
  hasShownBehandlingPaVent: false,
  fagsak: {},
};

export const tilbakekrevingBehandlingReducer = (state = initialState, action = {}) => { // NOSONAR Switch brukes som standard i reducers
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
    case RESET_FPTILBAKE_BEHANDLING:
      return initialState;
    default:
      return state;
  }
};

reducerRegistry.register(reducerName, tilbakekrevingBehandlingReducer);

// Selectors (Kun de knyttet til reducer)
export const getTilbakekrevingKodeverk = kodeverkType => createSelector(
  [tilbakekrevingBehandlingApi.KODEVERK.getRestApiData()], (kodeverk = {}) => kodeverk[kodeverkType],
);

const getBehandlingContext = state => state.default[reducerName];
export const getSelectedBehandlingId = createSelector([getBehandlingContext], behandlingContext => behandlingContext.behandlingId);
export const getSelectedSaksnummer = createSelector([getBehandlingContext], behandlingContext => behandlingContext.fagsakSaksnummer);
export const getBehandlingIdentifier = createSelector(
  [getSelectedBehandlingId, getSelectedSaksnummer],
  (behandlingId, saksnummer) => (saksnummer && behandlingId ? new BehandlingIdentifier(saksnummer, behandlingId) : undefined
  ),
);

export const getFagsakStatus = createSelector([getBehandlingContext], behandlingContext => behandlingContext.fagsak.fagsakStatus);
export const getFagsakPerson = createSelector([getBehandlingContext], behandlingContext => behandlingContext.fagsak.fagsakPerson);
export const getFagsakYtelseType = createSelector([getBehandlingContext], behandlingContext => behandlingContext.fagsak.fagsakYtelseType);
export const isForeldrepengerFagsak = createSelector([getBehandlingContext], behandlingContext => behandlingContext.fagsak.isForeldrepengerFagsak);

export const getHasShownBehandlingPaVent = createSelector([getBehandlingContext], behandlingContext => behandlingContext.hasShownBehandlingPaVent);

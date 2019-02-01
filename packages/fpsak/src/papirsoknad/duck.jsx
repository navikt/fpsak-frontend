import { createSelector } from 'reselect';

import BehandlingIdentifier from 'behandlingFelles/BehandlingIdentifier';
import sakOperations from 'behandlingFelles/SakOperations';
import papirsoknadApi, { PapirsoknadApiKeys } from './data/papirsoknadApi';
import reducerRegistry from '../ReducerRegistry';

const reducerName = 'papirsoknad';

/* Action types */
const actionType = name => `${reducerName}/${name}`;
export const RESET_REGISTRERING = actionType('RESET_REGISTRERING');
export const SET_SOKNAD_DATA = actionType('SET_SOKNAD_DATA');
const SET_BEHANDLING_INFO = actionType('SET_BEHANDLING_INFO');
const HAS_SHOWN_BEHANDLING_PA_VENT = actionType('HAS_SHOWN_BEHANDLING_PA_VENT');

/* Action creators */
export const resetRegistrering = () => ({
  type: RESET_REGISTRERING,
});

export const setSoknadData = soknadData => ({
  type: SET_SOKNAD_DATA,
  data: soknadData,
});

export const setBehandlingInfo = info => ({
  type: SET_BEHANDLING_INFO,
  data: info,
});

export const setHasShownBehandlingPaVent = () => ({
  type: HAS_SHOWN_BEHANDLING_PA_VENT,
});

export const submitRegistrering = papirsoknadApi.SAVE_AKSJONSPUNKT.makeRestApiRequest();

export const resetRegistreringSuccess = papirsoknadApi.SAVE_AKSJONSPUNKT.resetRestApi();

// TODO (TOR) Rydd opp i dette. Kan ein legge rehenting av fagsakInfo og original-behandling i resolver i staden?
export const updateBehandling = (
  behandlingIdentifier, behandlingerVersjonMappedById,
) => dispatch => dispatch(papirsoknadApi.BEHANDLING.makeRestApiRequest()(behandlingIdentifier.toJson(), { keepData: true }))
  .then((response) => {
    if (behandlingerVersjonMappedById && behandlingerVersjonMappedById[response.payload.id] !== response.payload.versjon) {
      dispatch(sakOperations.updateFagsakInfo(behandlingIdentifier.saksnummer));
    }
    return Promise.resolve(response);
  });

export const resetBehandling = dispatch => Promise.all([
  dispatch(papirsoknadApi.BEHANDLING.resetRestApi()()),
]);

export const fetchBehandling = (behandlingIdentifier, allBehandlinger) => (dispatch) => {
  resetBehandling(dispatch);
  dispatch(updateBehandling(behandlingIdentifier, allBehandlinger));
};

const updateFagsakAndBehandling = behandlingIdentifier => dispatch => dispatch(sakOperations.updateFagsakInfo(behandlingIdentifier.saksnummer))
  .then(() => dispatch(updateBehandling(behandlingIdentifier)));

export const updateOnHold = (params, behandlingIdentifier) => dispatch => dispatch(papirsoknadApi.UPDATE_ON_HOLD.makeRestApiRequest()(params))
  .then(() => dispatch(updateFagsakAndBehandling(behandlingIdentifier)));

export const resetPapirsoknadContext = () => (dispatch) => {
  Object.values(PapirsoknadApiKeys)
    .forEach((value) => {
      dispatch(papirsoknadApi[value].resetRestApi()());
    });
};


/* Reducer */
const initialState = {
  behandlingId: undefined,
  fagsakSaksnummer: undefined,
  hasShownBehandlingPaVent: false,
  soknadData: null,
};

export const papirsoknadReducer = (state = initialState, action = {}) => {
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
    case SET_SOKNAD_DATA:
      return {
        ...state,
        soknadData: action.data,
      };
    case RESET_REGISTRERING:
      return initialState;
    default:
      return state;
  }
};

reducerRegistry.register(reducerName, papirsoknadReducer);

// Selectors (Kun de knyttet til reducer)
const getPapirsoknadContext = state => state.default[reducerName];

export const getSelectedBehandlingId = createSelector([getPapirsoknadContext], papirsoknadContext => papirsoknadContext.behandlingId);
export const getSelectedSaksnummer = createSelector([getPapirsoknadContext], papirsoknadContext => papirsoknadContext.fagsakSaksnummer);
export const getBehandlingIdentifier = createSelector(
  [getSelectedBehandlingId, getSelectedSaksnummer],
  (behandlingId, saksnummer) => (behandlingId ? new BehandlingIdentifier(saksnummer, behandlingId) : undefined
  ),
);

export const getHasShownBehandlingPaVent = createSelector([getPapirsoknadContext], behandlingContext => behandlingContext.hasShownBehandlingPaVent);

export const getSoknadData = createSelector(
  [getPapirsoknadContext],
  (papirsoknadContext = {}) => papirsoknadContext.soknadData,
);

const getFormState = state => state.form;
export const getRegisteredFields = formName => createSelector(
  [getFormState],
  (formState = {}) => (formState[formName] ? formState[formName].registeredFields : {}),
);

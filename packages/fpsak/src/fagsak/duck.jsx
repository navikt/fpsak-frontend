import { createSelector } from 'reselect';

import { reducerRegistry } from '@fpsak-frontend/fp-felles';

import fpsakApi, { FpsakApiKeys } from '../data/fpsakApi';
import { updateBehandlingsupportInfo } from '../behandlingsupport/duck';
import { updateAnnenPartBehandling } from '../fagsakprofile/duck';
import behandlingOrchestrator from '../behandling/BehandlingOrchestrator';
import behandlingUpdater from '../behandling/BehandlingUpdater';

export const reducerName = 'fagsak';

/* Action types */
const actionType = (name) => `${reducerName}/${name}`;
export const SELECT_FAGSAK = actionType('SELECT_FAGSAK');
export const RESET_FAGSAKER = actionType('RESET_FAGSAKER');
export const SET_SELECTED_SAKSNUMMER = actionType('SET_SELECTED_SAKSNUMMER');

export const updateBehandlinger = (saksnummer) => (dispatch) => (behandlingOrchestrator.fetchBehandlinger(saksnummer, dispatch));

const resetFetchFagsakInfo = () => (dispatch) => {
  dispatch(fpsakApi.FETCH_FAGSAK.resetRestApi()());
  behandlingOrchestrator.resetRestApis(dispatch);
  behandlingUpdater.resetBehandling(dispatch);
  dispatch(fpsakApi.ANNEN_PART_BEHANDLING.resetRestApi()());
};

export const updateFagsakInfo = (saksnummer) => (dispatch) => Promise.all([
  dispatch(fpsakApi.FETCH_FAGSAK.makeRestApiRequest()({ saksnummer }, { keepData: true })),
  dispatch(updateBehandlinger(saksnummer)),
  dispatch(updateAnnenPartBehandling(saksnummer)),
  dispatch(updateBehandlingsupportInfo(saksnummer)),
]);

export const fetchFagsakInfo = (saksnummer) => (dispatch) => {
  dispatch(resetFetchFagsakInfo());
  return dispatch(updateFagsakInfo(saksnummer));
};

export const setSelectedSaksnummer = (saksnummer) => ({
  type: SET_SELECTED_SAKSNUMMER,
  data: saksnummer,
});

// Eksportert kun for test
export const doNotResetWhitelist = [
  FpsakApiKeys.NAV_ANSATT,
  FpsakApiKeys.LANGUAGE_FILE,
  FpsakApiKeys.BEHANDLENDE_ENHETER,
  FpsakApiKeys.KODEVERK,
  FpsakApiKeys.SHOW_DETAILED_ERROR_MESSAGES,
  FpsakApiKeys.FEATURE_TOGGLE,
];

export const resetFagsakContext = () => (dispatch) => {
  Object.values(FpsakApiKeys)
    .filter((value) => !doNotResetWhitelist.includes(value))
    .forEach((value) => {
      dispatch(fpsakApi[value].resetRestApi()());
    });
  dispatch({ type: RESET_FAGSAKER });
};

/* Reducers */
const initialState = {
  selectedSaksnummer: null,
};

export const fagsakReducer = (state = initialState, action = {}) => { // NOSONAR Switch brukes som standard i reducers
  switch (action.type) { // NOSONAR Switch brukes som standard i reducers
    case SET_SELECTED_SAKSNUMMER:
      return {
        selectedSaksnummer: action.data,
      };
    case RESET_FAGSAKER:
      return {
        selectedSaksnummer: null,
      };
    default:
      return state;
  }
};

reducerRegistry.register(reducerName, fagsakReducer);

// Selectors (Kun de knyttet til reducer)
const getFagsakContext = (state) => state.default[reducerName];
export const getSelectedSaksnummer = createSelector([getFagsakContext], (fagsakContext) => fagsakContext.selectedSaksnummer);

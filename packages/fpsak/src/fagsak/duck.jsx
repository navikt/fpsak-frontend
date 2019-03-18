import { createSelector } from 'reselect';

import fpsakApi, { FpsakApiKeys } from 'data/fpsakApi';
import { updateBehandlingsupportInfo } from 'behandlingsupport/duck';
import { updateAnnenPartBehandling } from 'fagsakprofile/duck';
import behandlingOrchestrator from 'behandling/BehandlingOrchestrator';
import behandlingUpdater from 'behandling/BehandlingUpdater';
import { reducerRegistry } from '@fpsak-frontend/fp-felles';

export const reducerName = 'fagsak';

/* Action types */
const actionType = name => `${reducerName}/${name}`;
export const PREVIEW_RECEIVED = actionType('PREVIEW_RECEIVED');
export const SELECT_FAGSAK = actionType('SELECT_FAGSAK');
export const RESET_FAGSAKER = actionType('RESET_FAGSAKER');
export const SET_SELECTED_SAKSNUMMER = actionType('SET_SELECTED_SAKSNUMMER');

/* Action creators */
// TODO (hb) move to data/duck
export const previewReceived = pdf => ({
  type: PREVIEW_RECEIVED,
  data: pdf,
});

export const fetchVedtaksbrevPreview = data => dispatch => dispatch(fpsakApi.FORHANDSVISNING_FORVED_BREV.makeRestApiRequest()(data))
  .then(response => dispatch(previewReceived(response.data)));

export const updateBehandlinger = saksnummer => dispatch => (behandlingOrchestrator.fetchBehandlinger(saksnummer, dispatch));

const resetFetchFagsakInfo = () => (dispatch) => {
  dispatch(fpsakApi.FETCH_FAGSAK.resetRestApi()());
  behandlingOrchestrator.resetRestApis(dispatch);
  behandlingUpdater.resetBehandling(dispatch);
  dispatch(fpsakApi.ANNEN_PART_BEHANDLING.resetRestApi()());
};

export const updateFagsakInfo = saksnummer => dispatch => Promise.all([
  dispatch(fpsakApi.FETCH_FAGSAK.makeRestApiRequest()({ saksnummer }, { keepData: true })),
  dispatch(updateBehandlinger(saksnummer)),
  dispatch(updateAnnenPartBehandling(saksnummer)),
  dispatch(updateBehandlingsupportInfo(saksnummer)),
]);

export const fetchFagsakInfo = saksnummer => (dispatch) => {
  dispatch(resetFetchFagsakInfo());
  return dispatch(updateFagsakInfo(saksnummer));
};

export const setSelectedSaksnummer = saksnummer => ({
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
    .filter(value => !doNotResetWhitelist.includes(value))
    .forEach((value) => {
      dispatch(fpsakApi[value].resetRestApi()());
    });
  dispatch({ type: RESET_FAGSAKER });
};

/* Reducers */
const initialState = {
  selectedSaksnummer: null,
};

const openPreview = (data) => {
  if (data) {
    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(data);
    } else {
      window.open(URL.createObjectURL(data));
    }
  }
};

export const fagsakReducer = (state = initialState, action = {}) => { // NOSONAR Switch brukes som standard i reducers
  switch (action.type) { // NOSONAR Switch brukes som standard i reducers
    case PREVIEW_RECEIVED:
      openPreview(action.data);
      return state;
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
const getFagsakContext = state => state.default[reducerName];
export const getSelectedSaksnummer = createSelector([getFagsakContext], fagsakContext => fagsakContext.selectedSaksnummer);

import { makeRestApiRequest, resetRestApi } from '@fpsak-frontend/data/duck';
import { FpsakApi } from '@fpsak-frontend/data/fpsakApi';
import { resetBehandlingsupportInfo, updateBehandlingsupportInfo } from 'behandlingsupport/duck';
import { updateAnnenPartBehandling } from 'fagsakprofile/duck';

/* Action types */
const actionType = name => `fagsak/${name}`;
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

export const fetchVedtaksbrevPreview = data => dispatch => dispatch(makeRestApiRequest(FpsakApi.FORHANDSVISNING_FORVED_BREV)(data))
  .then(response => dispatch(previewReceived(response.data)));

export const updateBehandlinger = saksnummer => dispatch => (
  dispatch(makeRestApiRequest(FpsakApi.BEHANDLINGER)({ saksnummer }, { keepData: true }))
);

const resetFetchFagsakInfo = () => (dispatch) => {
  dispatch(resetRestApi(FpsakApi.FETCH_FAGSAK)());
  dispatch(resetRestApi(FpsakApi.BEHANDLINGER)());
  dispatch(resetRestApi(FpsakApi.BEHANDLING)());
  dispatch(resetRestApi(FpsakApi.ANNEN_PART_BEHANDLING)());
  dispatch(resetBehandlingsupportInfo());
};

export const updateFagsakInfo = saksnummer => dispatch => (
  dispatch(makeRestApiRequest(FpsakApi.FETCH_FAGSAK)({ saksnummer }, { keepData: true }))
    .then(() => Promise.all([
      dispatch(updateBehandlinger(saksnummer)),
      dispatch(updateAnnenPartBehandling(saksnummer)),
      dispatch(updateBehandlingsupportInfo(saksnummer)),
    ]))
);

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
  FpsakApi.NAV_ANSATT,
  FpsakApi.LANGUAGE_FILE,
  FpsakApi.RETTSKILDE_URL,
  FpsakApi.SYSTEMRUTINE_URL,
  FpsakApi.BEHANDLENDE_ENHETER,
  FpsakApi.KODEVERK,
  FpsakApi.SHOW_DETAILED_ERROR_MESSAGES,
  FpsakApi.FEATURE_TOGGLE,
];

export const resetFagsakContext = () => (dispatch) => {
  Object.values(FpsakApi)
    .filter(value => !doNotResetWhitelist.includes(value))
    .forEach((value) => {
      dispatch(resetRestApi(value)());
    });
  dispatch({ type: RESET_FAGSAKER });
};

/* Reducers */
const initialState = {
  selectedSaksnummer: null,
};

const openPreview = (data) => {
  if (window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(data);
  } else {
    window.open(URL.createObjectURL(data));
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

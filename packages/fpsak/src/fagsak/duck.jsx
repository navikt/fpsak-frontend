import fpsakApi, { FpsakApiKeys } from 'data/fpsakApi';
import fpsakBehandlingApi, { BehandlingFpsakApiKeys } from 'behandlingFpsak/data/fpsakBehandlingApi';
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

export const fetchVedtaksbrevPreview = data => dispatch => dispatch(fpsakApi.FORHANDSVISNING_FORVED_BREV.makeRestApiRequest()(data))
  .then(response => dispatch(previewReceived(response.data)));

export const updateBehandlinger = saksnummer => dispatch => (
  dispatch(fpsakApi.BEHANDLINGER.makeRestApiRequest()({ saksnummer }, { keepData: true }))
);

const resetFetchFagsakInfo = () => (dispatch) => {
  dispatch(fpsakApi.FETCH_FAGSAK.resetRestApi()());
  dispatch(fpsakApi.BEHANDLINGER.resetRestApi()());
  dispatch(fpsakBehandlingApi.BEHANDLING.resetRestApi()());
  dispatch(fpsakApi.ANNEN_PART_BEHANDLING.resetRestApi()());
  dispatch(resetBehandlingsupportInfo());
};

export const updateFagsakInfo = saksnummer => dispatch => (
  dispatch(fpsakApi.FETCH_FAGSAK.makeRestApiRequest()({ saksnummer }, { keepData: true }))
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
  FpsakApiKeys.NAV_ANSATT,
  FpsakApiKeys.LANGUAGE_FILE,
  FpsakApiKeys.RETTSKILDE_URL,
  FpsakApiKeys.SYSTEMRUTINE_URL,
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
  Object.values(BehandlingFpsakApiKeys)
    .forEach((value) => {
      dispatch(fpsakBehandlingApi[value].resetRestApi()());
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

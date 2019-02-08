import { createSelector } from 'reselect';

import kommunikasjonsretning from '@fpsak-frontend/kodeverk/src/kommunikasjonsretning';
import { reducerRegistry, BehandlingIdentifier } from '@fpsak-frontend/fp-felles';
import { sakOperations } from '@fpsak-frontend/fp-behandling-felles';

import innsynBehandlingApi, { InnsynBehandlingApiKeys } from './data/innsynBehandlingApi';

const reducerName = 'innsynBehandling';

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


export const updateBehandling = (behandlingIdentifier, behandlingerVersjonMappedById) => dispatch => dispatch(
  innsynBehandlingApi.BEHANDLING.makeRestApiRequest()(behandlingIdentifier.toJson(), { keepData: true }),
)
  .then((response) => {
    if (behandlingerVersjonMappedById && behandlingerVersjonMappedById[response.payload.id] !== response.payload.versjon) {
      dispatch(sakOperations.updateFagsakInfo(behandlingIdentifier.saksnummer));
    }
    return Promise.resolve(response);
  });

export const resetBehandling = dispatch => Promise.all([
  dispatch(innsynBehandlingApi.BEHANDLING.resetRestApi()()),
  dispatch(resetBehandlingContext()),
]);

export const fetchBehandling = (behandlingIdentifier, allBehandlinger) => (dispatch) => {
  dispatch(innsynBehandlingApi.BEHANDLING.resetRestApi()());
  dispatch(updateBehandling(behandlingIdentifier, allBehandlinger));
};

const updateFagsakAndBehandling = (behandlingIdentifier, updateFagsakInfo) => dispatch => dispatch(updateFagsakInfo(behandlingIdentifier.saksnummer))
  .then(() => dispatch(updateBehandling(behandlingIdentifier)));

export const updateOnHold = (params, behandlingIdentifier, updateFagsakInfo) => dispatch => dispatch(
  innsynBehandlingApi.UPDATE_ON_HOLD.makeRestApiRequest()(params),
)
  .then(() => dispatch(updateFagsakAndBehandling(behandlingIdentifier, updateFagsakInfo)));

export const resetInnsynContext = () => (dispatch) => {
  Object.values(InnsynBehandlingApiKeys)
    .forEach((value) => {
      dispatch(innsynBehandlingApi[value].resetRestApi()());
    });
  dispatch(resetBehandlingContext());
};

/* Reducer */
const initialState = {
  behandlingId: undefined,
  fagsakSaksnummer: undefined,
  featureToggles: {},
  hasShownBehandlingPaVent: false,
  kodeverk: {},
  fagsak: {},
  allDocuments: [],
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
const getBehandlingContext = state => state.default[reducerName];
export const getSelectedBehandlingId = createSelector([getBehandlingContext], behandlingContext => behandlingContext.behandlingId);
export const getSelectedSaksnummer = createSelector([getBehandlingContext], behandlingContext => behandlingContext.fagsakSaksnummer);
export const getBehandlingIdentifier = createSelector(
  [getSelectedBehandlingId, getSelectedSaksnummer],
  (behandlingId, saksnummer) => (saksnummer && behandlingId ? new BehandlingIdentifier(saksnummer, behandlingId) : undefined),
);

export const getKodeverk = kodeverkType => createSelector(
  [getBehandlingContext], behandlingContext => behandlingContext.kodeverk[kodeverkType],
);

export const getAllDocuments = createSelector(
  [getBehandlingContext], behandlingContext => behandlingContext.allDocuments,
);

// Samme dokument kan ligge på flere behandlinger under samme fagsak.
export const getFilteredReceivedDocuments = createSelector([getAllDocuments], (allDocuments) => {
  const filteredDocuments = allDocuments.filter(doc => doc.kommunikasjonsretning === kommunikasjonsretning.INN);
  allDocuments.forEach(doc => !filteredDocuments.some(fd => fd.dokumentId === doc.dokumentId) && filteredDocuments.push(doc));
  return filteredDocuments;
});

export const getFagsakPerson = createSelector([getBehandlingContext], behandlingContext => behandlingContext.fagsak.fagsakPerson);
export const getFagsakYtelseType = createSelector([getBehandlingContext], behandlingContext => behandlingContext.fagsak.fagsakYtelseType);
export const isForeldrepengerFagsak = createSelector([getBehandlingContext], behandlingContext => behandlingContext.fagsak.isForeldrepengerFagsak);

export const getHasShownBehandlingPaVent = createSelector([getBehandlingContext], behandlingContext => behandlingContext.hasShownBehandlingPaVent);

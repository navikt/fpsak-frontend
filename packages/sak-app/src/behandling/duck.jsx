import { createSelector } from 'reselect';

import { reducerRegistry, BehandlingIdentifier, allAccessRights } from '@fpsak-frontend/fp-felles';

import { getSelectedSaksnummer } from '../fagsak/duck';
import fpsakApi from '../data/fpsakApi';
import { getNavAnsatt } from '../app/duck';
import { getBehandlinger } from './selectors/behandlingerSelectors';
import {
  getSelectedFagsakStatus, getKanRevurderingOpprettes, getSkalBehandlesAvInfotrygd, getFagsakYtelseType,
} from '../fagsak/fagsakSelectors';

const reducerName = 'behandling';

/* Action types */
const actionType = (name) => `${reducerName}/${name}`;
const SET_BEHANDLING_ID = actionType('SET_BEHANDLING_ID');
const SET_BEHANDLING_INFO_HOLDER = actionType('SET_BEHANDLING_INFO_HOLDER');
const RESET_BEHANDLING_CONTEXT = actionType('RESET_BEHANDLING_CONTEXT');

export const setSelectedBehandlingId = (behandlingId) => ({
  type: SET_BEHANDLING_ID,
  data: behandlingId,
});

export const setBehandlingInfoHolder = (behandlingInfoHolder) => ({
  type: SET_BEHANDLING_INFO_HOLDER,
  data: behandlingInfoHolder,
});

export const resetBehandlingContext = () => ({
  type: RESET_BEHANDLING_CONTEXT,
});


/* Action creators */
export const previewMessage = (erTilbakekreving, data) => (dispatch) => {
  const api = erTilbakekreving ? fpsakApi.PREVIEW_MESSAGE_TILBAKEKREVING : fpsakApi.PREVIEW_MESSAGE_FORMIDLING;
  return dispatch(api.makeRestApiRequest()(data));
};

/* Reducer */
const initialState = {
  behandlingId: undefined,
  behandlingInfoHolder: {},
};

export const behandlingReducer = (state = initialState, action = {}) => { // NOSONAR Switch brukes som standard i reducers
  switch (action.type) {
    case SET_BEHANDLING_ID:
      return {
        ...state,
        behandlingId: action.data,
      };
    case SET_BEHANDLING_INFO_HOLDER:
      return {
        ...state,
        behandlingInfoHolder: action.data,
      };
    case RESET_BEHANDLING_CONTEXT:
      return initialState;
    default:
      return state;
  }
};

reducerRegistry.register(reducerName, behandlingReducer);

// Selectors (Kun de knyttet til reducer)
const getBehandlingContext = (state) => state.default[reducerName];
export const getSelectedBehandlingId = createSelector([getBehandlingContext], (behandlingContext) => behandlingContext.behandlingId);
export const getBehandlingIdentifier = createSelector(
  [getSelectedBehandlingId, getSelectedSaksnummer],
  (behandlingId, saksnummer) => (behandlingId ? new BehandlingIdentifier(saksnummer, behandlingId) : undefined
  ),
);

// TODO (TOR) Fjern dette. Ikkje legg til fleire selectorar her. Komponentane utanfor behandlingskonteksten skal sjølv ha ansvar for å henta data
// Fjern:Start
const getBehandlingInfoHolder = createSelector([getBehandlingContext], (behandlingContext) => behandlingContext.behandlingInfoHolder);
export const getBehandlingVersjon = createSelector([getBehandlingInfoHolder], (data) => data.behandlingVersjon);
export const isKontrollerRevurderingAksjonspunkOpen = createSelector([getBehandlingInfoHolder], (data) => data.isKontrollerRevurderingAksjonspunkOpen);
export const getAksjonspunkter = createSelector([getBehandlingInfoHolder], (data) => data.aksjonspunkter);
export const getBehandlingKlageVurdering = createSelector([getBehandlingInfoHolder], (data) => data.behandlingKlageVurdering);
export const getBehandlingResultatstruktur = createSelector([getBehandlingInfoHolder], (data) => data.behandlingResultatstruktur);
export const getBehandlingsresultat = createSelector([getBehandlingInfoHolder], (data) => data.behandlingsresultat);
export const getBehandlingKlageVurderingResultatNFP = createSelector([getBehandlingInfoHolder], (data) => data.behandlingKlageVurderingResultatNFP);
export const getBehandlingKlageVurderingResultatNK = createSelector([getBehandlingInfoHolder], (data) => data.behandlingKlageVurderingResultatNK);
export const getSoknad = createSelector([getBehandlingInfoHolder], (data) => data.soknad);
export const getBehandlingsresultatFraOriginalBehandling = createSelector([getBehandlingInfoHolder], (data) => data.behandlingsresultatFraOriginalBehandling);
export const getResultatstrukturFraOriginalBehandling = createSelector([getBehandlingInfoHolder], (data) => data.resultatstrukturFraOriginalBehandling);
export const erArsakTypeBehandlingEtterKlage = createSelector([getBehandlingInfoHolder], (data) => data.erArsakTypeBehandlingEtterKlage);
// Fjern:Stopp


const getBehandling = createSelector([getBehandlinger, getSelectedBehandlingId],
  (behandlinger, behandlingId) => behandlinger.find((b) => b.id === behandlingId));

export const getBehandlingStatus = createSelector([getBehandling], (behandling = {}) => behandling.status);
export const getBehandlingType = createSelector([getBehandling], (behandling = {}) => behandling.type);
export const getBehandlingBehandlendeEnhetId = createSelector([getBehandling], (behandling = {}) => behandling.behandlendeEnhetId);
export const getBehandlingBehandlendeEnhetNavn = createSelector([getBehandling], (behandling = {}) => behandling.behandlendeEnhetNavn);
export const getBehandlingSprak = createSelector([getBehandling], (behandling) => behandling.sprakkode);
export const erBehandlingPaVent = createSelector([getBehandling], (behandling) => (behandling ? behandling.behandlingPaaVent : false));
export const erBehandlingKoet = createSelector([getBehandling], (behandling) => (behandling ? behandling.behandlingKoet : false));
export const getBehandlingAnsvarligSaksbehandler = createSelector([getBehandling], (behandling) => (behandling
  ? behandling.ansvarligSaksbehandler : undefined));
export const getBehandlingToTrinnsBehandling = createSelector([getBehandling], (behandling) => behandling.toTrinnsBehandling);

export const getRettigheter = createSelector([
  getNavAnsatt,
  getSelectedFagsakStatus,
  getKanRevurderingOpprettes,
  getSkalBehandlesAvInfotrygd,
  getFagsakYtelseType,
  getBehandlingStatus,
  getSoknad,
  getAksjonspunkter,
  getBehandlingType,
  getBehandlingAnsvarligSaksbehandler,
], allAccessRights);

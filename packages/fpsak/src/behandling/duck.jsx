import { createSelector } from 'reselect';

import { reducerRegistry, BehandlingIdentifier, allAccessRights } from '@fpsak-frontend/fp-felles';

import { getNavAnsatt } from 'app/duck';
import {
  getSelectedFagsakStatus, getKanRevurderingOpprettes, getSkalBehandlesAvInfotrygd, getFagsakYtelseType,
} from 'fagsak/fagsakSelectors';
import { getSelectedSaksnummer } from 'fagsak/duck';
import fpsakApi from 'data/fpsakApi';

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

// TODO (TOR) Alt under skal fjernast. Ikkje legg til fleire selectorar her. Komponentane utanfor behandlingskonteksten skal sjølv ha ansvar for å henta data
export const getBehandlingInfoHolder = createSelector([getBehandlingContext], (behandlingContext) => behandlingContext.behandlingInfoHolder);
export const isKontrollerRevurderingAksjonspunkOpen = createSelector([getBehandlingInfoHolder], (data) => data.isKontrollerRevurderingAksjonspunkOpen);
export const getBehandlingSprak = createSelector([getBehandlingInfoHolder], (data) => data.behandlingSprak);
export const getBehandlingVersjon = createSelector([getBehandlingInfoHolder], (data) => data.behandlingVersjon);
export const getAksjonspunkter = createSelector([getBehandlingInfoHolder], (data) => data.aksjonspunkter);
export const getBehandlingAnsvarligSaksbehandler = createSelector([getBehandlingInfoHolder], (data) => data.behandlingAnsvarligSaksbehandler);
export const getBehandlingStatus = createSelector([getBehandlingInfoHolder], (data) => data.behandlingStatus);
export const getBehandlingToTrinnsBehandling = createSelector([getBehandlingInfoHolder], (data) => data.behandlingToTrinnsBehandling);
export const getBehandlingKlageVurdering = createSelector([getBehandlingInfoHolder], (data) => data.behandlingKlageVurdering);
export const getBehandlingIsKlage = createSelector([getBehandlingInfoHolder], (data) => data.behandlingIsKlage);
export const getBehandlingResultatstruktur = createSelector([getBehandlingInfoHolder], (data) => data.behandlingResultatstruktur);
export const getBehandlingsresultat = createSelector([getBehandlingInfoHolder], (data) => data.behandlingsresultat);
export const getBehandlingType = createSelector([getBehandlingInfoHolder], (data) => data.behandlingType);
export const getBehandlingKlageVurderingResultatNFP = createSelector([getBehandlingInfoHolder], (data) => data.behandlingKlageVurderingResultatNFP);
export const getBehandlingKlageVurderingResultatNK = createSelector([getBehandlingInfoHolder], (data) => data.behandlingKlageVurderingResultatNK);
export const getBehandlingHasSoknad = createSelector([getBehandlingInfoHolder], (data) => data.behandlingHasSoknad);
export const getBehandlingIsInnsyn = createSelector([getBehandlingInfoHolder], (data) => data.behandlingIsInnsyn);
export const getBehandlingIsOnHold = createSelector([getBehandlingInfoHolder], (data) => data.behandlingIsOnHold);
export const isBehandlingInInnhentSoknadsopplysningerSteg = createSelector([
  getBehandlingInfoHolder], (data) => data.isBehandlingInInnhentSoknadsopplysningerSteg);
export const getBehandlingIsQueued = createSelector([getBehandlingInfoHolder], (data) => data.behandlingIsQueued);
export const getBehandlingBehandlendeEnhetId = createSelector([getBehandlingInfoHolder], (data) => data.behandlingBehandlendeEnhetId);
export const getBehandlingBehandlendeEnhetNavn = createSelector([getBehandlingInfoHolder], (data) => data.behandlingBehandlendeEnhetNavn);
export const getSoknad = createSelector([getBehandlingInfoHolder], (data) => data.soknad);
export const getBehandlingsresultatFraOriginalBehandling = createSelector([getBehandlingInfoHolder], (data) => data.behandlingsresultatFraOriginalBehandling);
export const getResultatstrukturFraOriginalBehandling = createSelector([getBehandlingInfoHolder], (data) => data.resultatstrukturFraOriginalBehandling);
export const erArsakTypeBehandlingEtterKlage = createSelector([getBehandlingInfoHolder], (data) => data.erArsakTypeBehandlingEtterKlage);


/* Skal ikkje fjernast */
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

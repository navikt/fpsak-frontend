import { createSelector } from 'reselect';
import { getRestApiData, makeRestApiRequest, getRestApiMeta } from 'data/duck';
import { FpsakApi } from 'data/fpsakApi';
import { getSelectedSaksnummer } from 'fagsak/fagsakSelectors';

/* Action types */
const actionType = name => `fagsakProfile/${name}`;
const TOGGLE_DISPLAYED_BEHANDLINGER = actionType('TOGGLE_DISPLAYED_BEHANDLINGER');
const RESET_FAGSAK_PROFILE = actionType('RESET_FAGSAK_PROFILE');

/* Action creators */
export const toggleShowAllBehandlinger = () => ({
  type: TOGGLE_DISPLAYED_BEHANDLINGER,
});

export const resetFagsakProfile = () => ({
  type: RESET_FAGSAK_PROFILE,
});

export const updateAnnenPartBehandling = saksnummer => dispatch => (
  dispatch(makeRestApiRequest(FpsakApi.ANNEN_PART_BEHANDLING)({ saksnummer }, { keepData: true }))
);

/* Reducer */
const initialState = {
  showAllBehandlinger: false,
};

export const fagsakProfileReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case TOGGLE_DISPLAYED_BEHANDLINGER:
      return {
        ...state,
        showAllBehandlinger: !state.showAllBehandlinger,
      };
    case RESET_FAGSAK_PROFILE:
      return initialState;
    default:
      return state;
  }
};

/* Selectors */
const getFagsakProfileContext = state => state.default.fagsakProfileContext;
export const getShowAllBehandlinger = state => getFagsakProfileContext(state).showAllBehandlinger;

const getAnnenPartBehandlingData = getRestApiData(FpsakApi.ANNEN_PART_BEHANDLING);
const getAnnenPartBehandlingMeta = getRestApiMeta(FpsakApi.ANNEN_PART_BEHANDLING);

export const getAnnenPartBehandling = createSelector(
  [getSelectedSaksnummer, getAnnenPartBehandlingData, getAnnenPartBehandlingMeta],
  (
    selectedSaksnummer, annenPartBehandlingData, annenPartBehandlingMeta = { params: {} },
  ) => (annenPartBehandlingMeta.params.saksnummer === selectedSaksnummer ? annenPartBehandlingData : undefined),
);

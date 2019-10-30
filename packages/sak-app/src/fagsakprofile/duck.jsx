import { createSelector } from 'reselect';

import { reducerRegistry } from '@fpsak-frontend/fp-felles';

import { getSelectedSaksnummer } from '../fagsak/fagsakSelectors';
import fpsakApi from '../data/fpsakApi';

const reducerName = 'fagsakProfile';

/* Action types */
const actionType = (name) => `${reducerName}/${name}`;
const TOGGLE_DISPLAYED_BEHANDLINGER = actionType('TOGGLE_DISPLAYED_BEHANDLINGER');
const RESET_FAGSAK_PROFILE = actionType('RESET_FAGSAK_PROFILE');

/* Action creators */
export const toggleShowAllBehandlinger = () => ({
  type: TOGGLE_DISPLAYED_BEHANDLINGER,
});

export const resetFagsakProfile = () => ({
  type: RESET_FAGSAK_PROFILE,
});

export const updateAnnenPartBehandling = (saksnummer) => (dispatch) => (
  dispatch(fpsakApi.ANNEN_PART_BEHANDLING.makeRestApiRequest()({ saksnummer }, { keepData: true }))
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

reducerRegistry.register(reducerName, fagsakProfileReducer);

/* Selectors */
const getFagsakProfileContext = (state) => state.default[reducerName];
export const getShowAllBehandlinger = (state) => getFagsakProfileContext(state).showAllBehandlinger;

const getAnnenPartBehandlingData = fpsakApi.ANNEN_PART_BEHANDLING.getRestApiData();
const getAnnenPartBehandlingMeta = fpsakApi.ANNEN_PART_BEHANDLING.getRestApiMeta();

export const getAnnenPartBehandling = createSelector(
  [getSelectedSaksnummer, getAnnenPartBehandlingData, getAnnenPartBehandlingMeta],
  (
    selectedSaksnummer, annenPartBehandlingData, annenPartBehandlingMeta = { params: {} },
  ) => (annenPartBehandlingMeta.params.saksnummer === selectedSaksnummer ? annenPartBehandlingData : undefined),
);

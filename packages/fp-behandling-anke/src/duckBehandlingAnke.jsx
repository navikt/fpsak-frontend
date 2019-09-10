import { createSelector } from 'reselect';

import { getBehandlingRedux } from '@fpsak-frontend/fp-behandling-felles';
import { reducerRegistry } from '@fpsak-frontend/fp-felles';

import ankeBehandlingApi, { AnkeBehandlingApiKeys } from './data/ankeBehandlingApi';

const reducerName = 'ankeBehandling';

const additionalInitialState = {
  fagsakBehandlingerInfo: [],
};

const behandlingRedux = getBehandlingRedux(reducerName, ankeBehandlingApi, AnkeBehandlingApiKeys, additionalInitialState);

// Eksportert kun for test
export const { reducer } = behandlingRedux;

reducerRegistry.register(reducerName, behandlingRedux.reducer);

export const {
  fetchBehandling,
  resetBehandling,
  resetBehandlingFpsakContext,
  setBehandlingInfo,
  setHasShownBehandlingPaVent,
  updateBehandling,
  updateOnHold,
} = behandlingRedux.actionCreators;
export const {
  getBehandlingIdentifier,
  getFagsakPerson,
  getFagsakStatus,
  getFagsakYtelseType,
  getHasShownBehandlingPaVent,
  getKodeverk,
  getSelectedBehandlingId,
  getNavAnsatt,
  getKanRevurderingOpprettes,
  getSkalBehandlesAvInfotrygd,
} = behandlingRedux.selectors;

export const getFagsakBehandlingerInfo = createSelector([behandlingRedux.selectors.getBehandlingContext],
  (behandlingContext) => behandlingContext.fagsakBehandlingerInfo);

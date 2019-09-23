import { createSelector } from 'reselect';

import { getBehandlingRedux } from '@fpsak-frontend/fp-behandling-felles';
import { reducerRegistry } from '@fpsak-frontend/fp-felles';

import fpsakBehandlingApi, { BehandlingFpsakApiKeys } from './data/fpsakBehandlingApi';

const reducerName = 'forstegangOgRevurderingBehandling';

const behandlingRedux = getBehandlingRedux(reducerName, fpsakBehandlingApi, BehandlingFpsakApiKeys);

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
  getSelectedSaksnummer,
  getFagsakPerson,
  getFagsakStatus,
  getFagsakYtelseType,
  getHasShownBehandlingPaVent,
  getKodeverk,
  getAlleKodeverk,
  getSelectedBehandlingId,
  isForeldrepengerFagsak,
  getFeatureToggles,
  getNavAnsatt,
  getKanRevurderingOpprettes,
  getSkalBehandlesAvInfotrygd,
} = behandlingRedux.selectors;

export const getFagsakInfo = createSelector([getSelectedSaksnummer, getFagsakYtelseType], (
  saksnummer, ytelseType,
) => ({
  saksnummer,
  ytelseType,
}));

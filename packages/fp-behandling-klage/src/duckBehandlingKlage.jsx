import { createSelector } from 'reselect';

import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import { getBehandlingRedux } from '@fpsak-frontend/fp-behandling-felles';
import { reducerRegistry } from '@fpsak-frontend/fp-felles';

import klageBehandlingApi, { KlageBehandlingApiKeys } from './data/klageBehandlingApi';

const reducerName = 'klageBehandling';

const additionalInitialState = {
  fagsakBehandlingerInfo: [],
};

const behandlingRedux = getBehandlingRedux(reducerName, klageBehandlingApi, KlageBehandlingApiKeys, additionalInitialState);

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
  setDoNoUpdateFagsak,
} = behandlingRedux.actionCreators;
export const {
  getBehandlingIdentifier,
  getFagsakPerson,
  getFagsakStatus,
  getFagsakYtelseType,
  getHasShownBehandlingPaVent,
  getKodeverk,
  getAlleKodeverk,
  getSelectedBehandlingId,
  getSelectedSaksnummer,
  getNavAnsatt,
  getKanRevurderingOpprettes,
  getSkalBehandlesAvInfotrygd,
  shouldUpdateFagsak,
} = behandlingRedux.selectors;

export const getAvsluttedeBehandlinger = createSelector([behandlingRedux.selectors.getBehandlingContext],
  (behandlingContext) => behandlingContext.fagsakBehandlingerInfo.filter((behandling) => behandling.status.kode === behandlingStatus.AVSLUTTET));

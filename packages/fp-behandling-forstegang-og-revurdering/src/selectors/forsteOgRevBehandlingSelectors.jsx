import { createSelector } from 'reselect';

import { getCommonBehandlingSelectors } from '@fpsak-frontend/fp-behandling-felles';
import { allAccessRights } from '@fpsak-frontend/fp-felles';

import forstegangOgRevBehandlingApi from '../data/fpsakBehandlingApi';
import {
  getSelectedBehandlingId, getNavAnsatt, getFagsakStatus, getKanRevurderingOpprettes, getSkalBehandlesAvInfotrygd,
  getFagsakYtelseType,
} from '../duckBehandlingForstegangOgRev';

const commonBehandlingSelectors = getCommonBehandlingSelectors(getSelectedBehandlingId, forstegangOgRevBehandlingApi);

const getRettigheter = createSelector([
  getNavAnsatt,
  getFagsakStatus,
  getKanRevurderingOpprettes,
  getSkalBehandlesAvInfotrygd,
  getFagsakYtelseType,
  commonBehandlingSelectors.getBehandlingStatus,
  commonBehandlingSelectors.getSoknad,
  commonBehandlingSelectors.getAksjonspunkter,
  commonBehandlingSelectors.getBehandlingType,
  commonBehandlingSelectors.getBehandlingAnsvarligSaksbehandler,
], allAccessRights);

const forsteOgRevBehandlingSelectors = {
  ...commonBehandlingSelectors,
  getRettigheter,
};

export default forsteOgRevBehandlingSelectors;

import { createSelector } from 'reselect';

import { omit } from '@fpsak-frontend/utils';
import { getCommonBehandlingSelectors } from '@fpsak-frontend/fp-behandling-felles';
import { allAccessRights } from '@fpsak-frontend/fp-felles';

import innsynBehandlingApi from '../data/innsynBehandlingApi';
import {
  getSelectedBehandlingId, getNavAnsatt, getFagsakStatus, getFagsakYtelseType, getKanRevurderingOpprettes, getSkalBehandlesAvInfotrygd,
} from '../duckBehandlingInnsyn';

const commonBehandlingInnsynSelectors = getCommonBehandlingSelectors(getSelectedBehandlingId, innsynBehandlingApi);

// INNSYN
const getBehandlingInnsyn = createSelector(
  [commonBehandlingInnsynSelectors.getSelectedBehandling], (selectedBehandling = {}) => (selectedBehandling.innsyn ? selectedBehandling.innsyn : undefined),
);
const getBehandlingInnsynResultatType = createSelector([getBehandlingInnsyn], (innsyn = {}) => innsyn.innsynResultatType);

const getRettigheter = createSelector([
  getNavAnsatt,
  getFagsakStatus,
  getKanRevurderingOpprettes,
  getSkalBehandlesAvInfotrygd,
  getFagsakYtelseType,
  commonBehandlingInnsynSelectors.getBehandlingStatus,
  commonBehandlingInnsynSelectors.getSoknad,
  commonBehandlingInnsynSelectors.getAksjonspunkter,
  commonBehandlingInnsynSelectors.getBehandlingType,
  commonBehandlingInnsynSelectors.getBehandlingAnsvarligSaksbehandler,
], allAccessRights);

const innsynBehandlingSelectors = {
  ...omit(commonBehandlingInnsynSelectors, 'getSelectedBehandling'),
  getBehandlingInnsynResultatType,
  getRettigheter,
};

export default innsynBehandlingSelectors;

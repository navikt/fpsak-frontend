import { createSelector } from 'reselect';

import { getCommonBehandlingSelectors } from '@fpsak-frontend/fp-behandling-felles';
import { allAccessRights } from '@fpsak-frontend/fp-felles';

import forstegangOgRevBehandlingApi from '../data/fpsakBehandlingApi';
import {
  getSelectedBehandlingId, getNavAnsatt, getFagsakStatus,
} from '../duckBehandlingForstegangOgRev';

const commonBehandlingSelectors = getCommonBehandlingSelectors(getSelectedBehandlingId, forstegangOgRevBehandlingApi);

const getRettigheter = createSelector([
  getNavAnsatt,
  getFagsakStatus,
  commonBehandlingSelectors.getBehandlingStatus,
  commonBehandlingSelectors.getBehandlingType,
], allAccessRights);

const forsteOgRevBehandlingSelectors = {
  ...commonBehandlingSelectors,
  getRettigheter,
};

export default forsteOgRevBehandlingSelectors;

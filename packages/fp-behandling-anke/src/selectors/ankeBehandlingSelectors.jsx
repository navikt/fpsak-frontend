import { createSelector } from 'reselect';

import { omit } from '@fpsak-frontend/utils';
import { getCommonBehandlingSelectors } from '@fpsak-frontend/fp-behandling-felles';
import { allAccessRights } from '@fpsak-frontend/fp-felles';

import ankeBehandlingApi from '../data/ankeBehandlingApi';
import {
  getSelectedBehandlingId, getNavAnsatt, getFagsakStatus,
} from '../duckBehandlingAnke';

const commonBehandlingAnkeSelectors = getCommonBehandlingSelectors(getSelectedBehandlingId, ankeBehandlingApi);

// ANKEVURDERING
const getBehandlingAnkeVurdering = createSelector(
  [commonBehandlingAnkeSelectors.getSelectedBehandling], (selectedBehandling = {}) => (selectedBehandling['anke-vurdering']
    ? selectedBehandling['anke-vurdering'] : undefined),
);
const getBehandlingAnkeVurderingResultat = createSelector(
  [getBehandlingAnkeVurdering], (ankeVurdering = {}) => ankeVurdering.ankeVurderingResultat,
);

const getRettigheter = createSelector([
  getNavAnsatt,
  getFagsakStatus,
  commonBehandlingAnkeSelectors.getBehandlingStatus,
  commonBehandlingAnkeSelectors.getBehandlingType,
], allAccessRights);

const ankeBehandlingSelectors = {
  ...omit(commonBehandlingAnkeSelectors, 'getSelectedBehandling'),
  getBehandlingAnkeVurdering,
  getBehandlingAnkeVurderingResultat,
  getRettigheter,
};

export default ankeBehandlingSelectors;

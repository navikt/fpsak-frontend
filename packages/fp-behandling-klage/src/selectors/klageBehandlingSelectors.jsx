import { createSelector } from 'reselect';

import { omit } from '@fpsak-frontend/utils';
import { getCommonBehandlingSelectors } from '@fpsak-frontend/fp-behandling-felles';
import { allAccessRights } from '@fpsak-frontend/fp-felles';

import klageBehandlingApi from '../data/klageBehandlingApi';
import {
  getSelectedBehandlingId, getNavAnsatt, getFagsakStatus,
} from '../duckBehandlingKlage';

const commonBehandlingKlageSelectors = getCommonBehandlingSelectors(getSelectedBehandlingId, klageBehandlingApi);

// KLAGEVURDERING
const getBehandlingKlageVurdering = createSelector(
  [commonBehandlingKlageSelectors.getSelectedBehandling], (selectedBehandling = {}) => (
    selectedBehandling['klage-vurdering'] ? selectedBehandling['klage-vurdering'] : undefined),
);
const getBehandlingKlageVurderingResultatNFP = createSelector(
  [getBehandlingKlageVurdering], (klageVurdering = {}) => klageVurdering.klageVurderingResultatNFP,
);
const getBehandlingKlageVurderingResultatNK = createSelector(
  [getBehandlingKlageVurdering], (klageVurdering = {}) => klageVurdering.klageVurderingResultatNK,
);

const getRettigheter = createSelector([
  getNavAnsatt,
  getFagsakStatus,
  commonBehandlingKlageSelectors.getBehandlingStatus,
  commonBehandlingKlageSelectors.getBehandlingType,
], allAccessRights);

const klageBehandlingSelectors = {
  ...omit(commonBehandlingKlageSelectors, 'getSelectedBehandling'),
  getBehandlingKlageVurdering,
  getBehandlingKlageVurderingResultatNFP,
  getBehandlingKlageVurderingResultatNK,
  getRettigheter,
};

export default klageBehandlingSelectors;

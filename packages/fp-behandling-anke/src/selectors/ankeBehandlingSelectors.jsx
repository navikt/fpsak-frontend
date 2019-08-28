import { createSelector } from 'reselect';

import { omit } from '@fpsak-frontend/utils';
import { getCommonBehandlingSelectors } from '@fpsak-frontend/fp-behandling-felles';

import ankeBehandlingApi from '../data/ankeBehandlingApi';
import { getSelectedBehandlingId } from '../duckBehandlingAnke';

const commonBehandlingAnkeSelectors = getCommonBehandlingSelectors(getSelectedBehandlingId, ankeBehandlingApi);

const getMellomlagringData = createSelector(
  [ankeBehandlingApi.SAVE_ANKE_VURDERING.getRestApiMeta()],
  (data) => (data ? data.params : {}),
);

const getMellomlagringSpinner = createSelector(
  [ankeBehandlingApi.SAVE_REOPEN_ANKE_VURDERING.getRestApiStarted(), ankeBehandlingApi.SAVE_ANKE_VURDERING.getRestApiStarted()],
  (reOpenStarted, saveStarted) => (reOpenStarted || saveStarted),
);

// ANKEVURDERING
const getBehandlingAnkeVurdering = createSelector(
  [commonBehandlingAnkeSelectors.getSelectedBehandling], (selectedBehandling = {}) => (selectedBehandling['anke-vurdering']
    ? selectedBehandling['anke-vurdering'] : undefined),
);
const getBehandlingAnkeVurderingResultat = createSelector(
  [getBehandlingAnkeVurdering], (ankeVurdering = {}) => ankeVurdering.ankeVurderingResultat,
);

const ankeBehandlingSelectors = {
  ...omit(commonBehandlingAnkeSelectors, 'getSelectedBehandling'),
  getMellomlagringData,
  getMellomlagringSpinner,
  getBehandlingAnkeVurdering,
  getBehandlingAnkeVurderingResultat,
};

export default ankeBehandlingSelectors;

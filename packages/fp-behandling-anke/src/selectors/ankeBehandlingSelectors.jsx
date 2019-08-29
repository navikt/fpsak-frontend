import { createSelector } from 'reselect';

import { omit } from '@fpsak-frontend/utils';
import { getCommonBehandlingSelectors } from '@fpsak-frontend/fp-behandling-felles';
import { allAccessRights } from '@fpsak-frontend/fp-felles';

import ankeBehandlingApi from '../data/ankeBehandlingApi';
import {
  getSelectedBehandlingId, getNavAnsatt, getFagsakStatus, getFagsakYtelseType, getKanRevurderingOpprettes, getSkalBehandlesAvInfotrygd,
} from '../duckBehandlingAnke';

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

const getRettigheter = createSelector([
  getNavAnsatt,
  getFagsakStatus,
  getKanRevurderingOpprettes,
  getSkalBehandlesAvInfotrygd,
  getFagsakYtelseType,
  commonBehandlingAnkeSelectors.getBehandlingStatus,
  commonBehandlingAnkeSelectors.getSoknad,
  commonBehandlingAnkeSelectors.getAksjonspunkter,
  commonBehandlingAnkeSelectors.getBehandlingType,
  commonBehandlingAnkeSelectors.getBehandlingAnsvarligSaksbehandler,
], allAccessRights);

const ankeBehandlingSelectors = {
  ...omit(commonBehandlingAnkeSelectors, 'getSelectedBehandling'),
  getMellomlagringData,
  getMellomlagringSpinner,
  getBehandlingAnkeVurdering,
  getBehandlingAnkeVurderingResultat,
  getRettigheter,
};

export default ankeBehandlingSelectors;

import { createSelector } from 'reselect';

import { omit } from '@fpsak-frontend/utils';
import { getCommonBehandlingSelectors } from '@fpsak-frontend/fp-behandling-felles';
import { allAccessRights } from '@fpsak-frontend/fp-felles';

import tilbakekrevingBehandlingApi from '../data/tilbakekrevingBehandlingApi';
import {
  getSelectedBehandlingId, getNavAnsatt, getFagsakStatus,
} from '../duckBehandlingTilbakekreving';

const commonBehandlingSelectors = getCommonBehandlingSelectors(getSelectedBehandlingId, tilbakekrevingBehandlingApi);

// FORELDELSE
const getForeldelsePerioder = createSelector([commonBehandlingSelectors.getSelectedBehandling], (
  selectedBehandling = {},
) => selectedBehandling.perioderForeldelse);

// BEREGNINGSRESULTAT
const getBeregningsresultat = createSelector([commonBehandlingSelectors.getSelectedBehandling], (
  selectedBehandling = {},
) => selectedBehandling.beregningsresultat);

const getRettigheter = createSelector([
  getNavAnsatt,
  getFagsakStatus,
  commonBehandlingSelectors.getBehandlingStatus,
  commonBehandlingSelectors.getBehandlingType,
], allAccessRights);

const tilbakekrevingBehandlingSelectors = {
  ...omit(commonBehandlingSelectors, 'getSelectedBehandling'),
  getForeldelsePerioder,
  getBeregningsresultat,
  getRettigheter,
};

export default tilbakekrevingBehandlingSelectors;

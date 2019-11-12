import { createSelector } from 'reselect';

import { omit } from '@fpsak-frontend/utils';
import { getCommonBehandlingSelectors } from '@fpsak-frontend/fp-behandling-felles';
import { allAccessRights } from '@fpsak-frontend/fp-felles';

import {
  getSelectedBehandlingId, getNavAnsatt, getFagsakStatus,
} from '../duckPapirsoknad';
import papirsoknadApi from '../data/papirsoknadApi';

const commonBehandlingSelectors = getCommonBehandlingSelectors(getSelectedBehandlingId, papirsoknadApi);

const getRettigheter = createSelector([
  getNavAnsatt,
  getFagsakStatus,
  commonBehandlingSelectors.getBehandlingStatus,
  commonBehandlingSelectors.getBehandlingType,
], allAccessRights);

const papirsoknadBehandlingSelectors = {
  ...omit(commonBehandlingSelectors, 'getSelectedBehandling'),
  getRettigheter,
};

export default papirsoknadBehandlingSelectors;

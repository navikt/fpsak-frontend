import { createSelector } from 'reselect';

import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';

import commonBehandlingSelectors from './selectors/forsteOgRevBehandlingSelectors';
import { getFagsakYtelseType } from './duckBehandlingForstegangOgRev';

export const getBehandlingResultatstruktur = createSelector(
  [getFagsakYtelseType, commonBehandlingSelectors.getSelectedBehandling], (fagsakType, selectedBehandling = {}) => (
    fagsakType.kode === fagsakYtelseType.FORELDREPENGER || fagsakType.kode === fagsakYtelseType.SVANGERSKAPSPENGER
      ? selectedBehandling['beregningsresultat-foreldrepenger'] : selectedBehandling['beregningsresultat-engangsstonad']),
);
export const getUttaksresultatPerioder = createSelector([commonBehandlingSelectors.getSelectedBehandling], (
  selectedBehandling = {},
) => (selectedBehandling['uttaksresultat-perioder']));
export const getStonadskontoer = createSelector([commonBehandlingSelectors.getSelectedBehandling], (
  selectedBehandling = {},
) => selectedBehandling['uttak-stonadskontoer']);

export const getSimuleringResultat = createSelector([commonBehandlingSelectors.getSelectedBehandling], (
  selectedBehandling = {},
) => (selectedBehandling.simuleringResultat));

// ORIGINAL BEHANDLING
export const getOriginalBehandling = createSelector(
  [commonBehandlingSelectors.getSelectedBehandling], (selectedBehandling) => (selectedBehandling ? selectedBehandling['original-behandling'] : undefined),
);

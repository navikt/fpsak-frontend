import { createSelector } from 'reselect';

import klageBehandlingArsakType from '@fpsak-frontend/kodeverk/src/behandlingArsakType';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';

import commonBehandlingSelectors from './selectors/forsteOgRevBehandlingSelectors';
import { getFagsakYtelseType } from './duckBehandlingForstegangOgRev';

// TODO (TOR) Dette skal vekk

export const getBehandlingArsakTyper = createSelector(
  [commonBehandlingSelectors.getSelectedBehandling], (selectedBehandling = {}) => (selectedBehandling.behandlingArsaker
    ? selectedBehandling.behandlingArsaker.map(({ behandlingArsakType }) => behandlingArsakType) : undefined),
);

export const erArsakTypeBehandlingEtterKlage = createSelector([getBehandlingArsakTyper], (behandlingArsakTyper = []) => behandlingArsakTyper
  .some((bt) => bt.kode === klageBehandlingArsakType.ETTER_KLAGE || bt.kode === klageBehandlingArsakType.KLAGE_U_INNTK
    || bt.kode === klageBehandlingArsakType.KLAGE_M_INNTK));

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

import { createSelector } from 'reselect';

import { getOriginalBehandling } from '../behandlingSelectors';
import { isForeldrepengerFagsak } from '../duckBehandlingForstegangOgRev';

export const getBehandlingsresultatFraOriginalBehandling = createSelector(
  [getOriginalBehandling], (originalBehandling = {}) => originalBehandling.behandlingsresultat,
);

export const getResultatstrukturFraOriginalBehandling = createSelector([
  isForeldrepengerFagsak, getOriginalBehandling], (isForeldrepenger, originalBehandling = {}) => (isForeldrepenger
  ? originalBehandling['beregningsresultat-foreldrepenger'] : originalBehandling['beregningsresultat-engangsstonad']));

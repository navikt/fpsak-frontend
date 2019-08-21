import { createSelector } from 'reselect';

import { getOriginalBehandling } from 'behandlingForstegangOgRevurdering/src/behandlingSelectors';
import { isForeldrepengerFagsak } from 'behandlingForstegangOgRevurdering/src/duckBehandlingForstegangOgRev';

export const getFamiliehendelseFraOriginalBehandling = createSelector(
  [getOriginalBehandling], (originalBehandling = {}) => originalBehandling.familiehendelse,
);

export const getSoknadFraOriginalBehandling = createSelector([getOriginalBehandling], (originalBehandling = {}) => originalBehandling.soknad);

export const getBehandlingsresultatFraOriginalBehandling = createSelector(
  [getOriginalBehandling], (originalBehandling = {}) => originalBehandling.behandlingsresultat,
);

export const getResultatstrukturFraOriginalBehandling = createSelector([
  isForeldrepengerFagsak, getOriginalBehandling], (isForeldrepenger, originalBehandling = {}) => (isForeldrepenger
  ? originalBehandling['beregningsresultat-foreldrepenger'] : originalBehandling['beregningsresultat-engangsstonad']));

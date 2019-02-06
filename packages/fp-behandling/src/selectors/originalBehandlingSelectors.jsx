import { createSelector } from 'reselect';

import { getOriginalBehandlingId } from 'behandlingFpsak/src/behandlingSelectors';
import { isForeldrepengerFagsak } from 'behandlingFpsak/src/duck';
import fpsakBehandlingApi from '../data/fpsakBehandlingApi';

// Denne er kun eksportert for bruk i test. Ikke bruk andre steder!!!
export const getOriginalBehandling = createSelector(
  [getOriginalBehandlingId, fpsakBehandlingApi.ORIGINAL_BEHANDLING.getRestApiData(), fpsakBehandlingApi.ORIGINAL_BEHANDLING.getRestApiMeta()],
  (originalBehandlingId, originalBehandling, originalBehandlingMeta = { params: {} }) => (originalBehandling
    && originalBehandlingMeta.params.behandlingId === originalBehandlingId ? originalBehandling : undefined),
);

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

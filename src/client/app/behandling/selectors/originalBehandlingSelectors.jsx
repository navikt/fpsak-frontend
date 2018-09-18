import { createSelector } from 'reselect';

import { getOriginalBehandlingId } from 'behandling/behandlingSelectors';
import { isForeldrepengerFagsak } from 'fagsak/fagsakSelectors';
import { FpsakApi } from 'data/fpsakApi';
import { getRestApiData, getRestApiMeta } from 'data/duck';

// Denne er kun eksportert for bruk i test. Ikke bruk andre steder!!!
export const getOriginalBehandling = createSelector(
  [getOriginalBehandlingId, getRestApiData(FpsakApi.ORIGINAL_BEHANDLING), getRestApiMeta(FpsakApi.ORIGINAL_BEHANDLING)],
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

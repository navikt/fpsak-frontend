import { createSelector } from 'reselect';

import fpsakApi from 'data/fpsakApi';
import { getSelectedSaksnummer } from 'fagsak/fagsakSelectors';

const getBehandlingerData = fpsakApi.BEHANDLINGER.getRestApiData();
const getBehandlingerMeta = fpsakApi.BEHANDLINGER.getRestApiMeta();

// TODO (TOR) Denne bør ikkje eksporterast. Bryt opp i fleire selectors
export const getBehandlinger = createSelector(
  [getSelectedSaksnummer, getBehandlingerData, getBehandlingerMeta],
  (saksnummer, behandlingerData, behandlingerMeta = { params: {} }) => (behandlingerMeta.params.saksnummer === saksnummer ? behandlingerData : undefined),
);

export const getBehandlingerIds = createSelector([getBehandlinger], (behandlinger = []) => behandlinger.map(b => b.id));

export const getBehandlingerTypesMappedById = createSelector([getBehandlinger], (behandlinger = []) => behandlinger
  .reduce((acc, b) => ({ ...acc, [b.id]: b.type.kode }), {}));

export const getBehandlingerVersjonMappedById = createSelector([getBehandlinger], (behandlinger = []) => behandlinger
  .reduce((a, b) => ({ ...a, [b.id]: b.versjon }), {}));

export const getNumBehandlinger = createSelector([getBehandlinger], (behandlinger = []) => behandlinger.length);

export const getNoExistingBehandlinger = createSelector([getBehandlinger], (behandlinger = []) => behandlinger.length === 0);

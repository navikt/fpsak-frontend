import { createSelector } from 'reselect';

import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';

import fpsakApi from 'data/fpsakApi';
import behandlingOrchestrator from 'behandling/BehandlingOrchestrator';

const getFetchFagsakResult = fpsakApi.FETCH_FAGSAK.getRestApiData();

// TODO (TOR) Flytt denne til duck. (Må fikse circular dependency først)
export const getFagsakContext = state => state.default.fagsak;

export const getSelectedSaksnummer = state => getFagsakContext(state).selectedSaksnummer;

// NB! Ikke bruk denne i eksterne filer (utover dagens bruk)
export const getSelectedFagsak = createSelector(
  [getSelectedSaksnummer, getFetchFagsakResult],
  (selectedSaksnummer, fagsak = {}) => (fagsak.saksnummer === selectedSaksnummer ? fagsak : undefined),
);

export const getSelectedFagsakStatus = createSelector(getSelectedFagsak, fagsak => (fagsak ? fagsak.status : undefined));

export const getFagsakPerson = createSelector(getSelectedFagsak, fagsak => (fagsak ? fagsak.person : undefined));

export const getFagsakYtelseType = createSelector(getSelectedFagsak, fagsak => (fagsak ? fagsak.sakstype : undefined));

export const isForeldrepengerFagsak = createSelector(getFagsakYtelseType, (ytelseType = {}) => (ytelseType.kode === fagsakYtelseType.FORELDREPENGER));
export const isSvangerskapFagsak = createSelector(getFagsakYtelseType, (ytelseType = {}) => (ytelseType.kode === fagsakYtelseType.SVANGERSKAPSPENGER));

// TODO (TOR) Endre tre funksjonane under til selectors
export const getFetchFagsakInfoFinished = (state) => {
  const finished = [fpsakApi.FETCH_FAGSAK.getRestApiFinished()(state), ...behandlingOrchestrator.getRestApisFinished(state)];
  return !finished.some(f => !f);
};

export const getFetchFagsakInfoFailed = (state) => {
  const error = [fpsakApi.FETCH_FAGSAK.getRestApiError()(state), ...behandlingOrchestrator.getRestApisErrors(state)];
  return error.some(e => e !== undefined);
};

export const getAllFagsakInfoResolved = (state) => {
  const data = [fpsakApi.FETCH_FAGSAK.getRestApiData()(state), ...behandlingOrchestrator.getRestApisData(state)];
  return !data.some(d => d === undefined);
};

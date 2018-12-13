import { createSelector } from 'reselect';

import fpsakApi from 'data/fpsakApi';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';

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

export const getFetchFagsakInfoFinished = createSelector(
  [
    fpsakApi.FETCH_FAGSAK.getRestApiFinished(),
    fpsakApi.BEHANDLINGER.getRestApiFinished(),
    fpsakApi.ALL_DOCUMENTS.getRestApiFinished(),
    fpsakApi.HISTORY.getRestApiFinished(),
  ],
  (...finished) => !finished.some(f => !f),
);

export const getFetchFagsakInfoFailed = createSelector(
  [
    fpsakApi.FETCH_FAGSAK.getRestApiError(),
    fpsakApi.BEHANDLINGER.getRestApiError(),
    fpsakApi.ALL_DOCUMENTS.getRestApiError(),
    fpsakApi.HISTORY.getRestApiError(),
  ],
  (...error) => error.some(e => e !== undefined),
);

export const getAllFagsakInfoResolved = createSelector(
  [
    fpsakApi.FETCH_FAGSAK.getRestApiData(),
    fpsakApi.BEHANDLINGER.getRestApiData(),
    fpsakApi.ALL_DOCUMENTS.getRestApiData(),
    fpsakApi.HISTORY.getRestApiData(),
  ],
  (...data) => !data.some(d => d === undefined),
);

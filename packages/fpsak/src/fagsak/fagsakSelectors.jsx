import { createSelector } from 'reselect';

import { getRestApiData, getRestApiError, getRestApiFinished } from 'data/duck';
import { FpsakApi } from 'data/fpsakApi';
import fagsakYtelseType from 'kodeverk/fagsakYtelseType';

const getFetchFagsakResult = getRestApiData(FpsakApi.FETCH_FAGSAK);

export const getFagsakContext = state => state.default.fagsakContext;
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
    getRestApiFinished(FpsakApi.FETCH_FAGSAK),
    getRestApiFinished(FpsakApi.BEHANDLINGER),
    getRestApiFinished(FpsakApi.ALL_DOCUMENTS),
    getRestApiFinished(FpsakApi.HISTORY),
  ],
  (...finished) => !finished.some(f => !f),
);

export const getFetchFagsakInfoFailed = createSelector(
  [
    getRestApiError(FpsakApi.FETCH_FAGSAK),
    getRestApiError(FpsakApi.BEHANDLINGER),
    getRestApiError(FpsakApi.ALL_DOCUMENTS),
    getRestApiError(FpsakApi.HISTORY),
  ],
  (...error) => error.some(e => e !== undefined),
);

export const getAllFagsakInfoResolved = createSelector(
  [
    getRestApiData(FpsakApi.FETCH_FAGSAK),
    getRestApiData(FpsakApi.BEHANDLINGER),
    getRestApiData(FpsakApi.ALL_DOCUMENTS),
    getRestApiData(FpsakApi.HISTORY),
  ],
  (...data) => !data.some(d => d === undefined),
);

import { expect } from 'chai';

import {
  getSelectedFagsak, getFetchFagsakInfoFinished, getFetchFagsakInfoFailed, getAllFagsakInfoResolved,
} from './fagsakSelectors';

describe('<fagsakSelectors>', () => {
  it('skal returnere fagsak når valgt saksnummer stemmer overens med hentet fagsak', () => {
    const selectedSaksnummer = '123';
    const fagsak = {
      saksnummer: '123',
    };
    const res = getSelectedFagsak.resultFunc(selectedSaksnummer, fagsak);
    expect(res).is.eql(fagsak);
  });

  it('skal ikke returnere fagsak når valgt saksnummer er ulik hentet fagsak', () => {
    const selectedSaksnummer = '123';
    const fagsak = {
      saksnummer: '456',
    };
    const res = getSelectedFagsak.resultFunc(selectedSaksnummer, fagsak);
    expect(res).is.undefined;
  });

  it('skal returnere true når all data er hentet', () => {
    const finishedFetchFagsak = true;
    const finishedFetchBehandlinger = true;
    const finishedFetchDocuments = true;
    const finishedFetchHistory = true;
    const res = getFetchFagsakInfoFinished.resultFunc(finishedFetchFagsak, finishedFetchBehandlinger, finishedFetchDocuments, finishedFetchHistory);
    expect(res).is.true;
  });

  it('skal returnere false når restkall for å hente fagsak ikke er ferdig', () => {
    const finishedFetchFagsak = false;
    const finishedFetchBehandlinger = true;
    const finishedFetchDocuments = true;
    const finishedFetchHistory = true;
    const res = getFetchFagsakInfoFinished.resultFunc(finishedFetchFagsak, finishedFetchBehandlinger, finishedFetchDocuments, finishedFetchHistory);
    expect(res).is.false;
  });

  it('skal returnere true når alle restkall går bra', () => {
    const fetchFagsakError = undefined;
    const fetchBehandlingerError = undefined;
    const fetchDocumentsError = undefined;
    const fetchHistoryError = undefined;
    const res = getFetchFagsakInfoFailed.resultFunc(fetchFagsakError, fetchBehandlingerError, fetchDocumentsError, fetchHistoryError);
    expect(res).is.false;
  });

  it('skal returnere false når restkall for å hente fagsak feiler', () => {
    const fetchFagsakError = { feil: true };
    const fetchBehandlingerError = undefined;
    const fetchDocumentsError = undefined;
    const fetchHistoryError = undefined;
    const res = getFetchFagsakInfoFailed.resultFunc(fetchFagsakError, fetchBehandlingerError, fetchDocumentsError, fetchHistoryError);
    expect(res).is.true;
  });

  it('skal returnere true når all data er hentet', () => {
    const fagsakData = {};
    const behandlingerData = {};
    const documentsData = {};
    const historyData = {};
    const res = getAllFagsakInfoResolved.resultFunc(fagsakData, behandlingerData, documentsData, historyData);
    expect(res).is.true;
  });

  it('skal returnere false når fagsakdata ikke er hentet', () => {
    const fagsakData = undefined;
    const behandlingerData = {};
    const documentsData = {};
    const historyData = {};
    const res = getAllFagsakInfoResolved.resultFunc(fagsakData, behandlingerData, documentsData, historyData);
    expect(res).is.false;
  });
});

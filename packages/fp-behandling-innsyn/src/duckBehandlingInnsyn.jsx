import { createSelector } from 'reselect';

import kommunikasjonsretning from '@fpsak-frontend/kodeverk/src/kommunikasjonsretning';
import { getBehandlingRedux } from '@fpsak-frontend/fp-behandling-felles';
import { reducerRegistry } from '@fpsak-frontend/fp-felles';

import innsynBehandlingApi, { InnsynBehandlingApiKeys } from './data/innsynBehandlingApi';

const reducerName = 'innsynBehandling';

const additionalInitalState = {
  allDocuments: [],
};

const behandlingRedux = getBehandlingRedux(reducerName, innsynBehandlingApi, InnsynBehandlingApiKeys, additionalInitalState);

// Eksportert kun for test
export const { reducer } = behandlingRedux;

reducerRegistry.register(reducerName, behandlingRedux.reducer);

export const {
  fetchBehandling,
  resetBehandling,
  resetBehandlingFpsakContext,
  setBehandlingInfo,
  setHasShownBehandlingPaVent,
  updateBehandling,
  updateOnHold,
} = behandlingRedux.actionCreators;
export const {
  getBehandlingIdentifier,
  getFagsakPerson,
  getFagsakStatus,
  getFagsakYtelseType,
  getHasShownBehandlingPaVent,
  getKodeverk,
  getAlleKodeverk,
  getSelectedBehandlingId,
  getSelectedSaksnummer,
  getNavAnsatt,
  getKanRevurderingOpprettes,
  getSkalBehandlesAvInfotrygd,
} = behandlingRedux.selectors;

export const getAllDocuments = createSelector(
  [behandlingRedux.selectors.getBehandlingContext], (behandlingContext) => behandlingContext.allDocuments,
);

// Samme dokument kan ligge på flere behandlinger under samme fagsak.
export const getFilteredReceivedDocuments = createSelector([getAllDocuments], (allDocuments) => {
  const filteredDocuments = allDocuments.filter((doc) => doc.kommunikasjonsretning === kommunikasjonsretning.INN);
  allDocuments.forEach((doc) => !filteredDocuments.some((fd) => fd.dokumentId === doc.dokumentId) && filteredDocuments.push(doc));
  return filteredDocuments;
});

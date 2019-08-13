import { createSelector } from 'reselect';

import { omit } from '@fpsak-frontend/utils';
import { getCommonBehandlingSelectors } from '@fpsak-frontend/fp-behandling-felles';

import innsynBehandlingApi from '../data/innsynBehandlingApi';
import { getSelectedBehandlingId } from '../duckBehandlingInnsyn';

const commonBehandlingInnsynSelectors = getCommonBehandlingSelectors(getSelectedBehandlingId, innsynBehandlingApi);

// INNSYN
const getBehandlingInnsyn = createSelector(
  [commonBehandlingInnsynSelectors.getSelectedBehandling], (selectedBehandling = {}) => (selectedBehandling.innsyn ? selectedBehandling.innsyn : undefined),
);
const getBehandlingInnsynResultatType = createSelector([getBehandlingInnsyn], (innsyn = {}) => innsyn.innsynResultatType);
const getBehandlingInnsynMottattDato = createSelector([getBehandlingInnsyn], (innsyn = {}) => innsyn.innsynMottattDato);
const getBehandlingInnsynDokumenter = createSelector([getBehandlingInnsyn], (innsyn = {}) => (innsyn.dokumenter ? innsyn.dokumenter : []));
const getBehandlingInnsynVedtaksdokumentasjon = createSelector(
  [getBehandlingInnsyn], (innsyn = {}) => (innsyn.vedtaksdokumentasjon ? innsyn.vedtaksdokumentasjon : []),
);

const innsynBehandlingSelectors = {
  ...omit(commonBehandlingInnsynSelectors, 'getSelectedBehandling'),
  getBehandlingInnsynResultatType,
  getBehandlingInnsynMottattDato,
  getBehandlingInnsynDokumenter,
  getBehandlingInnsynVedtaksdokumentasjon,
};

export default innsynBehandlingSelectors;

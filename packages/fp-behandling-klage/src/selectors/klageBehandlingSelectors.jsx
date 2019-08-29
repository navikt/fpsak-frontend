import { createSelector } from 'reselect';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { omit } from '@fpsak-frontend/utils';
import { getCommonBehandlingSelectors } from '@fpsak-frontend/fp-behandling-felles';
import { allAccessRights } from '@fpsak-frontend/fp-felles';

import klageBehandlingApi from '../data/klageBehandlingApi';
import {
  getSelectedBehandlingId, getNavAnsatt, getFagsakStatus, getFagsakYtelseType, getKanRevurderingOpprettes, getSkalBehandlesAvInfotrygd,
} from '../duckBehandlingKlage';

const commonBehandlingKlageSelectors = getCommonBehandlingSelectors(getSelectedBehandlingId, klageBehandlingApi);

const getMellomlagringData = createSelector(
  [klageBehandlingApi.SAVE_KLAGE_VURDERING.getRestApiMeta()],
  (data) => (data ? data.params : {}),
);

const getMellomlagringSpinner = createSelector(
  [klageBehandlingApi.SAVE_REOPEN_KLAGE_VURDERING.getRestApiStarted(), klageBehandlingApi.SAVE_KLAGE_VURDERING.getRestApiStarted()],
  (reOpenStarted, saveStarted) => (reOpenStarted || saveStarted),
);

// KLAGEVURDERING
const getBehandlingKlageVurdering = createSelector(
  [commonBehandlingKlageSelectors.getSelectedBehandling], (selectedBehandling = {}) => (
    selectedBehandling['klage-vurdering'] ? selectedBehandling['klage-vurdering'] : undefined),
);
const getBehandlingKlageVurderingResultatNFP = createSelector(
  [getBehandlingKlageVurdering], (klageVurdering = {}) => klageVurdering.klageVurderingResultatNFP,
);
const getBehandlingKlageVurderingResultatNK = createSelector(
  [getBehandlingKlageVurdering], (klageVurdering = {}) => klageVurdering.klageVurderingResultatNK,
);
const getBehandlingKlageFormkravResultatNFP = createSelector(
  [getBehandlingKlageVurdering], (klageVurdering = {}) => klageVurdering.klageFormkravResultatNFP,
);
const getBehandlingKlageFormkravResultatKA = createSelector(
  [getBehandlingKlageVurdering], (klageVurdering = {}) => klageVurdering.klageFormkravResultatKA,
);

const isKlageBehandlingInKA = createSelector(
  [commonBehandlingKlageSelectors.getAksjonspunkter], (openAksjonspunkter = []) => openAksjonspunkter
    .some((ap) => ap.definisjon.kode === aksjonspunktCodes.VURDERING_AV_FORMKRAV_KLAGE_KA
      || ap.definisjon.kode === aksjonspunktCodes.BEHANDLE_KLAGE_NK),
);

const getRettigheter = createSelector([
  getNavAnsatt,
  getFagsakStatus,
  getKanRevurderingOpprettes,
  getSkalBehandlesAvInfotrygd,
  getFagsakYtelseType,
  commonBehandlingKlageSelectors.getBehandlingStatus,
  commonBehandlingKlageSelectors.getSoknad,
  commonBehandlingKlageSelectors.getAksjonspunkter,
  commonBehandlingKlageSelectors.getBehandlingType,
  commonBehandlingKlageSelectors.getBehandlingAnsvarligSaksbehandler,
], allAccessRights);

const klageBehandlingSelectors = {
  ...omit(commonBehandlingKlageSelectors, 'getSelectedBehandling'),
  getMellomlagringData,
  getMellomlagringSpinner,
  getBehandlingKlageVurdering,
  getBehandlingKlageVurderingResultatNFP,
  getBehandlingKlageVurderingResultatNK,
  getBehandlingKlageFormkravResultatNFP,
  getBehandlingKlageFormkravResultatKA,
  isKlageBehandlingInKA,
  getRettigheter,
};

export default klageBehandlingSelectors;

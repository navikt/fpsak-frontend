import { createSelector } from 'reselect';

import aksjonspunktCodes, {
  isInnhentSaksopplysningerAksjonspunkt,
} from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import klageBehandlingApi from '../data/klageBehandlingApi';
import { getSelectedBehandlingId } from '../duckKlage';

export const isBehandlingInSync = createSelector(
  [getSelectedBehandlingId, klageBehandlingApi.BEHANDLING.getRestApiData()],
  (behandlingId, behandling = {}) => behandlingId !== undefined && behandlingId === behandling.id,
);

// NB! Kun intern bruk
const getSelectedBehandling = createSelector(
  [isBehandlingInSync, klageBehandlingApi.BEHANDLING.getRestApiData()],
  (isInSync, behandling = {}) => (isInSync ? behandling : undefined),
);

export const hasReadOnlyBehandling = createSelector(
  [klageBehandlingApi.BEHANDLING.getRestApiError(), getSelectedBehandling], (behandlingFetchError, selectedBehandling = {}) => (!!behandlingFetchError
    || (selectedBehandling.taskStatus && selectedBehandling.taskStatus.readOnly ? selectedBehandling.taskStatus.readOnly : false)),
);
export const getMellomlagringData = createSelector(
  [klageBehandlingApi.SAVE_KLAGE_VURDERING.getRestApiMeta()],
  data => (data ? data.params : {}),
);

export const getMellomlagringSpinner = createSelector(
  [klageBehandlingApi.SAVE_REOPEN_KLAGE_VURDERING.getRestApiStarted(), klageBehandlingApi.SAVE_KLAGE_VURDERING.getRestApiStarted()],
  (reOpenStarted, saveStarted) => (reOpenStarted || saveStarted),
);

export const getBehandlingVersjon = createSelector([getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling.versjon);
export const getBehandlingStatus = createSelector([getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling.status);
export const getBehandlingBehandlendeEnhetId = createSelector([getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling.behandlendeEnhetId);
export const getBehandlingBehandlendeEnhetNavn = createSelector([getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling.behandlendeEnhetNavn);
export const getBehandlingType = createSelector([getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling.type);

export const getBehandlingIsOnHold = createSelector([getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling.behandlingPaaVent);
export const getBehandlingIsQueued = createSelector([getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling.behandlingKoet);
export const getBehandlingOnHoldDate = createSelector([getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling.fristBehandlingPaaVent);
export const getBehandlingsresultat = createSelector([getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling.behandlingsresultat);
export const getBehandlingHenlagt = createSelector([getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling.behandlingHenlagt);
export const getBehandlingToTrinnsBehandling = createSelector([getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling.toTrinnsBehandling);

export const getBehandlingVenteArsakKode = createSelector([getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling.venteArsakKode);
export const getBehandlingAnsvarligSaksbehandler = createSelector(
  [getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling.ansvarligSaksbehandler,
);
export const getTotrinnskontrollArsaker = createSelector(
  [getSelectedBehandling], (selectedBehandling = {}) => (selectedBehandling['totrinnskontroll-arsaker']),
);
export const getTotrinnskontrollArsakerUtenUdefinert = createSelector(
  [getTotrinnskontrollArsaker], (aarsaker = []) => (aarsaker.filter(aarsak => aarsak.skjermlenkeType !== '-')),
);
export const getTotrinnskontrollArsakerReadOnly = createSelector(
  [getSelectedBehandling], (selectedBehandling = {}) => (selectedBehandling['totrinnskontroll-arsaker-readOnly']),
);
export const getBrevMaler = createSelector([getSelectedBehandling], (selectedBehandling = {}) => (selectedBehandling['brev-maler']));

export const getSimuleringResultat = createSelector([getSelectedBehandling], (selectedBehandling = {}) => (selectedBehandling.simuleringResultat));
export const getTilbakekrevingValg = createSelector([getSelectedBehandling], (selectedBehandling = {}) => (selectedBehandling.tilbakekrevingvalg));

// AKSJONSPUNKTER
export const getAksjonspunkter = createSelector([getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling.aksjonspunkter);
export const getOpenAksjonspunkter = createSelector(
  [getAksjonspunkter], (aksjonspunkter = []) => aksjonspunkter.filter(ap => isAksjonspunktOpen(ap.status.kode)),
);
export const isBehandlingInInnhentSoknadsopplysningerSteg = createSelector(
  [getOpenAksjonspunkter], (openAksjonspunkter = []) => openAksjonspunkter.some(ap => isInnhentSaksopplysningerAksjonspunkt(ap.definisjon.kode)),
);
export const isKontrollerRevurderingAksjonspunkOpen = createSelector(
  [getOpenAksjonspunkter], (openAksjonspunkter = []) => openAksjonspunkter
    .some(ap => ap.definisjon.kode === aksjonspunktCodes.KONTROLLER_REVURDERINGSBEHANDLING_VARSEL_VED_UGUNST),
);
export const hasBehandlingManualPaVent = createSelector(
  [getOpenAksjonspunkter], (openAksjonspunkter = []) => openAksjonspunkter.some(ap => ap.definisjon.kode === aksjonspunktCodes.AUTO_MANUELT_SATT_PÅ_VENT),
);


export const isKlageBehandlingInKA = createSelector(
  [getAksjonspunkter], (openAksjonspunkter = []) => openAksjonspunkter
    .some(ap => ap.definisjon.kode === aksjonspunktCodes.VURDERING_AV_FORMKRAV_KLAGE_KA
      || ap.definisjon.kode === aksjonspunktCodes.BEHANDLE_KLAGE_NK),
);


// KLAGEVURDERING
export const getBehandlingKlageVurdering = createSelector(
  [getSelectedBehandling], (selectedBehandling = {}) => (selectedBehandling['klage-vurdering'] ? selectedBehandling['klage-vurdering'] : undefined),
);
export const getBehandlingKlageVurderingResultatNFP = createSelector(
  [getBehandlingKlageVurdering], (klageVurdering = {}) => klageVurdering.klageVurderingResultatNFP,
);
export const getBehandlingKlageVurderingResultatNK = createSelector(
  [getBehandlingKlageVurdering], (klageVurdering = {}) => klageVurdering.klageVurderingResultatNK,
);
export const getBehandlingKlageFormkravResultatNFP = createSelector(
  [getBehandlingKlageVurdering], (klageVurdering = {}) => klageVurdering.klageFormkravResultatNFP,
);
export const getBehandlingKlageFormkravResultatKA = createSelector(
  [getBehandlingKlageVurdering], (klageVurdering = {}) => klageVurdering.klageFormkravResultatKA,
);

// SPRÅK
export const getBehandlingSprak = createSelector([getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling.sprakkode);

// SØKNAD
export const getSoknad = createSelector([getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling.soknad);
export const getBehandlingHasSoknad = createSelector([getSoknad], soknad => !!soknad);

// VILKÅR
export const getBehandlingVilkar = createSelector([getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling.vilkar);


//-------------------------------------------------------------------------------------------------------------------------------------------------------------

const hasBehandlingLukketStatus = createSelector(
  [getBehandlingStatus], (status = {}) => status.kode === behandlingStatus.AVSLUTTET || status.kode === behandlingStatus.IVERKSETTER_VEDTAK
|| status.kode === behandlingStatus.FATTER_VEDTAK,
);

export const isBehandlingStatusReadOnly = createSelector(
  [getBehandlingIsOnHold, hasReadOnlyBehandling, hasBehandlingLukketStatus],
  (behandlingPaaVent, isBehandlingReadOnly, hasLukketStatus) => hasLukketStatus || behandlingPaaVent || isBehandlingReadOnly,
);

export const getAllMerknaderFraBeslutter = createSelector([getBehandlingStatus, getAksjonspunkter], (status, aksjonspunkter = []) => {
  let merknader = {};
  if (status && status.kode === behandlingStatus.BEHANDLING_UTREDES) {
    merknader = aksjonspunkter
      .reduce((obj, ap) => ({ ...obj, [ap.definisjon.kode]: { notAccepted: ap.toTrinnsBehandling && ap.toTrinnsBehandlingGodkjent === false } }), {});
  }
  return merknader;
});

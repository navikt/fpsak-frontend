import { createSelector } from 'reselect';

import aksjonspunktCodes, { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import tilbakekrevingBehandlingApi from '../data/tilbakekrevingBehandlingApi';
import { getSelectedBehandlingId } from '../duckTilbake';

export const isBehandlingInSync = createSelector(
  [getSelectedBehandlingId, tilbakekrevingBehandlingApi.BEHANDLING.getRestApiData()],
  (behandlingId, behandling = {}) => behandlingId !== undefined && behandlingId === behandling.id,
);

// NB! Kun intern bruk
const getSelectedBehandling = createSelector(
  [isBehandlingInSync, tilbakekrevingBehandlingApi.BEHANDLING.getRestApiData()],
  (isInSync, behandling = {}) => (isInSync ? behandling : undefined),
);

export const hasReadOnlyBehandling = createSelector(
  [tilbakekrevingBehandlingApi.BEHANDLING.getRestApiError(), getSelectedBehandling], (behandlingFetchError, selectedBehandling = {}) => (!!behandlingFetchError
    || (selectedBehandling.taskStatus && selectedBehandling.taskStatus.readOnly ? selectedBehandling.taskStatus.readOnly : false)),
);

export const getBehandlingVersjon = createSelector([getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling.versjon);
export const getBehandlingType = createSelector([getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling.type);
export const getBehandlingStatus = createSelector([getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling.status);
export const getBehandlingOnHoldDate = createSelector([getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling.fristBehandlingPaaVent);
export const getBehandlingIsOnHold = createSelector([getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling.behandlingPaaVent);
export const getBehandlingVenteArsakKode = createSelector([getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling.venteArsakKode);
export const getBehandlingsresultat = createSelector([getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling.behandlingsresultat);
export const getBehandlingHenlagt = createSelector([getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling.behandlingHenlagt);
export const getStonadskontoer = createSelector([getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling['uttak-stonadskontoer']);
export const getBehandlingBehandlendeEnhetId = createSelector([getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling.behandlendeEnhetId);
export const getBehandlingBehandlendeEnhetNavn = createSelector([getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling.behandlendeEnhetNavn);
export const getBehandlingAnsvarligSaksbehandler = createSelector(
  [getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling.ansvarligSaksbehandler,
);

// SØKNAD
export const getSoknad = createSelector([getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling.soknad);
export const getBehandlingHasSoknad = createSelector([getSoknad], soknad => !!soknad);

// AKSJONSPUNKTER
export const getAksjonspunkter = createSelector([getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling.aksjonspunkter);
export const getOpenAksjonspunkter = createSelector(
  [getAksjonspunkter], (aksjonspunkter = []) => aksjonspunkter.filter(ap => isAksjonspunktOpen(ap.status.kode)),
);
export const hasBehandlingManualPaVent = createSelector(
  [getOpenAksjonspunkter], (openAksjonspunkter = []) => openAksjonspunkter.some(ap => ap.definisjon.kode === aksjonspunktCodes.AUTO_MANUELT_SATT_PÅ_VENT),
);

// INNTEKT - ARBEID - YTELSE
const getBehandlingInntektArbeidYtelse = createSelector([getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling['inntekt-arbeid-ytelse']);
export const getBehandlingRelatertTilgrensendeYtelserForSoker = createSelector(
  [getBehandlingInntektArbeidYtelse], (inntektArbeidYtelse = {}) => inntektArbeidYtelse.relatertTilgrensendeYtelserForSoker,
);
export const getBehandlingRelatertTilgrensendeYtelserForAnnenForelder = createSelector(
  [getBehandlingInntektArbeidYtelse], (inntektArbeidYtelse = {}) => inntektArbeidYtelse.relatertTilgrensendeYtelserForAnnenForelder,
);
export const getBehandlingArbeidsforhold = createSelector(
  [getBehandlingInntektArbeidYtelse], (inntektArbeidYtelse = {}) => inntektArbeidYtelse.arbeidsforhold,
);

// FEILUTBETALING
export const getFeilutbetalingFakta = createSelector([getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling.feilutbetalingFakta);

// FORELDELSE
export const getForeldelsePerioder = createSelector([getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling.perioderForeldelse);
export const getFeilutbetalingAarsaker = createSelector([getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling.feilutbetalingAarsak);

// SPRÅK
export const getBehandlingSprak = createSelector([getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling.sprakkode);

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

export const getMerknaderFraBeslutter = aksjonspunktCode => createSelector(getAllMerknaderFraBeslutter, allMerknaderFraBeslutter => (
  allMerknaderFraBeslutter[aksjonspunktCode] || {}
));

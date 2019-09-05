import { createSelector } from 'reselect';

import { getLanguageCodeFromSprakkode } from '@fpsak-frontend/utils';
import aksjonspunktCodes, { isInnhentSaksopplysningerAksjonspunkt } from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';

const getCommonBehandlingSelectors = (getSelectedBehandlingId, behandlingApi) => {
  const isBehandlingInSync = createSelector(
    [getSelectedBehandlingId, behandlingApi.BEHANDLING.getRestApiData()],
    (behandlingId, behandling = {}) => behandlingId !== undefined && behandlingId === behandling.id,
  );

  // NB! Kun intern bruk
  const getSelectedBehandling = createSelector(
    [isBehandlingInSync, behandlingApi.BEHANDLING.getRestApiData()],
    (isInSync, behandling = {}) => (isInSync ? behandling : undefined),
  );

  const hasReadOnlyBehandling = createSelector(
    [behandlingApi.BEHANDLING.getRestApiError(), getSelectedBehandling], (behandlingFetchError, selectedBehandling = {}) => (!!behandlingFetchError
      || (selectedBehandling.taskStatus && selectedBehandling.taskStatus.readOnly ? selectedBehandling.taskStatus.readOnly : false)),
  );

  const getBehandlingVersjon = createSelector([getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling.versjon);
  const getBehandlingStatus = createSelector([getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling.status);
  const getBehandlingBehandlendeEnhetId = createSelector([getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling.behandlendeEnhetId);
  const getBehandlingBehandlendeEnhetNavn = createSelector([getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling.behandlendeEnhetNavn);
  const getBehandlingType = createSelector([getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling.type);

  const getBehandlingIsOnHold = createSelector([getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling.behandlingPaaVent);
  const getBehandlingIsQueued = createSelector([getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling.behandlingKoet);
  const getBehandlingOnHoldDate = createSelector([getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling.fristBehandlingPaaVent);
  const getBehandlingsresultat = createSelector([getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling.behandlingsresultat);
  const getBehandlingHenlagt = createSelector([getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling.behandlingHenlagt);
  const getBehandlingToTrinnsBehandling = createSelector([getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling.toTrinnsBehandling);

  const getBehandlingVenteArsakKode = createSelector([getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling.venteArsakKode);
  const getBehandlingAnsvarligSaksbehandler = createSelector(
    [getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling.ansvarligSaksbehandler,
  );

  // AKSJONSPUNKTER
  const getAksjonspunkter = createSelector([getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling.aksjonspunkter);
  const getOpenAksjonspunkter = createSelector(
    [getAksjonspunkter], (aksjonspunkter = []) => aksjonspunkter.filter((ap) => isAksjonspunktOpen(ap.status.kode)),
  );
  const isBehandlingInInnhentSoknadsopplysningerSteg = createSelector(
    [getOpenAksjonspunkter], (openAksjonspunkter = []) => openAksjonspunkter.some((ap) => isInnhentSaksopplysningerAksjonspunkt(ap.definisjon.kode)),
  );
  const isKontrollerRevurderingAksjonspunkOpen = createSelector(
    [getOpenAksjonspunkter], (openAksjonspunkter = []) => openAksjonspunkter
      .some((ap) => ap.definisjon.kode === aksjonspunktCodes.KONTROLLER_REVURDERINGSBEHANDLING_VARSEL_VED_UGUNST),
  );
  const hasBehandlingManualPaVent = createSelector(
    [getOpenAksjonspunkter], (openAksjonspunkter = []) => openAksjonspunkter.some((ap) => ap.definisjon.kode === aksjonspunktCodes.AUTO_MANUELT_SATT_PÅ_VENT),
  );

  // SPRÅK
  const getBehandlingSprak = createSelector([getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling.sprakkode);
  const getBehandlingLanguageCode = createSelector([getBehandlingSprak], (sprakkode = {}) => getLanguageCodeFromSprakkode(sprakkode));

  // SØKNAD
  const getSoknad = createSelector([getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling.soknad);
  const getBehandlingHasSoknad = createSelector([getSoknad], (soknad) => !!soknad);

  // VILKÅR
  const getBehandlingVilkar = createSelector([getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling.vilkar);
  const getBehandlingVilkarCodes = createSelector([getBehandlingVilkar], (vilkar = []) => vilkar.map((v) => v.vilkarType.kode));

  //----------------------------------------------------------------------------------------------------------------------------

  // intern
  const hasBehandlingLukketStatus = createSelector(
    [getBehandlingStatus], (status = {}) => status.kode === behandlingStatus.AVSLUTTET || status.kode === behandlingStatus.IVERKSETTER_VEDTAK
  || status.kode === behandlingStatus.FATTER_VEDTAK,
  );

  const isBehandlingStatusReadOnly = createSelector(
    [getBehandlingIsOnHold, hasReadOnlyBehandling, hasBehandlingLukketStatus],
    (behandlingPaaVent, isBehandlingReadOnly, hasLukketStatus) => hasLukketStatus || behandlingPaaVent || isBehandlingReadOnly,
  );

  const hasBehandlingUtredesStatus = createSelector(
    [getBehandlingStatus], (status = {}) => status.kode === behandlingStatus.BEHANDLING_UTREDES,
  );

  const getAllMerknaderFraBeslutter = createSelector([getBehandlingStatus, getAksjonspunkter], (status, aksjonspunkter = []) => {
    let merknader = {};
    if (status && status.kode === behandlingStatus.BEHANDLING_UTREDES) {
      merknader = aksjonspunkter
        .reduce((obj, ap) => ({ ...obj, [ap.definisjon.kode]: { notAccepted: ap.toTrinnsBehandling && ap.toTrinnsBehandlingGodkjent === false } }), {});
    }
    return merknader;
  });

  const getMerknaderFraBeslutter = (aksjonspunktCode) => createSelector(getAllMerknaderFraBeslutter, (allMerknaderFraBeslutter) => (
    allMerknaderFraBeslutter[aksjonspunktCode] || {}
  ));

  return {
    getSelectedBehandling,
    isBehandlingInSync,
    hasReadOnlyBehandling,
    getBehandlingVersjon,
    getBehandlingStatus,
    getBehandlingBehandlendeEnhetId,
    getBehandlingBehandlendeEnhetNavn,
    getBehandlingType,
    getBehandlingIsOnHold,
    getBehandlingIsQueued,
    getBehandlingOnHoldDate,
    getBehandlingsresultat,
    getBehandlingHenlagt,
    getBehandlingToTrinnsBehandling,
    getBehandlingVenteArsakKode,
    getBehandlingAnsvarligSaksbehandler,
    getAksjonspunkter,
    getOpenAksjonspunkter,
    isBehandlingInInnhentSoknadsopplysningerSteg,
    isKontrollerRevurderingAksjonspunkOpen,
    hasBehandlingManualPaVent,
    getBehandlingSprak,
    getBehandlingLanguageCode,
    getSoknad,
    getBehandlingHasSoknad,
    getBehandlingVilkar,
    getBehandlingVilkarCodes,
    hasBehandlingUtredesStatus,
    isBehandlingStatusReadOnly,
    getAllMerknaderFraBeslutter,
    getMerknaderFraBeslutter,
  };
};

export default getCommonBehandlingSelectors;

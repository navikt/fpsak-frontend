import { createSelector } from 'reselect';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
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

  const getBehandlingUuid = createSelector([getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling.uuid);
  const getBehandlingVersjon = createSelector([getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling.versjon);
  const getBehandlingStatus = createSelector([getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling.status);
  const getBehandlingType = createSelector([getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling.type);

  const getBehandlingIsOnHold = createSelector([getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling.behandlingPaaVent);
  const getBehandlingOnHoldDate = createSelector([getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling.fristBehandlingPaaVent);
  const getBehandlingsresultat = createSelector([getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling.behandlingsresultat);
  const getBehandlingHenlagt = createSelector([getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling.behandlingHenlagt);

  const getBehandlingVenteArsakKode = createSelector([getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling.venteArsakKode);
  const getBehandlingAnsvarligSaksbehandler = createSelector(
    [getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling.ansvarligSaksbehandler,
  );

  // AKSJONSPUNKTER
  const getAksjonspunkter = createSelector([getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling.aksjonspunkter);
  const getOpenAksjonspunkter = createSelector(
    [getAksjonspunkter], (aksjonspunkter = []) => aksjonspunkter.filter((ap) => isAksjonspunktOpen(ap.status.kode)),
  );
  const isKontrollerRevurderingAksjonspunkOpen = createSelector(
    [getOpenAksjonspunkter], (openAksjonspunkter = []) => openAksjonspunkter
      .some((ap) => ap.definisjon.kode === aksjonspunktCodes.KONTROLLER_REVURDERINGSBEHANDLING_VARSEL_VED_UGUNST),
  );
  const hasBehandlingManualPaVent = createSelector(
    [getOpenAksjonspunkter], (openAksjonspunkter = []) => openAksjonspunkter.some((ap) => ap.definisjon.kode === aksjonspunktCodes.AUTO_MANUELT_SATT_PÅ_VENT),
  );

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

  const getAllMerknaderFraBeslutter = createSelector([getBehandlingStatus, getAksjonspunkter], (status, aksjonspunkter = []) => {
    let merknader = {};
    if (status && status.kode === behandlingStatus.BEHANDLING_UTREDES) {
      merknader = aksjonspunkter
        .reduce((obj, ap) => ({ ...obj, [ap.definisjon.kode]: { notAccepted: ap.toTrinnsBehandling && ap.toTrinnsBehandlingGodkjent === false } }), {});
    }
    return merknader;
  });

  return {
    getSelectedBehandling,
    isBehandlingInSync,
    hasReadOnlyBehandling,
    getBehandlingUuid,
    getBehandlingVersjon,
    getBehandlingStatus,
    getBehandlingType,
    getBehandlingIsOnHold,
    getBehandlingOnHoldDate,
    getBehandlingsresultat,
    getBehandlingHenlagt,
    getBehandlingVenteArsakKode,
    getBehandlingAnsvarligSaksbehandler,
    getAksjonspunkter,
    getOpenAksjonspunkter,
    isKontrollerRevurderingAksjonspunkOpen,
    hasBehandlingManualPaVent,
    getSoknad,
    getBehandlingHasSoknad,
    getBehandlingVilkar,
    getBehandlingVilkarCodes,
    isBehandlingStatusReadOnly,
    getAllMerknaderFraBeslutter,
  };
};

export default getCommonBehandlingSelectors;

import { createSelector } from 'reselect';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { arrayToObject } from '@fpsak-frontend/utils';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { DEFAULT_BEHANDLINGSPROSESS, behandlingspunktCodes } from '@fpsak-frontend/fp-felles';

const getCommonBehandlingsprosessSelectors = (getBehandlingspunkterProps, getAksjonspunkter, getBehandlingIsOnHold, getAllMerknaderFraBeslutter,
  hasReadOnlyBehandling, isBehandlingStatusReadOnly, getSelectedBehandlingspunktNavn, getOverrideBehandlingspunkter, getRettigheter) => {
    const getBehandlingspunkter = createSelector([getBehandlingspunkterProps], (bpProps = []) => bpProps.map(p => p.code));

    const getBehandlingspunkterStatus = createSelector(
      [getBehandlingspunkterProps], bpProps => arrayToObject(bpProps, bpProp => bpProp.code, bpProp => bpProp.status),
    );

    const getBehandlingspunkterTitleCodes = createSelector(
      [getBehandlingspunkterProps], bpProps => arrayToObject(bpProps, bpProp => bpProp.code, bpProp => bpProp.titleCode),
    );

    const getBehandlingspunktAksjonspunkterNames = createSelector(
      [getBehandlingspunkterProps], bpProps => arrayToObject(bpProps, bpProp => bpProp.code, bpProp => bpProp.apCodes),
    );

    const getBehandlingspunkterVilkar = createSelector(
      [getBehandlingspunkterProps], bpProps => arrayToObject(bpProps, bpProp => bpProp.code, bpProp => bpProp.vilkarene),
    );

    const getBehandlingspunktAksjonspunkter = createSelector(
      [getAksjonspunkter, getBehandlingspunktAksjonspunkterNames],
      (aksjonspunkter = [], behandlingspunktAksjonspunkterNames = {}) => {
        const valueFunction = bp => behandlingspunktAksjonspunkterNames[bp]
          .map(apCode => aksjonspunkter.find(ap => ap.definisjon.kode === apCode))
          .filter(ap => ap);
        return arrayToObject(Object.keys(behandlingspunktAksjonspunkterNames), bp => bp, valueFunction);
      },
    );

    const getBehandlingspunkterWithOpenAksjonspunkter = createSelector([getBehandlingspunktAksjonspunkter], (punkter = {}) => (
      Object.keys(punkter)
        .filter(p => punkter[p].some(ap => isAksjonspunktOpen(ap.status.kode) && ap.kanLoses))
    ));

    const getVedtakBehandlingspunkt = createSelector(
      [getBehandlingspunkter, getBehandlingspunkterStatus],
      (bps = [], bpStatus = {}) => bps.find(bp => bp === behandlingspunktCodes.VEDTAK && bpStatus[bp] !== vilkarUtfallType.IKKE_VURDERT),
    );

    const getSelectableBehandlingspunkter = createSelector(
      [getBehandlingspunkter, getBehandlingspunkterWithOpenAksjonspunkter, getBehandlingspunkterStatus, getOverrideBehandlingspunkter],
      (bps = [], bpsWithOpenAps = [], bpStatus = {}, overriddenBps = []) => bps
        .filter(bp => !(bpStatus[bp] === vilkarUtfallType.IKKE_VURDERT && !bpsWithOpenAps.includes(bp)) || overriddenBps.includes(bp)),
    );

    const getDefaultBehandlingspunkt = createSelector(
      [getVedtakBehandlingspunkt, getBehandlingspunkterWithOpenAksjonspunkter],
      (vedtakBehandlingspunkt, bpsWithOpenAps = []) => bpsWithOpenAps[0] || vedtakBehandlingspunkt,
    );

    const getSelectedBehandlingspunkt = createSelector(
      [getSelectableBehandlingspunkter, getDefaultBehandlingspunkt, getSelectedBehandlingspunktNavn],
      (selectableBps = [], defaultBehandlingspunkt = null, selectedBpNavn = null) => (selectedBpNavn === DEFAULT_BEHANDLINGSPROSESS
        ? selectableBps.find(bp => bp === defaultBehandlingspunkt)
        : selectableBps.find(bp => bp === selectedBpNavn)),
    );


    const getIsSelectedBehandlingspunktOverridden = createSelector(
      [getSelectedBehandlingspunkt, getOverrideBehandlingspunkter],
      (selectedBehandlingspunkt, overriddenBehandlingspunkter = []) => overriddenBehandlingspunkter.includes(selectedBehandlingspunkt),
    );

    const getSelectedBehandlingspunktStatus = createSelector(
      [getSelectedBehandlingspunkt, getBehandlingspunkterStatus],
      (selectedBehandlingspunkt, behandlingspunkterStatus = {}) => (behandlingspunkterStatus[selectedBehandlingspunkt]
        ? behandlingspunkterStatus[selectedBehandlingspunkt] : ''),
    );

    const getSelectedBehandlingspunktTitleCode = createSelector(
      [getSelectedBehandlingspunkt, getBehandlingspunkterTitleCodes],
      (selectedBehandlingspunkt, behandlingspunkterTitleCodes = {}) => (behandlingspunkterTitleCodes[selectedBehandlingspunkt]
        ? behandlingspunkterTitleCodes[selectedBehandlingspunkt] : {}),
    );

    const getSelectedBehandlingspunktAksjonspunkter = createSelector(
      [getSelectedBehandlingspunkt, getBehandlingspunktAksjonspunkter],
      (selectedBehandlingspunkt, behandlingspunktAksjonspunkter = {}) => (behandlingspunktAksjonspunkter[selectedBehandlingspunkt]
        ? behandlingspunktAksjonspunkter[selectedBehandlingspunkt] : []),
    );

    const getSelectedBehandlingspunktVilkar = createSelector(
      [getSelectedBehandlingspunkt, getBehandlingspunkterVilkar],
      (selectedBehandlingspunkt, behandlingspunktVilkar = {}) => (behandlingspunktVilkar[selectedBehandlingspunkt]
        ? behandlingspunktVilkar[selectedBehandlingspunkt] : []),
    );

    const getNotAcceptedByBeslutter = createSelector(
      [getSelectedBehandlingspunkt, getBehandlingspunktAksjonspunkterNames, getAllMerknaderFraBeslutter],
      (selectedBehandlingspunkt, aksjonspunkter = {}, merknaderFraBeslutter = {}) => {
        const ap = aksjonspunkter[selectedBehandlingspunkt];
        return ap !== undefined
          && ap.length > 0
          && !!merknaderFraBeslutter[ap[0]]
          && merknaderFraBeslutter[ap[0]].notAccepted;
      },
    );

    const findApStatus = punktAksjonspunkter => (punktAksjonspunkter.length > 0
      ? punktAksjonspunkter.some(ap => isAksjonspunktOpen(ap.status.kode) && ap.kanLoses) : false);

    const getAksjonspunkterOpenStatus = createSelector(
      [getBehandlingspunktAksjonspunkter, getOverrideBehandlingspunkter],
      (behandlingspunktAksjonspunkter, overriddenBehandlingspunkter) => arrayToObject(
        Object.keys(behandlingspunktAksjonspunkter), key => key,
        key => (overriddenBehandlingspunkter.includes(key) ? true : findApStatus(behandlingspunktAksjonspunkter[key])),
      ),
    );

    const hasNonActiveAksjonspunkterOrNonOverstyrbarVilkar = createSelector(
      [getSelectedBehandlingspunktAksjonspunkter, getSelectedBehandlingspunktVilkar],
      (aksjonspunkter, vilkarList) => aksjonspunkter.some(ap => !ap.erAktivt) || vilkarList.some(v => !v.overstyrbar),
    );

    const isSelectedBehandlingspunktReadOnly = createSelector(
      [getRettigheter, getBehandlingIsOnHold, hasReadOnlyBehandling, hasNonActiveAksjonspunkterOrNonOverstyrbarVilkar],
      (rettigheter, behandlingIsOnHold, isBehandlingReadOnly, hasNonActivOrNonOverstyrbar) => !rettigheter.writeAccess.isEnabled
        || behandlingIsOnHold || isBehandlingReadOnly || hasNonActivOrNonOverstyrbar,
    );

    const isSelectedBehandlingspunktOverrideReadOnly = createSelector(
      [getRettigheter, hasNonActiveAksjonspunkterOrNonOverstyrbarVilkar, isBehandlingStatusReadOnly],
      (rettigheter, hasNonActivOrNonOverstyrbar, isStatusReadOnly) => !rettigheter.kanOverstyreAccess.isEnabled
        || isStatusReadOnly || hasNonActivOrNonOverstyrbar,
    );

    const hasBehandlingspunktAtLeastOneOpenAksjonspunkt = createSelector(
      [getSelectedBehandlingspunktAksjonspunkter],
      (aksjonspunkter = []) => aksjonspunkter
        .filter(ap => ap.definisjon.kode !== aksjonspunktCodes.FORESLA_VEDTAK)
        .some(ap => isAksjonspunktOpen(ap.status.kode)),
    );

    const isBehandlingspunktAksjonspunkterSolvable = createSelector(
      [getSelectedBehandlingspunktAksjonspunkter], (aksjonspunkter = []) => aksjonspunkter.some(ap => ap.kanLoses),
    );

    const getBehandlingspunktAksjonspunkterCodes = createSelector(
      [getSelectedBehandlingspunktAksjonspunkter], (aksjonspunkter = []) => aksjonspunkter.map(ap => ap.definisjon.kode),
    );

    const isBehandlingspunkterAksjonspunkterNotSolvableOrVilkarIsOppfylt = createSelector(
      [getSelectedBehandlingspunktStatus, isBehandlingspunktAksjonspunkterSolvable],
      (status, isApSolvable = []) => !isApSolvable || vilkarUtfallType.OPPFYLT === status,
    );

    return {
      getBehandlingspunkter,
      getBehandlingspunkterStatus,
      getBehandlingspunkterTitleCodes,
      getBehandlingspunkterWithOpenAksjonspunkter,
      getDefaultBehandlingspunkt,
      getSelectedBehandlingspunkt,
      getIsSelectedBehandlingspunktOverridden,
      getSelectedBehandlingspunktStatus,
      getSelectedBehandlingspunktTitleCode,
      getSelectedBehandlingspunktAksjonspunkter,
      getSelectedBehandlingspunktVilkar,
      getNotAcceptedByBeslutter,
      getAksjonspunkterOpenStatus,
      hasNonActiveAksjonspunkterOrNonOverstyrbarVilkar,
      isSelectedBehandlingspunktReadOnly,
      isSelectedBehandlingspunktOverrideReadOnly,
      hasBehandlingspunktAtLeastOneOpenAksjonspunkt,
      isBehandlingspunktAksjonspunkterSolvable,
      getBehandlingspunktAksjonspunkterCodes,
      isBehandlingspunkterAksjonspunkterNotSolvableOrVilkarIsOppfylt,
    };
};

export default getCommonBehandlingsprosessSelectors;

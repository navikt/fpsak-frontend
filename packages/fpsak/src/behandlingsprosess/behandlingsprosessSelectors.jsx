import { createSelector } from 'reselect';

import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import { getFagsakYtelseType } from 'fagsak/fagsakSelectors';
import { getRettigheter } from 'navAnsatt/duck';
import { DEFAULT_BEHANDLINGSPROSESS } from 'app/paths';
import { arrayToObject } from 'utils/objectUtils';
import { isAksjonspunktOpen } from 'kodeverk/aksjonspunktStatus';
import vilkarUtfallType from 'kodeverk/vilkarUtfallType';
import fyt from 'kodeverk/fagsakYtelseType';
import {
  getBehandlingIsOnHold, getAllMerknaderFraBeslutter, getBehandlingType, getBehandlingVilkar, getAksjonspunkter, getBehandlingsresultat,
  getBehandlingInnsynResultatType, getBehandlingResultatstruktur, getStonadskontoer, hasReadOnlyBehandling, isBehandlingStatusReadOnly,
} from 'behandling/behandlingSelectors';
import { getFeatureToggleSimulering } from 'app/duck';
import behandlingspunktCodes from './behandlingspunktCodes';
import createEngangsstonadBpProps from './definition/engangsstonadBpDefinition';
import createForeldrepengerBpProps from './definition/foreldrepengerBpDefinition';
import { getSelectedBehandlingspunktNavn, getOverrideBehandlingspunkter } from './duck';

// Kun eksportert for test. Ikke bruk andre steder!
export const getBehandlingspunkterProps = createSelector(
  [getFagsakYtelseType, getBehandlingType, getBehandlingVilkar, getAksjonspunkter, getBehandlingsresultat,
    getBehandlingInnsynResultatType, getBehandlingResultatstruktur, getStonadskontoer, getFeatureToggleSimulering],
  (fagsakYtelseType, behandlingType, vilkar, aksjonspunkter, behandlingsresultat,
    innsynResultatType, resultatstruktur, stonadskontoer, featureToggleSimulering) => {
    if (!behandlingType) {
      return undefined;
    }

    const builderData = {
      behandlingType,
      vilkar,
      aksjonspunkter,
      behandlingsresultat,
      innsynResultatType,
      resultatstruktur,
      stonadskontoer,
      featureToggleSimulering,
    };
    return fagsakYtelseType.kode === fyt.ENGANGSSTONAD
      ? createEngangsstonadBpProps(builderData) : createForeldrepengerBpProps(builderData);
  },
);

export const getBehandlingspunkter = createSelector([getBehandlingspunkterProps], (bpProps = []) => bpProps.map(p => p.code));

export const getBehandlingspunkterStatus = createSelector(
  [getBehandlingspunkterProps], bpProps => arrayToObject(bpProps, bpProp => bpProp.code, bpProp => bpProp.status),
);

export const getBehandlingspunkterTitleCodes = createSelector(
  [getBehandlingspunkterProps], bpProps => arrayToObject(bpProps, bpProp => bpProp.code, bpProp => bpProp.titleCode),
);

const getBehandlingspunktAksjonspunkterNames = createSelector(
  [getBehandlingspunkterProps], bpProps => arrayToObject(bpProps, bpProp => bpProp.code, bpProp => bpProp.apCodes),
);

const getBehandlingspunkterVilkar = createSelector(
  [getBehandlingspunkterProps], bpProps => arrayToObject(bpProps, bpProp => bpProp.code, bpProp => bpProp.vilkarene),
);

// Kun eksportert for test. Ikke bruk andre steder!
export const getBehandlingspunktAksjonspunkter = createSelector(
  [getAksjonspunkter, getBehandlingspunktAksjonspunkterNames],
  (aksjonspunkter = [], behandlingspunktAksjonspunkterNames = {}) => {
    const valueFunction = bp => behandlingspunktAksjonspunkterNames[bp]
      .map(apCode => aksjonspunkter.find(ap => ap.definisjon.kode === apCode))
      .filter(ap => ap);
    return arrayToObject(Object.keys(behandlingspunktAksjonspunkterNames), bp => bp, valueFunction);
  },
);

export const getBehandlingspunkterWithOpenAksjonspunkter = createSelector([getBehandlingspunktAksjonspunkter], (punkter = {}) => (
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

export const getDefaultBehandlingspunkt = createSelector(
  [getVedtakBehandlingspunkt, getBehandlingspunkterWithOpenAksjonspunkter],
  (vedtakBehandlingspunkt, bpsWithOpenAps = []) => bpsWithOpenAps[0] || vedtakBehandlingspunkt,
);

export const getSelectedBehandlingspunkt = createSelector(
  [getSelectableBehandlingspunkter, getDefaultBehandlingspunkt, getSelectedBehandlingspunktNavn],
  (selectableBps = [], defaultBehandlingspunkt = null, selectedBpNavn = null) => (selectedBpNavn === DEFAULT_BEHANDLINGSPROSESS
    ? selectableBps.find(bp => bp === defaultBehandlingspunkt)
    : selectableBps.find(bp => bp === selectedBpNavn)),
);

export const getIsSelectedBehandlingspunktOverridden = createSelector(
  [getSelectedBehandlingspunkt, getOverrideBehandlingspunkter],
  (selectedBehandlingspunkt, overriddenBehandlingspunkter = []) => overriddenBehandlingspunkter.includes(selectedBehandlingspunkt),
);

export const getSelectedBehandlingspunktStatus = createSelector(
  [getSelectedBehandlingspunkt, getBehandlingspunkterStatus],
  (selectedBehandlingspunkt, behandlingspunkterStatus = {}) => (behandlingspunkterStatus[selectedBehandlingspunkt]
    ? behandlingspunkterStatus[selectedBehandlingspunkt] : ''),
);

export const getSelectedBehandlingspunktTitleCode = createSelector(
  [getSelectedBehandlingspunkt, getBehandlingspunkterTitleCodes],
  (selectedBehandlingspunkt, behandlingspunkterTitleCodes = {}) => (behandlingspunkterTitleCodes[selectedBehandlingspunkt]
    ? behandlingspunkterTitleCodes[selectedBehandlingspunkt] : {}),
);

export const getSelectedBehandlingspunktAksjonspunkter = createSelector(
  [getSelectedBehandlingspunkt, getBehandlingspunktAksjonspunkter],
  (selectedBehandlingspunkt, behandlingspunktAksjonspunkter = {}) => (behandlingspunktAksjonspunkter[selectedBehandlingspunkt]
    ? behandlingspunktAksjonspunkter[selectedBehandlingspunkt] : []),
);

export const getSelectedBehandlingspunktVilkar = createSelector(
  [getSelectedBehandlingspunkt, getBehandlingspunkterVilkar],
  (selectedBehandlingspunkt, behandlingspunktVilkar = {}) => (behandlingspunktVilkar[selectedBehandlingspunkt]
    ? behandlingspunktVilkar[selectedBehandlingspunkt] : []),
);

export const getNotAcceptedByBeslutter = createSelector(
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

export const getAksjonspunkterOpenStatus = createSelector(
  [getBehandlingspunktAksjonspunkter, getOverrideBehandlingspunkter],
  (behandlingspunktAksjonspunkter, overriddenBehandlingspunkter) => arrayToObject(
    Object.keys(behandlingspunktAksjonspunkter), key => key,
    key => (overriddenBehandlingspunkter.includes(key) ? true : findApStatus(behandlingspunktAksjonspunkter[key])),
  ),
);

export const hasNonActiveAksjonspunkterOrNonOverstyrbarVilkar = createSelector(
  [getSelectedBehandlingspunktAksjonspunkter, getSelectedBehandlingspunktVilkar],
  (aksjonspunkter, vilkarList) => aksjonspunkter.some(ap => !ap.erAktivt) || vilkarList.some(v => !v.overstyrbar),
);

export const isSelectedBehandlingspunktReadOnly = createSelector(
  [getRettigheter, getBehandlingIsOnHold, hasReadOnlyBehandling, hasNonActiveAksjonspunkterOrNonOverstyrbarVilkar],
  (rettigheter, behandlingIsOnHold, isBehandlingReadOnly, hasNonActivOrNonOverstyrbar) => !rettigheter.writeAccess.isEnabled
    || behandlingIsOnHold || isBehandlingReadOnly || hasNonActivOrNonOverstyrbar,
);

export const isSelectedBehandlingspunktOverrideReadOnly = createSelector(
  [getRettigheter, hasNonActiveAksjonspunkterOrNonOverstyrbarVilkar, isBehandlingStatusReadOnly],
  (rettigheter, hasNonActivOrNonOverstyrbar, isStatusReadOnly) => !rettigheter.kanOverstyreAccess.isEnabled || isStatusReadOnly || hasNonActivOrNonOverstyrbar,
);

export const hasBehandlingspunktAtLeastOneOpenAksjonspunkt = createSelector(
  [getSelectedBehandlingspunktAksjonspunkter],
  (aksjonspunkter = []) => aksjonspunkter
    .filter(ap => ap.definisjon.kode !== aksjonspunktCodes.FORESLA_VEDTAK)
    .some(ap => isAksjonspunktOpen(ap.status.kode)),
);

export const isBehandlingspunktAksjonspunkterSolvable = createSelector(
  [getSelectedBehandlingspunktAksjonspunkter], (aksjonspunkter = []) => aksjonspunkter.some(ap => ap.kanLoses),
);

export const getBehandlingspunktAksjonspunkterCodes = createSelector(
  [getSelectedBehandlingspunktAksjonspunkter], (aksjonspunkter = []) => aksjonspunkter.map(ap => ap.definisjon.kode),
);

export const isBehandlingspunkterAksjonspunkterNotSolvableOrVilkarIsOppfylt = createSelector(
  [getSelectedBehandlingspunktStatus, isBehandlingspunktAksjonspunkterSolvable],
  (status, isApSolvable = []) => !isApSolvable || vilkarUtfallType.OPPFYLT === status,
);

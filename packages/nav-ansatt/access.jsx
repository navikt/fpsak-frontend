import behandlingStatusCode from 'kodeverk/behandlingStatus';
import fagsakYtelseType from 'kodeverk/fagsakYtelseType';
import fagsakStatusCode from 'kodeverk/fagsakStatus';
import { without } from 'utils/arrayUtils';
import { isAksjonspunktOpen } from 'kodeverk/aksjonspunktStatus';
import { isObject } from 'utils/objectUtils';
import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import BehandlingType from 'kodeverk/behandlingType';

const allFagsakStatuses = Object.values(fagsakStatusCode);
const allBehandlingStatuses = Object.values(behandlingStatusCode);

const kanVeilede = (navAnsatt = {}) => navAnsatt.kanVeilede;
const kanSaksbehandle = (navAnsatt = {}) => navAnsatt.kanSaksbehandle;
const kanBeslutte = (navAnsatt = {}) => kanSaksbehandle(navAnsatt) && navAnsatt.kanBeslutte;
const kanOverstyre = (navAnsatt = {}) => kanSaksbehandle(navAnsatt) && navAnsatt.kanOverstyre;

const accessibleFor = validNavAnsattPredicates => navAnsatt => validNavAnsattPredicates.some(predicate => predicate(navAnsatt));

const enabledFor = (validFagsakStauses, validBehandlingStatuses) => (fagsakStatus = {}, behandlingStatus = {}) => (
  validFagsakStauses.includes(fagsakStatus.kode) && validBehandlingStatuses.includes(behandlingStatus.kode)
);

const accessSelector = (validNavAnsattPredicates, validFagsakStatuses, validBehandlingStatuses) => (navAnsatt, fagsakStatus, behandlingStatus) => {
  if (kanVeilede(navAnsatt)) {
    return {
      employeeHasAccess: true,
      isEnabled: false,
    };
  }
  const employeeHasAccess = accessibleFor(validNavAnsattPredicates)(navAnsatt);
  const isEnabled = employeeHasAccess && enabledFor(validFagsakStatuses, validBehandlingStatuses)(fagsakStatus, behandlingStatus);
  return { employeeHasAccess, isEnabled };
};

export const writeAccess = accessSelector(
  [kanSaksbehandle],
  [fagsakStatusCode.OPPRETTET, fagsakStatusCode.UNDER_BEHANDLING],
  [behandlingStatusCode.OPPRETTET, behandlingStatusCode.BEHANDLING_UTREDES],
);

export const henleggBehandlingAccess = accessSelector(
  [kanSaksbehandle],
  [fagsakStatusCode.UNDER_BEHANDLING],
  [behandlingStatusCode.OPPRETTET, behandlingStatusCode.BEHANDLING_UTREDES],
);

const settBehandlingPaVentAccessSelector = (navAnsatt, soknad, aksjonspunkter, type) => {
  const hasSoknad = isObject(soknad);
  const isInnhentSoknadopplysningerSteg = aksjonspunkter
    ? aksjonspunkter.some(ap => isAksjonspunktOpen(ap.status.kode) && ap.definisjon.kode === aksjonspunktCodes.REGISTRER_PAPIRSOKNAD_ENGANGSSTONAD) : false;
  const isBehandlingAvKlageEllerInnsyn = type
    ? type.kode === BehandlingType.KLAGE || type.kode === BehandlingType.DOKUMENTINNSYN
    : false;

  if (hasSoknad || isInnhentSoknadopplysningerSteg || isBehandlingAvKlageEllerInnsyn) {
    return accessSelector([kanSaksbehandle], [fagsakStatusCode.UNDER_BEHANDLING], [behandlingStatusCode.OPPRETTET, behandlingStatusCode.BEHANDLING_UTREDES,
      behandlingStatusCode.FORESLA_VEDTAK]);
  }
  return accessSelector([kanSaksbehandle, kanVeilede], [], []);
};

export const settBehandlingPaVentAccess = (
  navAnsatt, fagsakStatus, behandlingStatus, soknad, aksjonspunkter, type,
) => settBehandlingPaVentAccessSelector(navAnsatt, soknad, aksjonspunkter, type)(navAnsatt, fagsakStatus, behandlingStatus);

export const byttBehandlendeEnhetAccess = accessSelector(
  [kanSaksbehandle],
  [fagsakStatusCode.UNDER_BEHANDLING],
  [behandlingStatusCode.OPPRETTET, behandlingStatusCode.BEHANDLING_UTREDES],
);

const opprettRevurderingAccessSelector = (selectedFagsak) => {
  if (!selectedFagsak || !selectedFagsak.kanRevurderingOpprettes) {
    return accessSelector([kanSaksbehandle], [], []);
  }

  // PKMANTIS-1796/PK-54777 Workaround mens endelige regler for opprettelse av behandling avklares
  const fagsakStatus = selectedFagsak.sakstype.kode === fagsakYtelseType.ENGANGSSTONAD
    ? [fagsakStatusCode.AVSLUTTET]
    : [fagsakStatusCode.OPPRETTET, fagsakStatusCode.UNDER_BEHANDLING, fagsakStatusCode.LOPENDE, fagsakStatusCode.AVSLUTTET];
  return accessSelector(
    [kanSaksbehandle],
    fagsakStatus,
    [behandlingStatusCode.AVSLUTTET, behandlingStatusCode.IVERKSETTER_VEDTAK],
  );
};

export const opprettRevurderingAccess = (navAnsatt, fagsakStatus, behandlingStatus, selectedFagsak) => (
  opprettRevurderingAccessSelector(selectedFagsak)(navAnsatt, fagsakStatus, behandlingStatus)
);

export const opprettNyForstegangsBehandlingAccess = accessSelector(
  [kanSaksbehandle],
  [fagsakStatusCode.AVSLUTTET],
  [behandlingStatusCode.AVSLUTTET],
);
const infotrygdSelector = selectedFagsak => ({
  employeeHasAccess: true,
  isEnabled: selectedFagsak && selectedFagsak.skalBehandlesAvInfotrygd,
});

export const sjekkOmSkalTilInfotrygdAccess = selectedFagsak => infotrygdSelector(selectedFagsak);

export const gjenopptaBehandlingAccess = accessSelector(
  [kanSaksbehandle],
  [fagsakStatusCode.UNDER_BEHANDLING],
  [behandlingStatusCode.BEHANDLING_UTREDES],
);

const opneBehandlingForEndringerAccessSelector = (behandlingType, selectedFagsak) => {
  if (!behandlingType
    || behandlingType.kode !== BehandlingType.REVURDERING
    || selectedFagsak.sakstype.kode === fagsakYtelseType.ENGANGSSTONAD) {
    return accessSelector([kanSaksbehandle], [], []);
  }

  return accessSelector(
    [kanSaksbehandle],
    [fagsakStatusCode.UNDER_BEHANDLING],
    [behandlingStatusCode.BEHANDLING_UTREDES],
  );
};

export const opneBehandlingForEndringerAccess = (behandlingType, navAnsatt, fagsakStatus, behandlingStatus, selectedFagsak) => (
  opneBehandlingForEndringerAccessSelector(behandlingType, selectedFagsak)(navAnsatt, fagsakStatus, behandlingStatus)
);

const godkjenningsFaneAccessSelector = (navAnsatt, ansvarligSaksbehandler) => {
  if (ansvarligSaksbehandler && navAnsatt.brukernavn.toUpperCase() === ansvarligSaksbehandler.toUpperCase()) {
    return accessSelector([kanBeslutte], [], []);
  }

  return accessSelector([kanBeslutte], [fagsakStatusCode.UNDER_BEHANDLING], [behandlingStatusCode.FATTER_VEDTAK]);
};

export const fraBeslutterFaneAccess = accessSelector(
  [kanSaksbehandle, kanBeslutte],
  [fagsakStatusCode.UNDER_BEHANDLING],
  [behandlingStatusCode.BEHANDLING_UTREDES],
);

export const kanOverstyreAccess = accessSelector(
  [kanOverstyre],
  [fagsakStatusCode.UNDER_BEHANDLING],
  [behandlingStatusCode.BEHANDLING_UTREDES],
);

const sendMeldingAccessSelector = (navAnsatt) => {
  let validFagsakStatuses = allFagsakStatuses;
  let validBehandlingStatuses = allBehandlingStatuses;

  if (kanBeslutte(navAnsatt) || kanSaksbehandle(navAnsatt)) {
    validBehandlingStatuses = without(
      behandlingStatusCode.FATTER_VEDTAK,
      behandlingStatusCode.IVERKSETTER_VEDTAK,
      behandlingStatusCode.AVSLUTTET,
    )(allBehandlingStatuses);

    validFagsakStatuses = without(fagsakStatusCode.AVSLUTTET, fagsakStatusCode.LOPENDE)(allFagsakStatuses);
  }

  return accessSelector([kanSaksbehandle], validFagsakStatuses, validBehandlingStatuses);
};

export const godkjenningsFaneAccess = (
  navAnsatt, fagsakStatus, behandlingStatus, ansvarligSaksbehandler,
) => godkjenningsFaneAccessSelector(navAnsatt, ansvarligSaksbehandler)(navAnsatt, fagsakStatus, behandlingStatus);

export const sendMeldingAccess = (navAnsatt, fagsakStatus, behandlingStatus) => sendMeldingAccessSelector(navAnsatt)(navAnsatt, fagsakStatus, behandlingStatus);

export const allAccessRights = (navAnsatt, fagsakStatus, behandlingStatus, soknad, aksjonspunkter, type, ansvarligSaksbehandler, selectedFagsak) => ({
  writeAccess: writeAccess(navAnsatt, fagsakStatus, behandlingStatus),
  henleggBehandlingAccess: henleggBehandlingAccess(navAnsatt, fagsakStatus, behandlingStatus),
  settBehandlingPaVentAccess: settBehandlingPaVentAccess(navAnsatt, fagsakStatus, behandlingStatus, soknad, aksjonspunkter, type),
  byttBehandlendeEnhetAccess: byttBehandlendeEnhetAccess(navAnsatt, fagsakStatus, behandlingStatus),
  fraBeslutterFaneAccess: fraBeslutterFaneAccess(navAnsatt, fagsakStatus, behandlingStatus),
  opprettRevurderingAccess: opprettRevurderingAccess(navAnsatt, fagsakStatus, behandlingStatus, selectedFagsak),
  opprettNyForstegangsBehandlingAccess: opprettNyForstegangsBehandlingAccess(navAnsatt, fagsakStatus, behandlingStatus),
  gjenopptaBehandlingAccess: gjenopptaBehandlingAccess(navAnsatt, fagsakStatus, behandlingStatus),
  opneBehandlingForEndringerAccess: opneBehandlingForEndringerAccess(type, navAnsatt, fagsakStatus, behandlingStatus, selectedFagsak),
  godkjenningsFaneAccess: godkjenningsFaneAccess(navAnsatt, fagsakStatus, behandlingStatus, ansvarligSaksbehandler),
  kanOverstyreAccess: kanOverstyreAccess(navAnsatt, fagsakStatus, behandlingStatus),
  sendMeldingAccess: sendMeldingAccess(navAnsatt, fagsakStatus, behandlingStatus),
  ikkeVisOpprettNyBehandling: sjekkOmSkalTilInfotrygdAccess(selectedFagsak),
});

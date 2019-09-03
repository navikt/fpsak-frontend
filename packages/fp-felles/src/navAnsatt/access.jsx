import behandlingStatusCode from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import fagsakStatusCode from '@fpsak-frontend/kodeverk/src/fagsakStatus';
import { isObject, without } from '@fpsak-frontend/utils';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';

const allFagsakStatuses = Object.values(fagsakStatusCode);
const allBehandlingStatuses = Object.values(behandlingStatusCode);

const kanVeilede = (navAnsatt = {}) => navAnsatt.kanVeilede;
const kanSaksbehandle = (navAnsatt = {}) => navAnsatt.kanSaksbehandle;
const kanBeslutte = (navAnsatt = {}) => kanSaksbehandle(navAnsatt) && navAnsatt.kanBeslutte;
const kanOverstyre = (navAnsatt = {}) => kanSaksbehandle(navAnsatt) && navAnsatt.kanOverstyre;
const isBehandlingAvTilbakekreving = (type) => (type ? type.kode === BehandlingType.TILBAKEKREVING : false);

const accessibleFor = (validNavAnsattPredicates) => (navAnsatt) => validNavAnsattPredicates.some((predicate) => predicate(navAnsatt));

const enabledFor = (validFagsakStauses, validBehandlingStatuses) => (fagsakStatus = {}, behandlingStatus = {}, isTilbakekrevingBehandling) => (
  (isTilbakekrevingBehandling || validFagsakStauses.includes(fagsakStatus.kode))
  && validBehandlingStatuses.includes(behandlingStatus.kode)
);

const accessSelector = (validNavAnsattPredicates, validFagsakStatuses, validBehandlingStatuses) => (navAnsatt,
  fagsakStatus, behandlingStatus, type) => {
  if (kanVeilede(navAnsatt)) {
    return {
      employeeHasAccess: true,
      isEnabled: false,
    };
  }
  const employeeHasAccess = accessibleFor(validNavAnsattPredicates)(navAnsatt);
  const isEnabled = employeeHasAccess
    && (enabledFor(validFagsakStatuses, validBehandlingStatuses)(fagsakStatus, behandlingStatus, isBehandlingAvTilbakekreving(type)));
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
    ? aksjonspunkter.some((ap) => isAksjonspunktOpen(ap.status.kode) && ap.definisjon.kode === aksjonspunktCodes.REGISTRER_PAPIRSOKNAD_ENGANGSSTONAD) : false;
  const isBehandlingAvKlageEllerInnsynEllerTilbakekreving = type
    ? type.kode === BehandlingType.KLAGE || type.kode === BehandlingType.DOKUMENTINNSYN || type.kode === BehandlingType.TILBAKEKREVING
    : false;

  if (hasSoknad || isInnhentSoknadopplysningerSteg || isBehandlingAvKlageEllerInnsynEllerTilbakekreving) {
    return accessSelector([kanSaksbehandle], [fagsakStatusCode.UNDER_BEHANDLING], [behandlingStatusCode.OPPRETTET, behandlingStatusCode.BEHANDLING_UTREDES,
      behandlingStatusCode.FORESLA_VEDTAK]);
  }
  return accessSelector([kanSaksbehandle, kanVeilede], [], []);
};

export const settBehandlingPaVentAccess = (
  navAnsatt, fagsakStatus, behandlingStatus, soknad, aksjonspunkter, type,
) => settBehandlingPaVentAccessSelector(navAnsatt, soknad, aksjonspunkter, type)(navAnsatt, fagsakStatus, behandlingStatus, type);

export const byttBehandlendeEnhetAccess = accessSelector(
  [kanSaksbehandle],
  [fagsakStatusCode.UNDER_BEHANDLING],
  [behandlingStatusCode.OPPRETTET, behandlingStatusCode.BEHANDLING_UTREDES],
);

const opprettRevurderingAccessSelector = (kanRevurderingOpprettes, sakstype) => {
  if (!kanRevurderingOpprettes) {
    return accessSelector([kanSaksbehandle], [], []);
  }

  // PKMANTIS-1796/PK-54777 Workaround mens endelige regler for opprettelse av behandling avklares
  const fagsakStatus = sakstype.kode === fagsakYtelseType.ENGANGSSTONAD
    ? [fagsakStatusCode.AVSLUTTET]
    : [fagsakStatusCode.OPPRETTET, fagsakStatusCode.UNDER_BEHANDLING, fagsakStatusCode.LOPENDE, fagsakStatusCode.AVSLUTTET];
  return accessSelector(
    [kanSaksbehandle],
    fagsakStatus,
    [behandlingStatusCode.AVSLUTTET, behandlingStatusCode.IVERKSETTER_VEDTAK],
  );
};

export const opprettRevurderingAccess = (navAnsatt, fagsakStatus, behandlingStatus, kanRevurderingOpprettes, sakstype, type) => (
  opprettRevurderingAccessSelector(kanRevurderingOpprettes, sakstype)(navAnsatt, fagsakStatus, behandlingStatus, type)
);

export const opprettNyForstegangsBehandlingAccess = accessSelector(
  [kanSaksbehandle],
  [fagsakStatusCode.AVSLUTTET],
  [behandlingStatusCode.AVSLUTTET],
);
const infotrygdSelector = (skalBehandlesAvInfotrygd) => ({
  employeeHasAccess: true,
  isEnabled: skalBehandlesAvInfotrygd,
});

export const sjekkOmSkalTilInfotrygdAccess = (skalBehandlesAvInfotrygd) => infotrygdSelector(skalBehandlesAvInfotrygd);

export const gjenopptaBehandlingAccess = accessSelector(
  [kanSaksbehandle],
  [fagsakStatusCode.UNDER_BEHANDLING],
  [behandlingStatusCode.BEHANDLING_UTREDES],
);

const opneBehandlingForEndringerAccessSelector = (behandlingType, sakstype) => {
  if (!behandlingType
    || behandlingType.kode !== BehandlingType.REVURDERING
    || sakstype.kode === fagsakYtelseType.ENGANGSSTONAD) {
    return accessSelector([kanSaksbehandle], [], []);
  }

  return accessSelector(
    [kanSaksbehandle],
    [fagsakStatusCode.UNDER_BEHANDLING],
    [behandlingStatusCode.BEHANDLING_UTREDES],
  );
};

export const opneBehandlingForEndringerAccess = (behandlingType,
  navAnsatt, fagsakStatus, behandlingStatus, sakstype) => (
  opneBehandlingForEndringerAccessSelector(behandlingType, sakstype)(navAnsatt, fagsakStatus, behandlingStatus, behandlingType)
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
  navAnsatt, fagsakStatus, behandlingStatus, ansvarligSaksbehandler, type,
) => godkjenningsFaneAccessSelector(navAnsatt, ansvarligSaksbehandler)(navAnsatt, fagsakStatus, behandlingStatus, type);

export const sendMeldingAccess = (navAnsatt, fagsakStatus, behandlingStatus, type) => sendMeldingAccessSelector(navAnsatt)(
  navAnsatt, fagsakStatus, behandlingStatus, type,
);

export const allAccessRights = (navAnsatt, fagsakStatus, kanRevurderingOpprettes, skalBehandlesAvInfotrygd,
  sakstype, behandlingStatus, soknad, aksjonspunkter, behandlingType, ansvarligSaksbehandler) => ({
  writeAccess: writeAccess(navAnsatt, fagsakStatus, behandlingStatus, behandlingType),
  henleggBehandlingAccess: henleggBehandlingAccess(navAnsatt, fagsakStatus, behandlingStatus, behandlingType),
  settBehandlingPaVentAccess: settBehandlingPaVentAccess(navAnsatt, fagsakStatus, behandlingStatus, soknad, aksjonspunkter, behandlingType),
  byttBehandlendeEnhetAccess: byttBehandlendeEnhetAccess(navAnsatt, fagsakStatus, behandlingStatus, behandlingType),
  fraBeslutterFaneAccess: fraBeslutterFaneAccess(navAnsatt, fagsakStatus, behandlingStatus, behandlingType),
  opprettRevurderingAccess: opprettRevurderingAccess(navAnsatt, fagsakStatus, behandlingStatus, kanRevurderingOpprettes, sakstype, behandlingType),
  opprettNyForstegangsBehandlingAccess: opprettNyForstegangsBehandlingAccess(navAnsatt, fagsakStatus, behandlingStatus, behandlingType),
  gjenopptaBehandlingAccess: gjenopptaBehandlingAccess(navAnsatt, fagsakStatus, behandlingStatus, behandlingType),
  opneBehandlingForEndringerAccess: opneBehandlingForEndringerAccess(behandlingType, navAnsatt, fagsakStatus, behandlingStatus, sakstype),
  godkjenningsFaneAccess: godkjenningsFaneAccess(navAnsatt, fagsakStatus, behandlingStatus, ansvarligSaksbehandler, behandlingType),
  kanOverstyreAccess: kanOverstyreAccess(navAnsatt, fagsakStatus, behandlingStatus, behandlingType),
  sendMeldingAccess: sendMeldingAccess(navAnsatt, fagsakStatus, behandlingStatus, behandlingType),
  ikkeVisOpprettNyBehandling: sjekkOmSkalTilInfotrygdAccess(skalBehandlesAvInfotrygd),
});

import behandlingStatusCode from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import fagsakStatusCode from '@fpsak-frontend/kodeverk/src/fagsakStatus';
import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { NavAnsatt, Kodeverk } from '@fpsak-frontend/types';

// TODO (TOR) FLytt alt dette til server

const kanVeilede = (navAnsatt) => navAnsatt && navAnsatt.kanVeilede;
const kanSaksbehandle = (navAnsatt) => navAnsatt && navAnsatt.kanSaksbehandle;
const isBehandlingAvTilbakekreving = (type) => (type
  ? (type.kode === BehandlingType.TILBAKEKREVING || type.kode === BehandlingType.TILBAKEKREVING_REVURDERING) : false);

const accessibleFor = (validNavAnsattPredicates) => (navAnsatt) => validNavAnsattPredicates.some((predicate) => predicate(navAnsatt));

const enabledFor = (validFagsakStauses, validBehandlingStatuses) => (fagsakStatus, behandlingStatus, isTilbakekrevingBehandling) => (
  (isTilbakekrevingBehandling || (fagsakStatus && validFagsakStauses.includes(fagsakStatus.kode)))
  && (behandlingStatus && validBehandlingStatuses.includes(behandlingStatus.kode))
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

export const henleggBehandlingAccess = accessSelector(
  [kanSaksbehandle],
  [fagsakStatusCode.UNDER_BEHANDLING],
  [behandlingStatusCode.OPPRETTET, behandlingStatusCode.BEHANDLING_UTREDES],
);

const settBehandlingPaVentAccessSelector = (navAnsatt, harSoknad, erIInnhentSoknadopplysningerSteg, type) => {
  const isBehandlingAvKlageEllerInnsynEllerTilbakekreving = type
    ? type.kode === BehandlingType.KLAGE || type.kode === BehandlingType.DOKUMENTINNSYN
      || type.kode === BehandlingType.TILBAKEKREVING || type.kode === BehandlingType.TILBAKEKREVING_REVURDERING
    : false;

  if (harSoknad || erIInnhentSoknadopplysningerSteg || isBehandlingAvKlageEllerInnsynEllerTilbakekreving) {
    return accessSelector([kanSaksbehandle], [fagsakStatusCode.UNDER_BEHANDLING], [behandlingStatusCode.OPPRETTET, behandlingStatusCode.BEHANDLING_UTREDES,
      behandlingStatusCode.FORESLA_VEDTAK]);
  }
  return accessSelector([kanSaksbehandle, kanVeilede], [], []);
};

export const settBehandlingPaVentAccess = (
  navAnsatt, fagsakStatus, behandlingStatus, harSoknad, erIInnhentSoknadopplysningerSteg, type,
) => settBehandlingPaVentAccessSelector(navAnsatt, harSoknad, erIInnhentSoknadopplysningerSteg, type)(navAnsatt, fagsakStatus, behandlingStatus, type);

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

export const opneBehandlingForEndringerAccess = (
  behandlingType: Kodeverk,
  navAnsatt: NavAnsatt,
  fagsakStatus: Kodeverk,
  behandlingStatus: Kodeverk,
  sakstype: Kodeverk,
) => (
  opneBehandlingForEndringerAccessSelector(behandlingType, sakstype)(navAnsatt, fagsakStatus, behandlingStatus, behandlingType)
);

export const allMenuAccessRights = (
  navAnsatt: NavAnsatt,
  fagsakStatus: Kodeverk,
  kanRevurderingOpprettes: boolean,
  skalBehandlesAvInfotrygd: boolean,
  sakstype: Kodeverk,
  behandlingStatus: Kodeverk,
  harSoknad: boolean,
  erIInnhentSoknadopplysningerSteg: boolean,
  behandlingType: Kodeverk,
) => ({
  henleggBehandlingAccess: henleggBehandlingAccess(navAnsatt, fagsakStatus, behandlingStatus, behandlingType),
  settBehandlingPaVentAccess: settBehandlingPaVentAccess(navAnsatt, fagsakStatus, behandlingStatus, harSoknad,
    erIInnhentSoknadopplysningerSteg, behandlingType),
  byttBehandlendeEnhetAccess: byttBehandlendeEnhetAccess(navAnsatt, fagsakStatus, behandlingStatus, behandlingType),
  opprettRevurderingAccess: opprettRevurderingAccess(navAnsatt, fagsakStatus, behandlingStatus, kanRevurderingOpprettes, sakstype, behandlingType),
  opprettNyForstegangsBehandlingAccess: opprettNyForstegangsBehandlingAccess(navAnsatt, fagsakStatus, behandlingStatus, behandlingType),
  gjenopptaBehandlingAccess: gjenopptaBehandlingAccess(navAnsatt, fagsakStatus, behandlingStatus, behandlingType),
  opneBehandlingForEndringerAccess: opneBehandlingForEndringerAccess(behandlingType, navAnsatt, fagsakStatus, behandlingStatus, sakstype),
  ikkeVisOpprettNyBehandling: sjekkOmSkalTilInfotrygdAccess(skalBehandlesAvInfotrygd),
});

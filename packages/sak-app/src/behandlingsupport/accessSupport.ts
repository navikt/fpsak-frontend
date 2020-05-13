import behandlingStatusCode from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import fagsakStatusCode from '@fpsak-frontend/kodeverk/src/fagsakStatus';
import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { without } from '@fpsak-frontend/utils';
import { NavAnsatt, Kodeverk } from '@fpsak-frontend/types';

// TODO (TOR) Denne bør erstattast av ein rest-tjeneste

const allFagsakStatuses = Object.values(fagsakStatusCode);
const allBehandlingStatuses = Object.values(behandlingStatusCode);

const kanVeilede = (navAnsatt: NavAnsatt) => navAnsatt && navAnsatt.kanVeilede;
const kanSaksbehandle = (navAnsatt: NavAnsatt) => navAnsatt && navAnsatt.kanSaksbehandle;
const kanBeslutte = (navAnsatt: NavAnsatt) => kanSaksbehandle(navAnsatt) && navAnsatt.kanBeslutte;
const isBehandlingAvTilbakekreving = (type) => (type
  ? (type.kode === BehandlingType.TILBAKEKREVING || type.kode === BehandlingType.TILBAKEKREVING_REVURDERING) : false);

const accessibleFor = (validNavAnsattPredicates) => (navAnsatt) => validNavAnsattPredicates.some((predicate) => predicate(navAnsatt));

const enabledFor = (validFagsakStauses, validBehandlingStatuses) => (fagsakStatus: Kodeverk, behandlingStatus: Kodeverk, isTilbakekrevingBehandling) => (
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

const godkjenningsFaneAccessSelector = (navAnsatt, ansvarligSaksbehandler) => {
  if (ansvarligSaksbehandler && navAnsatt.brukernavn.toUpperCase() === ansvarligSaksbehandler.toUpperCase()) {
    return accessSelector([kanBeslutte], [], []);
  }

  return accessSelector([kanBeslutte], [fagsakStatusCode.UNDER_BEHANDLING], [behandlingStatusCode.FATTER_VEDTAK]);
};

const fraBeslutterFaneAccess = accessSelector(
  [kanSaksbehandle, kanBeslutte],
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
  navAnsatt: NavAnsatt,
  fagsakStatus: Kodeverk,
  behandlingStatus: Kodeverk,
  ansvarligSaksbehandler: string,
  type: Kodeverk,
) => godkjenningsFaneAccessSelector(navAnsatt, ansvarligSaksbehandler)(navAnsatt, fagsakStatus, behandlingStatus, type);

export const sendMeldingAccess = (
  navAnsatt: NavAnsatt,
  fagsakStatus: Kodeverk,
  behandlingStatus: Kodeverk,
  type: Kodeverk,
) => sendMeldingAccessSelector(navAnsatt)(
  navAnsatt, fagsakStatus, behandlingStatus, type,
);

const allSupportPanelAccessRights = (
  navAnsatt: NavAnsatt,
  fagsakStatus: Kodeverk,
  behandlingStatus: Kodeverk,
  behandlingType: Kodeverk,
  ansvarligSaksbehandler: string,
) => ({
  fraBeslutterFaneAccess: fraBeslutterFaneAccess(navAnsatt, fagsakStatus, behandlingStatus, behandlingType),
  godkjenningsFaneAccess: godkjenningsFaneAccess(navAnsatt, fagsakStatus, behandlingStatus, ansvarligSaksbehandler, behandlingType),
  sendMeldingAccess: sendMeldingAccess(navAnsatt, fagsakStatus, behandlingStatus, behandlingType),
});

export default allSupportPanelAccessRights;

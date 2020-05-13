import behandlingStatusCode from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import fagsakStatusCode from '@fpsak-frontend/kodeverk/src/fagsakStatus';
import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { NavAnsatt, Kodeverk } from '@fpsak-frontend/types';

const kanVeilede = (navAnsatt) => navAnsatt && navAnsatt.kanVeilede;
const kanSaksbehandle = (navAnsatt) => navAnsatt && navAnsatt.kanSaksbehandle;
const kanOverstyre = (navAnsatt) => kanSaksbehandle(navAnsatt) && navAnsatt.kanOverstyre;
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

export const writeAccess = accessSelector(
  [kanSaksbehandle],
  [fagsakStatusCode.OPPRETTET, fagsakStatusCode.UNDER_BEHANDLING],
  [behandlingStatusCode.OPPRETTET, behandlingStatusCode.BEHANDLING_UTREDES],
);

export const kanOverstyreAccess = accessSelector(
  [kanOverstyre],
  [fagsakStatusCode.UNDER_BEHANDLING],
  [behandlingStatusCode.BEHANDLING_UTREDES],
);

const getAccessRights = (
  navAnsatt: NavAnsatt,
  fagsakStatus: Kodeverk,
  behandlingStatus: Kodeverk,
  behandlingType: Kodeverk,
) => ({
  writeAccess: writeAccess(navAnsatt, fagsakStatus, behandlingStatus, behandlingType),
  kanOverstyreAccess: kanOverstyreAccess(navAnsatt, fagsakStatus, behandlingStatus, behandlingType),
});

export default getAccessRights;

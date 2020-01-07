import { allAccessRights } from '@fpsak-frontend/fp-felles';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';

const getRettigheter = (navAnsatt, fagsak, behandling) => allAccessRights(navAnsatt, fagsak.fagsakStatus, behandling.status, behandling.type);

const harBehandlingReadOnlyStatus = (behandling) => (behandling.taskStatus && behandling.taskStatus.readOnly ? behandling.taskStatus.readOnly : false);

const erReadOnly = (behandling, aksjonspunkterForPunkt, vilkarlisteForPunkt, navAnsatt, fagsak, hasFetchError) => {
  const { behandlingPaaVent } = behandling;
  const rettigheter = getRettigheter(navAnsatt, fagsak, behandling);

  const isBehandlingReadOnly = hasFetchError || harBehandlingReadOnlyStatus(behandling);
  const hasNonActivOrNonOverstyrbar = aksjonspunkterForPunkt.some((ap) => !ap.erAktivt) || vilkarlisteForPunkt.some((v) => !v.overstyrbar);

  return !rettigheter.writeAccess.isEnabled || behandlingPaaVent || isBehandlingReadOnly || hasNonActivOrNonOverstyrbar;
};

const erOverrideReadOnly = (behandling, aksjonspunkterForPunkt, vilkarlisteForPunkt, navAnsatt, fagsak, hasFetchError) => {
  const { behandlingPaaVent, status } = behandling;
  const rettigheter = getRettigheter(navAnsatt, fagsak, behandling);

  const isBehandlingReadOnly = hasFetchError || harBehandlingReadOnlyStatus(behandling);
  const hasNonActivOrNonOverstyrbar = aksjonspunkterForPunkt.some((ap) => !ap.erAktivt) || vilkarlisteForPunkt.some((v) => !v.overstyrbar);
  const hasBehandlingLukketStatus = status.kode === behandlingStatus.AVSLUTTET || status.kode === behandlingStatus.IVERKSETTER_VEDTAK
    || status.kode === behandlingStatus.FATTER_VEDTAK;

  return !rettigheter.kanOverstyreAccess.isEnabled || behandlingPaaVent
    || isBehandlingReadOnly || hasNonActivOrNonOverstyrbar || hasBehandlingLukketStatus;
};

const readOnlyUtils = {
  erReadOnly,
  erOverrideReadOnly,
  harBehandlingReadOnlyStatus,
};

export default readOnlyUtils;

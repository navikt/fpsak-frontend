import { allAccessRights } from '@fpsak-frontend/fp-felles';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';

export const getRettigheter = (navAnsatt, fagsak, behandling) => allAccessRights(navAnsatt, fagsak.fagsakStatus, behandling.status, behandling.type);

export const erReadOnly = (behandling, aksjonspunkterForPunkt, vilkarlisteForPunkt, navAnsatt, fagsak, hasFetchError) => {
  const { behandlingPaaVent, taskStatus } = behandling;
  const rettigheter = getRettigheter(navAnsatt, fagsak, behandling);

  const isBehandlingReadOnly = hasFetchError || (taskStatus && taskStatus.readOnly ? taskStatus.readOnly : false);
  const hasNonActivOrNonOverstyrbar = aksjonspunkterForPunkt.some((ap) => !ap.erAktivt) || vilkarlisteForPunkt.some((v) => !v.overstyrbar);

  return !rettigheter.writeAccess.isEnabled || behandlingPaaVent || isBehandlingReadOnly || hasNonActivOrNonOverstyrbar;
};


export const erOverrideReadOnly = (behandling, aksjonspunkterForPunkt, vilkarlisteForPunkt, navAnsatt, fagsak, hasFetchError) => {
  const { behandlingPaaVent, taskStatus, status } = behandling;
  const rettigheter = getRettigheter(navAnsatt, fagsak, behandling);

  const isBehandlingReadOnly = hasFetchError || (taskStatus && taskStatus.readOnly ? taskStatus.readOnly : false);
  const hasNonActivOrNonOverstyrbar = aksjonspunkterForPunkt.some((ap) => !ap.erAktivt) || vilkarlisteForPunkt.some((v) => !v.overstyrbar);
  const hasBehandlingLukketStatus = status.kode === behandlingStatus.AVSLUTTET || status.kode === behandlingStatus.IVERKSETTER_VEDTAK
    || status.kode === behandlingStatus.FATTER_VEDTAK;

  return !rettigheter.kanOverstyreAccess.isEnabled || behandlingPaaVent
    || isBehandlingReadOnly || hasNonActivOrNonOverstyrbar || hasBehandlingLukketStatus;
};

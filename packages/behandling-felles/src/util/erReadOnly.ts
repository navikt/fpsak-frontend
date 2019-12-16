
import { allAccessRights } from '@fpsak-frontend/fp-felles';

const erReadOnly = (behandling, aksjonspunkterForPunkt, vilkarlisteForPunkt, navAnsatt, fagsak, hasFetchError) => {
  const rettigheter = allAccessRights(navAnsatt, fagsak.fagsakStatus, behandling.status, behandling.type);
  const behandlingIsOnHold = behandling.behandlingPaaVent;
  const isBehandlingReadOnly = hasFetchError || (behandling.taskStatus && behandling.taskStatus.readOnly ? behandling.taskStatus.readOnly : false);
  const hasNonActivOrNonOverstyrbar = aksjonspunkterForPunkt.some((ap) => !ap.erAktivt) || vilkarlisteForPunkt.some((v) => !v.overstyrbar);

  return !rettigheter.writeAccess.isEnabled || behandlingIsOnHold || isBehandlingReadOnly || hasNonActivOrNonOverstyrbar;
};

export default erReadOnly;

import { allAccessRights } from '@fpsak-frontend/fp-felles';
import {
  Behandling, NavAnsatt, Aksjonspunkt, Vilkar,
} from '@fpsak-frontend/types';

import FagsakInfo from '../types/fagsakInfoTsType';

const getRettigheter = (navAnsatt: NavAnsatt, fagsak: FagsakInfo, behandling: Behandling) => allAccessRights(
  navAnsatt, fagsak.fagsakStatus, behandling.status, behandling.type,
);

const harBehandlingReadOnlyStatus = (behandling: Behandling) => (behandling.taskStatus && behandling.taskStatus.readOnly
  ? behandling.taskStatus.readOnly : false);

const erReadOnly = (behandling: Behandling, aksjonspunkterForPunkt: Aksjonspunkt[], vilkarlisteForPunkt: Vilkar[],
  navAnsatt: NavAnsatt, fagsak: FagsakInfo, hasFetchError: boolean) => {
  const { behandlingPaaVent } = behandling;
  const rettigheter = getRettigheter(navAnsatt, fagsak, behandling);
  const isBehandlingReadOnly = hasFetchError || harBehandlingReadOnlyStatus(behandling);
  const hasNonActivOrNonOverstyrbar = aksjonspunkterForPunkt.some((ap) => !ap.erAktivt) || vilkarlisteForPunkt.some((v) => !v.overstyrbar);

  return !rettigheter.writeAccess.isEnabled || behandlingPaaVent || isBehandlingReadOnly || hasNonActivOrNonOverstyrbar;
};


const readOnlyUtils = {
  erReadOnly,
  harBehandlingReadOnlyStatus,
};

export default readOnlyUtils;

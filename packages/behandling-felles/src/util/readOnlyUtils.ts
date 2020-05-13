import {
  Behandling, Aksjonspunkt, Vilkar,
} from '@fpsak-frontend/types';

import Rettigheter from '../types/rettigheterTsType';

const harBehandlingReadOnlyStatus = (behandling: Behandling) => (behandling.taskStatus && behandling.taskStatus.readOnly
  ? behandling.taskStatus.readOnly : false);

const erReadOnly = (behandling: Behandling, aksjonspunkterForPunkt: Aksjonspunkt[], vilkarlisteForPunkt: Vilkar[],
  rettigheter: Rettigheter, hasFetchError: boolean) => {
  const { behandlingPaaVent } = behandling;
  const isBehandlingReadOnly = hasFetchError || harBehandlingReadOnlyStatus(behandling);
  const hasNonActivOrNonOverstyrbar = aksjonspunkterForPunkt.some((ap) => !ap.erAktivt) || vilkarlisteForPunkt.some((v) => !v.overstyrbar);

  return !rettigheter.writeAccess.isEnabled || behandlingPaaVent || isBehandlingReadOnly || hasNonActivOrNonOverstyrbar;
};

const readOnlyUtils = {
  erReadOnly,
  harBehandlingReadOnlyStatus,
};

export default readOnlyUtils;

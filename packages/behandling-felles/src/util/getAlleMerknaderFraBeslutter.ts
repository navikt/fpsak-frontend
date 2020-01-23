import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';

import Behandling from '../types/behandlingTsType';
import Aksjonspunkt from '../types/aksjonspunktTsType';

const getAlleMerknaderFraBeslutter = (behandling: Behandling, aksjonspunkter: Aksjonspunkt[]) => {
  if (behandling.status.kode !== behandlingStatus.BEHANDLING_UTREDES) {
    return {};
  }
  return aksjonspunkter.reduce((obj, ap) => ({
    ...obj,
    [ap.definisjon.kode]: {
      notAccepted: ap.toTrinnsBehandling && ap.toTrinnsBehandlingGodkjent === false,
    },
  }), {});
};

export default getAlleMerknaderFraBeslutter;

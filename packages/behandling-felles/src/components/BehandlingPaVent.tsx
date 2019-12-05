import React, {
  useState, useMemo, useCallback, FunctionComponent,
} from 'react';
import PropTypes from 'prop-types';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { BehandlingErPaVentModal } from '@fpsak-frontend/fp-felles';
import { aksjonspunktPropType } from '@fpsak-frontend/prop-types';

import { Behandling } from '../types/behandlingTsType';
import { Aksjonspunkt } from '../types/aksjonspunktTsType';
import { Kodeverk } from '../types/kodeverkTsType';
import behandlingPropType from '../propTypes/behandlingPropType';

export interface SettPaVentParams {
  formData: {
    ventearsak: string;
    frist?: string;
  };
  behandlingId: number;
  behandlingVersjon: number;
}

interface BehandlingPaVentProps {
  behandling: Behandling;
  aksjonspunkter: [Aksjonspunkt];
  kodeverk: {[key: string]: [Kodeverk]};
  settPaVent: (SettPaVentParams) => Promise<any>;
  hentBehandling: ({ behandlingId: number }) => Promise<any>;
}

const BehandlingPaVent: FunctionComponent<BehandlingPaVentProps> = ({
  behandling,
  aksjonspunkter,
  kodeverk,
  settPaVent,
  hentBehandling,
}) => {
  const [skalViseModal, setVisModal] = useState(behandling.behandlingPaaVent);
  const skjulModal = useCallback(() => setVisModal(false), []);

  const oppdaterPaVentData = useCallback((formData) => settPaVent({
    ...formData, behandlingId: behandling.id, behandlingVersjon: behandling.versjon,
  }).then(() => hentBehandling({ behandlingId: behandling.id })), [behandling.versjon]);

  const erManueltSattPaVent = useMemo(() => aksjonspunkter.filter((ap) => isAksjonspunktOpen(ap.status.kode))
    .some((ap) => ap.definisjon.kode === aksjonspunktCodes.AUTO_MANUELT_SATT_PÅ_VENT), [aksjonspunkter]);

  if (!skalViseModal) {
    return null;
  }

  return (
    <BehandlingErPaVentModal
      showModal
      closeEvent={skjulModal}
      behandlingId={behandling.id}
      fristBehandlingPaaVent={behandling.fristBehandlingPaaVent}
      venteArsakKode={behandling.venteArsakKode}
      handleOnHoldSubmit={oppdaterPaVentData}
      hasManualPaVent={erManueltSattPaVent}
      ventearsaker={kodeverk[kodeverkTyper.VENT_AARSAK]}
    />
  );
};

BehandlingPaVent.propTypes = {
  behandling: behandlingPropType.isRequired,
  aksjonspunkter: PropTypes.arrayOf(aksjonspunktPropType).isRequired,
  kodeverk: PropTypes.shape({}).isRequired,
  settPaVent: PropTypes.func.isRequired,
  hentBehandling: PropTypes.func.isRequired,
};

export default BehandlingPaVent;

import React, { useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { BehandlingErPaVentModal } from '@fpsak-frontend/fp-felles';

import fpInnsynApi from '../data/innsynBehandlingApi';

const BehandlingPaVent = ({
  behandling,
  aksjonspunkter,
  kodeverk,
}) => {
  const [skalViseModal, setVisModal] = useState(behandling.behandlingPaaVent);
  const skjulModal = useCallback(() => setVisModal(false));

  const dispatch = useDispatch();
  const oppdaterPaVent = useCallback((formData) => dispatch(fpInnsynApi.UPDATE_ON_HOLD.makeRestApiRequest()({
    ...formData, behandlingId: behandling.id, behandlingVersjon: behandling.versjon,
  })).then(() => dispatch(fpInnsynApi.BEHANDLING_INNSYN.makeRestApiRequest()({ behandlingId: behandling.id }))));

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
      handleOnHoldSubmit={oppdaterPaVent}
      hasManualPaVent={erManueltSattPaVent}
      ventearsaker={kodeverk[kodeverkTyper.VENT_AARSAK]}
    />
  );
};

BehandlingPaVent.propTypes = {
  behandling: PropTypes.shape().isRequired,
  aksjonspunkter: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  kodeverk: PropTypes.shape().isRequired,
};

export default BehandlingPaVent;

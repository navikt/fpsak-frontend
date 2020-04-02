import React, {
  useState, useMemo, useCallback, FunctionComponent, useEffect,
} from 'react';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { Behandling, Aksjonspunkt, KodeverkMedNavn } from '@fpsak-frontend/types';
import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import BehandlingPaVentModal from './BehandlingPaVentModal';
import SettPaVentParams from '../../types/settPaVentParamsTsType';

interface BehandlingPaVentProps {
  behandling: Behandling;
  aksjonspunkter: Aksjonspunkt[];
  kodeverk: {[key: string]: KodeverkMedNavn[]};
  settPaVent: (params: SettPaVentParams) => Promise<any>;
  hentBehandling: ({ behandlingId: number }, { keepData: boolean }) => Promise<any>;
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

  useEffect(() => {
    setVisModal(behandling.behandlingPaaVent);
  }, [behandling.versjon]);

  const oppdaterPaVentData = useCallback((formData) => settPaVent({
    ...formData, behandlingId: behandling.id, behandlingVersjon: behandling.versjon,
  }).then(() => hentBehandling({ behandlingId: behandling.id }, { keepData: false })), [behandling.versjon]);

  const erManueltSattPaVent = useMemo(() => aksjonspunkter.filter((ap) => isAksjonspunktOpen(ap.status.kode))
    .some((ap) => ap.definisjon.kode === aksjonspunktCodes.AUTO_MANUELT_SATT_PÅ_VENT), [aksjonspunkter]);

  if (!skalViseModal) {
    return null;
  }

  const erTilbakekreving = (behandlingTypeKode) => behandlingTypeKode === BehandlingType.TILBAKEKREVING
    || behandlingTypeKode === BehandlingType.TILBAKEKREVING_REVURDERING;

  return (
    <BehandlingPaVentModal
      onSubmit={oppdaterPaVentData}
      cancelEvent={skjulModal}
      frist={behandling.fristBehandlingPaaVent}
      ventearsak={behandling.venteArsakKode}
      hasManualPaVent={erManueltSattPaVent}
      ventearsaker={kodeverk[kodeverkTyper.VENT_AARSAK]}
      erTilbakekreving={erTilbakekreving(behandling.type.kode)}
    />
  );
};

export default BehandlingPaVent;

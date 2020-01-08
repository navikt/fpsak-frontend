import React, { FunctionComponent, useState } from 'react';

import { AdvarselModal } from '@fpsak-frontend/shared-components';
import { Behandling, FatterVedtakStatusModal } from '@fpsak-frontend/behandling-felles';

import '@fpsak-frontend/assets/styles/arrowForProcessMenu.less';

interface OwnProps {
  behandling: Behandling;
  harApenRevurdering: boolean;
  visFatterVedtakModal: boolean;
  toggleFatterVedtakModal: () => undefined;
}

const EngangsstonadProsessModaler: FunctionComponent<OwnProps> = ({
  behandling,
  harApenRevurdering,
  visFatterVedtakModal,
  toggleFatterVedtakModal,
}) => {
  const [visApenRevurderingModal, lukkApenRevurderingModal] = useState(harApenRevurdering && !behandling.behandlingPaaVent);

  return (
    <>
      {visApenRevurderingModal && (
        <AdvarselModal
          headerTextCode="BehandlingTilbakekrevingIndex.ApenRevurderingHeader"
          textCode="BehandlingTilbakekrevingIndex.ApenRevurdering"
          showModal
          submit={lukkApenRevurderingModal}
        />
      )}
      <FatterVedtakStatusModal
        visModal={visFatterVedtakModal}
        lukkModal={toggleFatterVedtakModal}
        tekstkode="FatterTilbakekrevingVedtakStatusModal.Sendt"
      />
    </>
  );
};

export default EngangsstonadProsessModaler;

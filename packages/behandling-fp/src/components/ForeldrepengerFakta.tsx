import React, {
  FunctionComponent, useMemo,
} from 'react';
import { useIntl } from 'react-intl';

import aksjonspunktCodesTilbakekreving from '@fpsak-frontend/kodeverk/src/aksjonspunktCodesTilbakekreving';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import {
  FagsakInfo, Behandling, Aksjonspunkt, FaktaPanel, Kodeverk, NavAnsatt, BehandlingDataCache,
} from '@fpsak-frontend/behandling-felles';

interface DataProps {
  feilutbetalingFakta: {};
  feilutbetalingAarsak: {
    ytelseType: Kodeverk;
  }[];
}

interface OwnProps {
  fagsak: FagsakInfo;
  behandling: Behandling;
  aksjonspunkter: Aksjonspunkt[];
  kodeverk: {[key: string]: Kodeverk[]};
  navAnsatt: NavAnsatt;
  hasFetchError: boolean;
  oppdaterProsessStegIUrl: (punktnavn?: string) => void;
}

const EngangsstonadFakta: FunctionComponent<OwnProps> = ({
  behandling,
  aksjonspunkter,
}) => {
  const intl = useIntl();
  const apForPanel = useMemo(() => aksjonspunkter.filter((ap) => ap.definisjon.kode === aksjonspunktCodesTilbakekreving.AVKLAR_FAKTA_FOR_FEILUTBETALING),
    [aksjonspunkter]);
  const harApneAksjonspunkter = apForPanel.some((ap) => isAksjonspunktOpen(ap.status.kode) && ap.kanLoses);


  const cache = new BehandlingDataCache();
  cache.setVersion(behandling.versjon);

  return (
    <FaktaPanel paneler={[{
      tekst: intl.formatMessage({ id: 'TilbakekrevingFakta.FaktaFeilutbetaling' }),
      erAktiv: true,
      harAksjonspunkt: harApneAksjonspunkter,
    }]}
    >
      <div>test</div>
    </FaktaPanel>
  );
};

export default EngangsstonadFakta;

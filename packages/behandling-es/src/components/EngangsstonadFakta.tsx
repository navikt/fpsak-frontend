import React, { FunctionComponent } from 'react';
import { useIntl } from 'react-intl';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import TilleggsopplysningerFaktaIndex from '@fpsak-frontend/fakta-tilleggsopplysninger';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import {
  FagsakInfo, Behandling, Aksjonspunkt, FaktaPanel, Kodeverk, NavAnsatt, BehandlingDataCache,
} from '@fpsak-frontend/behandling-felles';
import { faktaPanelCodes } from '@fpsak-frontend/fp-felles';

import esBehandlingApi from '../data/esBehandlingApi';

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

const paneler = [{
  textCode: 'TilleggsopplysningerInfoPanel.Tilleggsopplysninger',
  component: (props) => <TilleggsopplysningerFaktaIndex {...props} />,
  aksjonspunkter: [aksjonspunktCodes.TILLEGGSOPPLYSNINGER],
  data: [esBehandlingApi.SOKNAD],
  urlCode: faktaPanelCodes.TILLEGGSOPPLYSNINGER,
}];


const utledFaktaPanelInfo = (aksjonspunkter) => {
  const apCodes = aksjonspunkter.map((ap) => ap.definisjon.kode);
  return paneler
    .filter((panel) => panel.aksjonspunkter.some((a) => apCodes.includes(a)))
    .map((panel) => {
      const filtrerteAksjonspunkter = aksjonspunkter.filter((ap) => panel.aksjonspunkter.includes(ap.definisjon.kode));
      return {
        ...panel,
        aksjonspunkter: filtrerteAksjonspunkter,
        harApneAksjonspunkter: filtrerteAksjonspunkter.some((ap) => isAksjonspunktOpen(ap.status.kode) && ap.kanLoses),
      };
    });
};

const EngangsstonadFakta: FunctionComponent<OwnProps> = ({
  behandling,
  aksjonspunkter,
}) => {
  const intl = useIntl();

  const cache = new BehandlingDataCache();
  cache.setVersion(behandling.versjon);

  const faktaPanelInfo = utledFaktaPanelInfo(aksjonspunkter);

  const props = {
    behandling,
    soknad: {},
    aksjonspunkter: faktaPanelInfo[0].aksjonspunkter,
    harApneAksjonspunkter: faktaPanelInfo[0].harApneAksjonspunkter,
    submitCallback: () => undefined,
    readOnly: false,
  };

  return (
    <FaktaPanel paneler={faktaPanelInfo.map((fpi) => ({
      tekst: intl.formatMessage({ id: fpi.textCode }),
      erAktiv: true,
      harAksjonspunkt: fpi.harApneAksjonspunkter,
    }))}
    >
      {faktaPanelInfo[0].component(props)}
    </FaktaPanel>
  );
};

export default EngangsstonadFakta;

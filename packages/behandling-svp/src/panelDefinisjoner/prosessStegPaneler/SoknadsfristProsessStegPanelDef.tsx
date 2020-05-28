import React from 'react';

import VurderSoknadsfristForeldrepengerIndex from '@fpsak-frontend/prosess-soknadsfrist';
import { prosessStegCodes } from '@fpsak-frontend/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { ProsessStegPanelDef, ProsessStegDelPanelDef } from '@fpsak-frontend/behandling-felles';

import svpBehandlingApi from '../../data/svpBehandlingApi';

class PanelDef extends ProsessStegDelPanelDef {
  getKomponent = (props) => <VurderSoknadsfristForeldrepengerIndex {...props} />

  getAksjonspunktKoder = () => [
    aksjonspunktCodes.VURDER_SOKNADSFRIST_FORELDREPENGER,
  ]

  getEndepunkter = () => [
    svpBehandlingApi.UTTAK_PERIODE_GRENSE,
  ]

  getData = ({ soknad }) => ({ soknad })
}

class SoknadsfristProsessStegPanelDef extends ProsessStegPanelDef {
  getUrlKode = () => prosessStegCodes.SOEKNADSFRIST

  getTekstKode = () => 'Behandlingspunkt.Soknadsfristvilkaret'

  getPanelDefinisjoner = () => [new PanelDef()]
}

export default SoknadsfristProsessStegPanelDef;

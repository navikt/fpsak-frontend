import React from 'react';

import { faktaPanelCodes } from '@fpsak-frontend/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import VergeFaktaIndex from '@fpsak-frontend/fakta-verge';
import { FaktaPanelDef } from '@fpsak-frontend/behandling-felles';

import esBehandlingApi from '../../data/esBehandlingApi';

class VergeFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.VERGE

  getTekstKode = () => 'RegistrereVergeInfoPanel.Info'

  getAksjonspunktKoder = () => [aksjonspunktCodes.AVKLAR_VERGE];

  getEndepunkter = () => [esBehandlingApi.VERGE]

  getKomponent = (props) => <VergeFaktaIndex {...props} />
}

export default VergeFaktaPanelDef;

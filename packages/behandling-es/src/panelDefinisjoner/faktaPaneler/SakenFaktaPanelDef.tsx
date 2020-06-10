import React from 'react';

import { faktaPanelCodes } from '@fpsak-frontend/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import SakenFaktaIndex from '@fpsak-frontend/fakta-saken';
import { FaktaPanelDef } from '@fpsak-frontend/behandling-felles';

import esBehandlingApi from '../../data/esBehandlingApi';

class SakenFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.SAKEN

  getTekstKode = () => 'SakenFaktaPanel.Title'

  getAksjonspunktKoder = () => [aksjonspunktCodes.AUTOMATISK_MARKERING_AV_UTENLANDSSAK, aksjonspunktCodes.MANUELL_MARKERING_AV_UTLAND_SAKSTYPE]

  getEndepunkter = () => [esBehandlingApi.UTLAND_DOK_STATUS]

  getKomponent = (props) => <SakenFaktaIndex {...props} />

  getOverstyrVisningAvKomponent = () => true
}

export default SakenFaktaPanelDef;

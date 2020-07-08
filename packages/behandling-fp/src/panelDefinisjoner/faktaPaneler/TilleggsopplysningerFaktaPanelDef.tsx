import React from 'react';

import { faktaPanelCodes } from '@fpsak-frontend/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import TilleggsopplysningerFaktaIndex from '@fpsak-frontend/fakta-tilleggsopplysninger';
import { FaktaPanelDef } from '@fpsak-frontend/behandling-felles';

class TilleggsopplysningerFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.TILLEGGSOPPLYSNINGER

  getTekstKode = () => 'TilleggsopplysningerInfoPanel.Tilleggsopplysninger'

  getAksjonspunktKoder = () => [aksjonspunktCodes.TILLEGGSOPPLYSNINGER];

  getKomponent = (props) => <TilleggsopplysningerFaktaIndex {...props} />

  getData = ({ soknad }) => ({ soknad })
}

export default TilleggsopplysningerFaktaPanelDef;

import React from 'react';

import { faktaPanelCodes } from '@fpsak-frontend/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import OmsorgFaktaIndex from '@fpsak-frontend/fakta-omsorg';
import { FaktaPanelDef } from '@fpsak-frontend/behandling-felles';

class OmsorgFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.OMSORG

  getTekstKode = () => 'OmsorgInfoPanel.Omsorg'

  getAksjonspunktKoder = () => [
    aksjonspunktCodes.MANUELL_KONTROLL_AV_OM_BRUKER_HAR_ALENEOMSORG,
    aksjonspunktCodes.MANUELL_KONTROLL_AV_OM_BRUKER_HAR_OMSORG,
  ]

  getKomponent = (props) => <OmsorgFaktaIndex {...props} />

  getData = ({ ytelsefordeling, personopplysninger, soknad }) => ({ ytelsefordeling, personopplysninger, soknad })
}

export default OmsorgFaktaPanelDef;

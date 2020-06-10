import React from 'react';

import OmsorgVilkarProsessIndex from '@fpsak-frontend/prosess-vilkar-omsorg';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { ProsessStegPanelDef } from '@fpsak-frontend/behandling-felles';

class OmsorgPanelDef extends ProsessStegPanelDef {
  getId = () => 'OMSORG'

  getTekstKode = () => 'Inngangsvilkar.Omsorgsvilkaret'

  getKomponent = (props) => <OmsorgVilkarProsessIndex {...props} />

  getAksjonspunktKoder = () => [
    aksjonspunktCodes.MANUELL_VURDERING_AV_OMSORGSVILKARET,
    aksjonspunktCodes.AVKLAR_OM_STONAD_GJELDER_SAMME_BARN,
    aksjonspunktCodes.AVKLAR_OM_STONAD_TIL_ANNEN_FORELDER_GJELDER_SAMME_BARN,
  ]

  getAksjonspunktTekstkoder = () => [
    'ErOmsorgVilkaarOppfyltForm.Paragraf',
    'ErOmsorgVilkaarOppfyltForm.Vurder',
    'ErOmsorgVilkaarOppfyltForm.Vurder',
  ]

  getVilkarKoder = () => [
    vilkarType.OMSORGSVILKARET,
  ]
}

export default OmsorgPanelDef;

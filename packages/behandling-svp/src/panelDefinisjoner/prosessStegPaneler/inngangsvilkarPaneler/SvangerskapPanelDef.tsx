import React from 'react';

import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { ProsessStegDelPanelDef } from '@fpsak-frontend/behandling-felles';
import SvangerskapVilkarProsessIndex from '@fpsak-frontend/prosess-vilkar-svangerskap';

class SvangerskapPanelDef extends ProsessStegDelPanelDef {
  getId = () => 'SVANGERSKAP'

  getTekstKode = () => 'Inngangsvilkar.Svangerskapsvilkaret'

  getKomponent = (props) => <SvangerskapVilkarProsessIndex {...props} />

  getAksjonspunktKoder = () => [
    aksjonspunktCodes.SVANGERSKAPSVILKARET,
  ]

  getAksjonspunktTekstkoder = () => [
    'SvangerskapVilkarForm.FyllerVilkår',
  ]

  getVilkarKoder = () => [
    vilkarType.SVANGERSKAPVILKARET,
  ]
}

export default SvangerskapPanelDef;

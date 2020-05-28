import React from 'react';

import FodselVilkarProsessIndex from '@fpsak-frontend/prosess-vilkar-fodsel';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { ProsessStegDelPanelDef, ProsessStegOverstyringPanelDef } from '@fpsak-frontend/behandling-felles';

class FodselPanelDef extends ProsessStegDelPanelDef {
  getId = () => 'FODSEL'

  getTekstKode = () => 'Inngangsvilkar.Fodselsvilkaret'

  getKomponent = (props) => <FodselVilkarProsessIndex {...props} />

  getAksjonspunktKoder = () => [
    aksjonspunktCodes.AVKLAR_OM_STONAD_GJELDER_SAMME_BARN,
    aksjonspunktCodes.AVKLAR_OM_STONAD_TIL_ANNEN_FORELDER_GJELDER_SAMME_BARN,
  ]

  getAksjonspunktTekstkoder = () => [
    'FodselVilkarForm.VurderGjelderSammeBarn',
    'FodselVilkarForm.VurderGjelderSammeBarn',
  ]

  getVilkarKoder = () => [
    vilkarType.FODSELSVILKARET_MOR,
  ]

  getData = () => ({ ytelseTypeKode: fagsakYtelseType.ENGANGSSTONAD })

  getOverstyringspanelDef = () => new ProsessStegOverstyringPanelDef(
    this,
    aksjonspunktCodes.OVERSTYR_FODSELSVILKAR,
  )
}

export default FodselPanelDef;

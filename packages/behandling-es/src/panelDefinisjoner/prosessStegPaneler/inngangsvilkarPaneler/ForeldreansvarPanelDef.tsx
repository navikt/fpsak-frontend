import React from 'react';

import ForeldreansvarVilkarProsessIndex from '@fpsak-frontend/prosess-vilkar-foreldreansvar';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { ProsessStegPanelDef } from '@fpsak-frontend/behandling-felles';

class ForeldreansvarPanelDef extends ProsessStegPanelDef {
  getId = () => 'FORELDREANSVARSVILKARET'

  getTekstKode = () => 'Inngangsvilkar.Foreldreansvar'

  getKomponent = (props) => <ForeldreansvarVilkarProsessIndex {...props} />

  getAksjonspunktKoder = () => [
    aksjonspunktCodes.MANUELL_VURDERING_AV_FORELDREANSVARSVILKARET_2_LEDD,
    aksjonspunktCodes.MANUELL_VURDERING_AV_FORELDREANSVARSVILKARET_4_LEDD,
    aksjonspunktCodes.AVKLAR_OM_STONAD_GJELDER_SAMME_BARN,
    aksjonspunktCodes.AVKLAR_OM_STONAD_TIL_ANNEN_FORELDER_GJELDER_SAMME_BARN,
  ]

  getAksjonspunktTekstkoder = () => [
    'ErForeldreansvarVilkaarOppfyltForm.2LeddParagrafForeldrepenger',
    'ErForeldreansvarVilkaarOppfyltForm.4LeddParagraf',
    'ErForeldreansvarVilkaarOppfyltForm.Vurder',
    'ErForeldreansvarVilkaarOppfyltForm.Vurder',
  ]

  getVilkarKoder = () => [
    vilkarType.FORELDREANSVARSVILKARET_2_LEDD,
    vilkarType.FORELDREANSVARSVILKARET_4_LEDD,
  ]

  getData = ({ vilkarForSteg }) => ({
    isEngangsstonad: true,
    isForeldreansvar2Ledd: vilkarForSteg.map((v) => v.vilkarType.kode).includes(vilkarType.FORELDREANSVARSVILKARET_2_LEDD),
  })
}

export default ForeldreansvarPanelDef;

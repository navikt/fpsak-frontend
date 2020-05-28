import React from 'react';

import SokersOpplysningspliktVilkarProsessIndex from '@fpsak-frontend/prosess-vilkar-sokers-opplysningsplikt';
import { prosessStegCodes } from '@fpsak-frontend/konstanter';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { ProsessStegPanelDef, ProsessStegDelPanelDef } from '@fpsak-frontend/behandling-felles';

class PanelDef extends ProsessStegDelPanelDef {
  getKomponent = (props) => <SokersOpplysningspliktVilkarProsessIndex {...props} />

  getOverstyrVisningAvKomponent = ({ behandling, aksjonspunkterForSteg }) => {
    const isRevurdering = behandlingType.REVURDERING === behandling.type.kode;
    const hasAp = aksjonspunkterForSteg.some((ap) => ap.definisjon.kode === aksjonspunktCodes.SOKERS_OPPLYSNINGSPLIKT_MANU);
    return !(isRevurdering && !hasAp);
  }

  getAksjonspunktKoder = () => [
    aksjonspunktCodes.SOKERS_OPPLYSNINGSPLIKT_OVST,
    aksjonspunktCodes.SOKERS_OPPLYSNINGSPLIKT_MANU,
  ]

  getAksjonspunktTekstkoder = () => [
    'SokersOpplysningspliktForm.UtfyllendeOpplysninger',
    'SokersOpplysningspliktForm.UtfyllendeOpplysninger',
  ]

  getVilkarKoder = () => [
    vilkarType.SOKERSOPPLYSNINGSPLIKT,
  ]

  getData = ({ soknad }) => ({
    soknad,
  })
}

class OpplysningspliktProsessStegPanelDef extends ProsessStegPanelDef {
  getUrlKode = () => prosessStegCodes.OPPLYSNINGSPLIKT

  getTekstKode = () => 'Behandlingspunkt.Opplysningsplikt'

  getPanelDefinisjoner = () => [new PanelDef()]
}

export default OpplysningspliktProsessStegPanelDef;

import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { ProsessStegPanelerDef } from '@fpsak-frontend/behandling-felles';

import fpBehandlingApi from '../../../data/fpBehandlingApi';
import OverstyringPanelDef from '../overstyring/OverstyringPanelDef';

class MedlemskapPanelDef extends ProsessStegPanelerDef {
  overstyringDef = new OverstyringPanelDef(this);

  getId = () => 'MEDLEMSKAP'

  getTekstKode = () => 'Inngangsvilkar.Medlemskapsvilkaret'

  getKomponent = (props) => this.overstyringDef.getKomponent(props)

  getAksjonspunktKoder = () => [
    aksjonspunktCodes.OVERSTYR_MEDLEMSKAPSVILKAR,
  ]

  getVilkarKoder = () => [
    vilkarType.MEDLEMSKAPSVILKARET,
  ]

  getEndepunkter = () => [
    fpBehandlingApi.MEDLEMSKAP,
  ]

  getOverstyrVisningAvKomponent = (data) => this.overstyringDef.getOverstyrVisningAvKomponent(data)

  getData = (data) => this.overstyringDef.getData(data)
}

export default MedlemskapPanelDef;

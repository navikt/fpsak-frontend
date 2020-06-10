import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { ProsessStegPanelDef, ProsessStegOverstyringPanelDef } from '@fpsak-frontend/behandling-felles';

import esBehandlingApi from '../../../data/esBehandlingApi';

class MedlemskapPanelDef extends ProsessStegPanelDef {
  overstyringDef = new ProsessStegOverstyringPanelDef(this);

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
    esBehandlingApi.MEDLEMSKAP,
  ]

  getOverstyrVisningAvKomponent = (data) => this.overstyringDef.getOverstyrVisningAvKomponent(data)

  getData = (data) => this.overstyringDef.getData(data)
}

export default MedlemskapPanelDef;

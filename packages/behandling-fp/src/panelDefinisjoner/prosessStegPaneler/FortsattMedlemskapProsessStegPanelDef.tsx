import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import { prosessStegCodes } from '@fpsak-frontend/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { ProsessStegPanelDef, ProsessStegPanelerDef } from '@fpsak-frontend/behandling-felles';
import OverstyringPanelDef from './overstyring/OverstyringPanelDef';

class PanelDef extends ProsessStegPanelerDef {
  overstyringDef = new OverstyringPanelDef(this);

  getKomponent = (props) => this.overstyringDef.getKomponent(props)

  getAksjonspunktKoder = () => [
    aksjonspunktCodes.OVERSTYR_LØPENDE_MEDLEMSKAPSVILKAR,
  ]

  getVilkarKoder = () => [
    vilkarType.MEDLEMSKAPSVILKÅRET_LØPENDE,
  ]

  getOverstyrVisningAvKomponent = (data) => this.overstyringDef.getOverstyrVisningAvKomponent(data)

  getData = (data) => this.overstyringDef.getData(data)
}

class FortsattMedlemskapProsessStegPanelDef extends ProsessStegPanelDef {
  getUrlKode = () => prosessStegCodes.FORTSATTMEDLEMSKAP

  getTekstKode = () => 'Behandlingspunkt.FortsattMedlemskap'

  getPanelDefinisjoner = () => [new PanelDef()]
}

export default FortsattMedlemskapProsessStegPanelDef;

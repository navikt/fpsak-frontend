import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import { prosessStegCodes } from '@fpsak-frontend/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { ProsessStegDef, ProsessStegPanelDef, ProsessStegOverstyringPanelDef } from '@fpsak-frontend/behandling-felles';

class PanelDef extends ProsessStegPanelDef {
  overstyringDef = new ProsessStegOverstyringPanelDef(this);

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

class FortsattMedlemskapProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.FORTSATTMEDLEMSKAP

  getTekstKode = () => 'Behandlingspunkt.FortsattMedlemskap'

  getPanelDefinisjoner = () => [new PanelDef()]
}

export default FortsattMedlemskapProsessStegPanelDef;

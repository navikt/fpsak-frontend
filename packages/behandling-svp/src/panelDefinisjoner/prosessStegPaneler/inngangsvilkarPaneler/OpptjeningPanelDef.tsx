import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { ProsessStegPanelDef, ProsessStegOverstyringPanelDef } from '@fpsak-frontend/behandling-felles';

class OpptjeningPanelDef extends ProsessStegPanelDef {
  overstyringDef = new ProsessStegOverstyringPanelDef(this);

  getId = () => 'OPPTJENINGSVILKARET'

  getTekstKode = () => 'Inngangsvilkar.Opptjeningsvilkaret'

  getKomponent = (props) => this.overstyringDef.getKomponent(props)

  getAksjonspunktKoder = () => [
    aksjonspunktCodes.OVERSTYRING_AV_OPPTJENINGSVILKARET,
  ]

  getVilkarKoder = () => [
    vilkarType.OPPTJENINGSPERIODE,
    vilkarType.OPPTJENINGSVILKARET,
  ]

  getOverstyrVisningAvKomponent = (data) => this.overstyringDef.getOverstyrVisningAvKomponent(data)

  getData = (data) => this.overstyringDef.getData(data)
}

export default OpptjeningPanelDef;

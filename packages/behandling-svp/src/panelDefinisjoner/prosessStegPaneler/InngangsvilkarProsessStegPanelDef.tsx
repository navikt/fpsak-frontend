import { prosessStegCodes } from '@fpsak-frontend/konstanter';
import { ProsessStegPanelDef } from '@fpsak-frontend/behandling-felles';

import SvangerskapPanelDef from './inngangsvilkarPaneler/SvangerskapPanelDef';
import MedlemskapPanelDef from './inngangsvilkarPaneler/MedlemskapPanelDef';
import OpptjeningPanelDef from './inngangsvilkarPaneler/OpptjeningPanelDef';

class InngangsvilkarProsessStegPanelDef extends ProsessStegPanelDef {
  getUrlKode = () => prosessStegCodes.INNGANGSVILKAR

  getTekstKode = () => 'Behandlingspunkt.Inngangsvilkar'

  getPanelDefinisjoner = () => [
    new SvangerskapPanelDef(),
    new MedlemskapPanelDef(),
    new OpptjeningPanelDef(),
  ]
}

export default InngangsvilkarProsessStegPanelDef;

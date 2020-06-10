import { prosessStegCodes } from '@fpsak-frontend/konstanter';
import { ProsessStegDef } from '@fpsak-frontend/behandling-felles';

import SvangerskapPanelDef from './inngangsvilkarPaneler/SvangerskapPanelDef';
import MedlemskapPanelDef from './inngangsvilkarPaneler/MedlemskapPanelDef';
import OpptjeningPanelDef from './inngangsvilkarPaneler/OpptjeningPanelDef';

class InngangsvilkarProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.INNGANGSVILKAR

  getTekstKode = () => 'Behandlingspunkt.Inngangsvilkar'

  getPanelDefinisjoner = () => [
    new SvangerskapPanelDef(),
    new MedlemskapPanelDef(),
    new OpptjeningPanelDef(),
  ]
}

export default InngangsvilkarProsessStegPanelDef;

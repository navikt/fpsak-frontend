import { prosessStegCodes } from '@fpsak-frontend/konstanter';
import { ProsessStegDef } from '@fpsak-frontend/behandling-felles';

import FodselPanelDef from './inngangsvilkarPaneler/FodselPanelDef';
import AdopsjonPanelDef from './inngangsvilkarPaneler/AdopsjonPanelDef';
import OmsorgPanelDef from './inngangsvilkarPaneler/OmsorgPanelDef';
import MedlemskapPanelDef from './inngangsvilkarPaneler/MedlemskapPanelDef';
import ForeldreansvarPanelDef from './inngangsvilkarPaneler/ForeldreansvarPanelDef';
import OpptjeningPanelDef from './inngangsvilkarPaneler/OpptjeningPanelDef';

class InngangsvilkarProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.INNGANGSVILKAR

  getTekstKode = () => 'Behandlingspunkt.Inngangsvilkar'

  getPanelDefinisjoner = () => [
    new FodselPanelDef(),
    new AdopsjonPanelDef(),
    new OmsorgPanelDef(),
    new MedlemskapPanelDef(),
    new ForeldreansvarPanelDef(),
    new OpptjeningPanelDef(),
  ]
}

export default InngangsvilkarProsessStegPanelDef;

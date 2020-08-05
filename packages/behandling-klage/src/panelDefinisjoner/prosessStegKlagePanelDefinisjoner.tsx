import FormKravFamOgPensjonProsessStegPanelDef from './prosessStegPaneler/FormKravFamOgPensjonProsessStegPanelDef';
import VurderingFamOgPensjonProsessStegPanelDef from './prosessStegPaneler/VurderingFamOgPensjonProsessStegPanelDef';
import KlageresultatProsessStegPanelDef from './prosessStegPaneler/KlageresultatProsessStegPanelDef';
import FormKravKlageInstansProsessStegPanelDef from './prosessStegPaneler/FormKravKlageInstansProsessStegPanelDef';
import VurderingKlageInstansProsessStegPanelDef from './prosessStegPaneler/VurderingKlageInstansProsessStegPanelDef';

const prosessStegPanelDefinisjoner = [
  new FormKravFamOgPensjonProsessStegPanelDef(),
  new VurderingFamOgPensjonProsessStegPanelDef(),
  new FormKravKlageInstansProsessStegPanelDef(),
  new VurderingKlageInstansProsessStegPanelDef(),
  new KlageresultatProsessStegPanelDef(),
];

export default prosessStegPanelDefinisjoner;

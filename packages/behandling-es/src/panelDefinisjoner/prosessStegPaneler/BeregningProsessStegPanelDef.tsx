import React from 'react';

import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import BeregningsresultatProsessIndex from '@fpsak-frontend/prosess-beregningsresultat';
import { prosessStegCodes } from '@fpsak-frontend/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { ProsessStegPanelDef, ProsessStegDelPanelDef } from '@fpsak-frontend/behandling-felles';

class PanelDef extends ProsessStegDelPanelDef {
  getKomponent = (props) => <BeregningsresultatProsessIndex {...props} />

  getAksjonspunktKoder = () => [
    aksjonspunktCodes.OVERSTYR_BEREGNING,
  ]

  getVilkarKoder = () => [
    vilkarType.SOKNADFRISTVILKARET,
  ]

  getOverstyrVisningAvKomponent = () => true

  getOverstyrtStatus = ({ beregningresultatEngangsstonad }) => (beregningresultatEngangsstonad ? vilkarUtfallType.OPPFYLT : vilkarUtfallType.IKKE_VURDERT)

  getData = ({ beregningresultatEngangsstonad }) => ({
    beregningresultatEngangsstonad,
  })
}

class BeregningProsessStegPanelDef extends ProsessStegPanelDef {
  getUrlKode = () => prosessStegCodes.BEREGNING

  getTekstKode = () => 'Behandlingspunkt.Beregning'

  getPanelDefinisjoner = () => [new PanelDef()]
}

export default BeregningProsessStegPanelDef;

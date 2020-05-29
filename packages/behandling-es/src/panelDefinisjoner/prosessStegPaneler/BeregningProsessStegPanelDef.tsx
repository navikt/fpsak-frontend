import React from 'react';

import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import BeregningsresultatProsessIndex from '@fpsak-frontend/prosess-beregningsresultat';
import { prosessStegCodes } from '@fpsak-frontend/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { ProsessStegDef, ProsessStegPanelDef } from '@fpsak-frontend/behandling-felles';

class PanelDef extends ProsessStegPanelDef {
  getKomponent = (props) => <BeregningsresultatProsessIndex {...props} />

  getAksjonspunktKoder = () => [
    aksjonspunktCodes.OVERSTYR_BEREGNING,
  ]

  getVilkarKoder = () => [
    vilkarType.SOKNADFRISTVILKARET,
  ]

  getOverstyrVisningAvKomponent = () => true

  getOverstyrtStatus = ({ beregningresultatEngangsstonad }) => (beregningresultatEngangsstonad ? vilkarUtfallType.OPPFYLT : vilkarUtfallType.IKKE_VURDERT)

  getData = ({
    beregningresultatEngangsstonad,
    overrideReadOnly,
    kanOverstyreAccess,
    toggleOverstyring,
  }) => ({
    beregningresultatEngangsstonad,
    overrideReadOnly,
    kanOverstyreAccess,
    toggleOverstyring,
  })
}

class BeregningProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.BEREGNING

  getTekstKode = () => 'Behandlingspunkt.Beregning'

  getPanelDefinisjoner = () => [new PanelDef()]
}

export default BeregningProsessStegPanelDef;

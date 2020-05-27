import React from 'react';

import KlagevurderingProsessIndex from '@fpsak-frontend/prosess-klagevurdering';
import { prosessStegCodes } from '@fpsak-frontend/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { ProsessStegPanelDef, ProsessStegPanelerDef } from '@fpsak-frontend/behandling-felles';

class PanelDef extends ProsessStegPanelerDef {
  getKomponent = (props) => <KlagevurderingProsessIndex {...props} />

  getAksjonspunktKoder = () => [
    aksjonspunktCodes.BEHANDLE_KLAGE_NFP,
  ]

  getOverstyrVisningAvKomponent = () => true

  getData = ({
    saveKlageText, klageVurdering, previewCallback, skalBenytteFritekstBrevmal,
  }) => ({
    saveKlage: saveKlageText,
    klageVurdering,
    previewCallback,
    skalBenytteFritekstBrevmal,
  })
}

class VurderingFamOgPensjonProsessStegPanelDef extends ProsessStegPanelDef {
  getUrlKode = () => prosessStegCodes.KLAGE_NAV_FAMILIE_OG_PENSJON

  getTekstKode = () => 'Behandlingspunkt.CheckKlageNFP'

  getPanelDefinisjoner = () => [new PanelDef()]
}

export default VurderingFamOgPensjonProsessStegPanelDef;

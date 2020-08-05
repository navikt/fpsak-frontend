import React from 'react';

import KlagevurderingProsessIndex from '@fpsak-frontend/prosess-klagevurdering';
import { prosessStegCodes } from '@fpsak-frontend/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { ProsessStegDef, ProsessStegPanelDef } from '@fpsak-frontend/behandling-felles';

class PanelDef extends ProsessStegPanelDef {
  getKomponent = (props) => <KlagevurderingProsessIndex {...props} />

  getAksjonspunktKoder = () => [
    aksjonspunktCodes.BEHANDLE_KLAGE_NK,
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

class VurderingKlageInstansProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.KLAGE_NAV_KLAGEINSTANS

  getTekstKode = () => 'Behandlingspunkt.CheckKlageNK'

  getPanelDefinisjoner = () => [new PanelDef()]
}

export default VurderingKlageInstansProsessStegPanelDef;

import React from 'react';

import AnkeProsessIndex from '@fpsak-frontend/prosess-anke';
import { prosessStegCodes } from '@fpsak-frontend/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { ProsessStegPanelDef, ProsessStegPanelerDef } from '@fpsak-frontend/behandling-felles';

class PanelDef extends ProsessStegPanelerDef {
  getKomponent = (props) => <AnkeProsessIndex {...props} />

  getAksjonspunktKoder = () => [
    aksjonspunktCodes.MANUELL_VURDERING_AV_ANKE,
  ]

  getOverstyrVisningAvKomponent = () => true

  getData = ({
    alleBehandlinger, ankeVurdering, saveAnke, previewCallback,
  }) => ({
    behandlinger: alleBehandlinger,
    previewVedtakCallback: previewCallback,
    ankeVurdering,
    saveAnke,
    previewCallback,
  })
}

class AnkeBehandlingProsessStegPanelDef extends ProsessStegPanelDef {
  getUrlKode = () => prosessStegCodes.ANKEBEHANDLING

  getTekstKode = () => 'Behandlingspunkt.Ankebehandling'

  getPanelDefinisjoner = () => [new PanelDef()]
}

export default AnkeBehandlingProsessStegPanelDef;

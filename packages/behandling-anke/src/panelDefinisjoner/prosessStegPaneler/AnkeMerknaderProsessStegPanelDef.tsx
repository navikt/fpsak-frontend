import React from 'react';

import AnkeMerknaderProsessIndex from '@fpsak-frontend/prosess-anke-merknader';
import { prosessStegCodes } from '@fpsak-frontend/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { ProsessStegPanelDef, ProsessStegPanelerDef } from '@fpsak-frontend/behandling-felles';

class PanelDef extends ProsessStegPanelerDef {
  getKomponent = (props) => <AnkeMerknaderProsessIndex {...props} />

  getOverstyrVisningAvKomponent = ({ vilkarForSteg }) => vilkarForSteg.length > 0

  getAksjonspunktKoder = () => [
    aksjonspunktCodes.MANUELL_VURDERING_AV_ANKE_MERKNADER,
    aksjonspunktCodes.AUTO_VENT_ANKE_MERKNADER_FRA_BRUKER,
  ]

  getData = ({
    ankeVurdering, saveAnke, previewCallback,
  }) => ({
    previewVedtakCallback: previewCallback,
    previewCallback,
    ankeVurdering,
    saveAnke,
  })
}

class AnkeMerknaderProsessStegPanelDef extends ProsessStegPanelDef {
  getUrlKode = () => prosessStegCodes.ANKE_MERKNADER

  getTekstKode = () => 'Behandlingspunkt.AnkeMerknader'

  getPanelDefinisjoner = () => [new PanelDef()]
}

export default AnkeMerknaderProsessStegPanelDef;

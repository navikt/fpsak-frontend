import React from 'react';

import InnsynProsessIndex from '@fpsak-frontend/prosess-innsyn';
import { prosessStegCodes } from '@fpsak-frontend/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { ProsessStegPanelDef, ProsessStegDelPanelDef } from '@fpsak-frontend/behandling-felles';

class PanelDef extends ProsessStegDelPanelDef {
  getKomponent = (props) => <InnsynProsessIndex {...props} />

  getOverstyrVisningAvKomponent = () => true

  getAksjonspunktKoder = () => [
    aksjonspunktCodes.VURDER_INNSYN,
  ]

  getData = ({ innsyn, alleDokumenter, fagsak }) => ({
    innsyn,
    alleDokumenter,
    saksnummer: fagsak.saksnummer,
  })
}

class BehandleInnsynProsessStegPanelDef extends ProsessStegPanelDef {
  getUrlKode = () => prosessStegCodes.BEHANDLE_INNSYN

  getTekstKode = () => 'Behandlingspunkt.Innsyn'

  getPanelDefinisjoner = () => [new PanelDef()]
}

export default BehandleInnsynProsessStegPanelDef;

import React from 'react';

import InnsynProsessIndex from '@fpsak-frontend/prosess-innsyn';
import { prosessStegCodes } from '@fpsak-frontend/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { ProsessStegDef, ProsessStegPanelDef } from '@fpsak-frontend/behandling-felles';

class PanelDef extends ProsessStegPanelDef {
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

class BehandleInnsynProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.BEHANDLE_INNSYN

  getTekstKode = () => 'Behandlingspunkt.Innsyn'

  getPanelDefinisjoner = () => [new PanelDef()]
}

export default BehandleInnsynProsessStegPanelDef;

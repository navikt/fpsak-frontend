import React from 'react';

import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import navBrukerKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';
import ForeldelseProsessIndex from '@fpsak-frontend/prosess-foreldelse';
import { prosessStegCodes } from '@fpsak-frontend/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { getAlleMerknaderFraBeslutter, ProsessStegPanelDef, ProsessStegPanelerDef } from '@fpsak-frontend/behandling-felles';

class PanelDef extends ProsessStegPanelerDef {
  getKomponent = (props) => <ForeldelseProsessIndex {...props} />

  getOverstyrVisningAvKomponent = () => true

  getOverstyrtStatus = ({ perioderForeldelse }) => (perioderForeldelse ? vilkarUtfallType.OPPFYLT : vilkarUtfallType.IKKE_VURDERT);

  getAksjonspunktKoder = () => [
    aksjonspunktCodes.VURDER_FORELDELSE,
  ]

  getData = ({
    behandling, aksjonspunkterForSteg, perioderForeldelse, fagsak, beregnBelop,
  }) => ({
    perioderForeldelse,
    beregnBelop,
    navBrukerKjonn: fagsak.fagsakPerson.erKvinne ? navBrukerKjonn.KVINNE : navBrukerKjonn.MANN,
    alleMerknaderFraBeslutter: getAlleMerknaderFraBeslutter(behandling, aksjonspunkterForSteg),
  })
}

class ForeldelseProsessStegPanelDef extends ProsessStegPanelDef {
  getUrlKode = () => prosessStegCodes.FORELDELSE

  getTekstKode = () => 'Behandlingspunkt.Foreldelse'

  getPanelDefinisjoner = () => [new PanelDef()]
}

export default ForeldelseProsessStegPanelDef;

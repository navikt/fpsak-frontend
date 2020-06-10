import React from 'react';

import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import navBrukerKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';
import ForeldelseProsessIndex from '@fpsak-frontend/prosess-foreldelse';
import { prosessStegCodes } from '@fpsak-frontend/konstanter';
import aksjonspunktCodesTilbakekreving from '@fpsak-frontend/kodeverk/src/aksjonspunktCodesTilbakekreving';
import { getAlleMerknaderFraBeslutter, ProsessStegDef, ProsessStegPanelDef } from '@fpsak-frontend/behandling-felles';

class PanelDef extends ProsessStegPanelDef {
  getKomponent = (props) => <ForeldelseProsessIndex {...props} />

  getOverstyrVisningAvKomponent = () => true

  getOverstyrtStatus = ({ perioderForeldelse }) => (perioderForeldelse ? vilkarUtfallType.OPPFYLT : vilkarUtfallType.IKKE_VURDERT);

  getAksjonspunktKoder = () => [
    aksjonspunktCodesTilbakekreving.VURDER_FORELDELSE,
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

class ForeldelseProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.FORELDELSE

  getTekstKode = () => 'Behandlingspunkt.Foreldelse'

  getPanelDefinisjoner = () => [new PanelDef()]
}

export default ForeldelseProsessStegPanelDef;

import React from 'react';

import navBrukerKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';
import TilbakekrevingProsessIndex from '@fpsak-frontend/prosess-tilbakekreving';
import { prosessStegCodes } from '@fpsak-frontend/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { getAlleMerknaderFraBeslutter, ProsessStegPanelDef, ProsessStegPanelerDef } from '@fpsak-frontend/behandling-felles';

import tilbakekrevingApi from '../../data/tilbakekrevingBehandlingApi';

class PanelDef extends ProsessStegPanelerDef {
  getKomponent = (props) => <TilbakekrevingProsessIndex {...props} />

  getOverstyrVisningAvKomponent = () => true

  getAksjonspunktKoder = () => [
    aksjonspunktCodes.VURDER_TILBAKEKREVING,
  ]

  getEndepunkter = () => [
    tilbakekrevingApi.VILKARVURDERINGSPERIODER,
    tilbakekrevingApi.VILKARVURDERING,
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

class TilbakekrevingProsessStegPanelDef extends ProsessStegPanelDef {
  getUrlKode = () => prosessStegCodes.TILBAKEKREVING

  getTekstKode = () => 'Behandlingspunkt.Tilbakekreving'

  getPanelDefinisjoner = () => [new PanelDef()]
}

export default TilbakekrevingProsessStegPanelDef;

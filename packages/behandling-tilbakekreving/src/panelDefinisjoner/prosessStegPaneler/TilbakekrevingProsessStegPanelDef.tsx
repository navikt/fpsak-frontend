import React from 'react';

import navBrukerKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';
import TilbakekrevingProsessIndex from '@fpsak-frontend/prosess-tilbakekreving';
import { prosessStegCodes } from '@fpsak-frontend/konstanter';
import { getAlleMerknaderFraBeslutter, ProsessStegDef, ProsessStegPanelDef } from '@fpsak-frontend/behandling-felles';
import aksjonspunktCodesTilbakekreving from '@fpsak-frontend/kodeverk/src/aksjonspunktCodesTilbakekreving';

import tilbakekrevingApi from '../../data/tilbakekrevingBehandlingApi';

class PanelDef extends ProsessStegPanelDef {
  getKomponent = (props) => <TilbakekrevingProsessIndex {...props} />

  getOverstyrVisningAvKomponent = () => true

  getAksjonspunktKoder = () => [
    aksjonspunktCodesTilbakekreving.VURDER_TILBAKEKREVING,
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

class TilbakekrevingProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.TILBAKEKREVING

  getTekstKode = () => 'Behandlingspunkt.Tilbakekreving'

  getPanelDefinisjoner = () => [new PanelDef()]
}

export default TilbakekrevingProsessStegPanelDef;

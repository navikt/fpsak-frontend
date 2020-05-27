import React from 'react';

import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import AvregningProsessIndex from '@fpsak-frontend/prosess-avregning';
import { prosessStegCodes } from '@fpsak-frontend/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { ProsessStegPanelDef, ProsessStegPanelerDef } from '@fpsak-frontend/behandling-felles';

import svpBehandlingApi from '../../data/svpBehandlingApi';

class PanelDef extends ProsessStegPanelerDef {
  getKomponent = (props) => <AvregningProsessIndex {...props} />

  getAksjonspunktKoder = () => [
    aksjonspunktCodes.VURDER_FEILUTBETALING,
  ]

  getEndepunkter = () => [
    svpBehandlingApi.TILBAKEKREVINGVALG,
  ]

  getOverstyrVisningAvKomponent = () => true

  getOverstyrtStatus = ({ simuleringResultat }) => (simuleringResultat ? vilkarUtfallType.OPPFYLT : vilkarUtfallType.IKKE_VURDERT)

  getData = ({
    fagsak, featureToggles, previewFptilbakeCallback, simuleringResultat,
  }) => ({
    fagsak,
    featureToggles,
    previewFptilbakeCallback,
    simuleringResultat,
  })
}

class SimuleringProsessStegPanelDef extends ProsessStegPanelDef {
  getUrlKode = () => prosessStegCodes.AVREGNING

  getTekstKode = () => 'Behandlingspunkt.Avregning'

  getPanelDefinisjoner = () => [new PanelDef()]
}

export default SimuleringProsessStegPanelDef;

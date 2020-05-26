import React from 'react';

import OpptjeningVilkarProsessIndex from '@fpsak-frontend/prosess-vilkar-opptjening';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { ProsessStegPanelerDef } from '@fpsak-frontend/behandling-felles';

import fpBehandlingApi from '../../../data/fpBehandlingApi';
import OverstyringPanelDef from '../overstyring/OverstyringPanelDef';

class OpptjeningPanelDef extends ProsessStegPanelerDef {
  getId = () => 'OPPTJENINGSVILKARET'

  getTekstKode = () => 'Inngangsvilkar.Opptjeningsvilkaret'

  getKomponent = (props) => <OpptjeningVilkarProsessIndex {...props} />

  getAksjonspunktKoder = () => [
    aksjonspunktCodes.VURDER_OPPTJENINGSVILKARET,
  ]

  getAksjonspunktTekstkoder = () => [
    'OpptjeningVilkarView.VurderOmSøkerHarRett',
  ]

  getVilkarKoder = () => [
    vilkarType.OPPTJENINGSPERIODE,
    vilkarType.OPPTJENINGSVILKARET,
  ]

  getEndepunkter = () => [
    fpBehandlingApi.OPPTJENING,
  ]

  getData = ({ vilkarForSteg }) => ({
    lovReferanse: vilkarForSteg[0].lovReferanse,
  })

  getOverstyringspanelDef = () => new OverstyringPanelDef(
    this,
    aksjonspunktCodes.OVERSTYRING_AV_OPPTJENINGSVILKARET,
  )
}

export default OpptjeningPanelDef;

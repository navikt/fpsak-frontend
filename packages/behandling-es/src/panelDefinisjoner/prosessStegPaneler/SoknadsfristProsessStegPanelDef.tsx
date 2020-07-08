import React from 'react';

import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import SoknadsfristVilkarProsessIndex from '@fpsak-frontend/prosess-vilkar-soknadsfrist';
import { prosessStegCodes } from '@fpsak-frontend/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { ProsessStegDef, ProsessStegPanelDef, ProsessStegOverstyringPanelDef } from '@fpsak-frontend/behandling-felles';

import esBehandlingApi from '../../data/esBehandlingApi';

class PanelDef extends ProsessStegPanelDef {
  getKomponent = (props) => <SoknadsfristVilkarProsessIndex {...props} />

  getAksjonspunktKoder = () => [
    aksjonspunktCodes.SOKNADSFRISTVILKARET,
  ]

  getVilkarKoder = () => [
    vilkarType.SOKNADFRISTVILKARET,
  ]

  getEndepunkter = () => [
    esBehandlingApi.FAMILIEHENDELSE,
  ]

  getData = ({ soknad }) => ({ soknad })

  getOverstyringspanelDef = () => new ProsessStegOverstyringPanelDef(
    this,
    aksjonspunktCodes.OVERSTYR_SOKNADSFRISTVILKAR,
  )
}

class SoknadsfristProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.SOEKNADSFRIST

  getTekstKode = () => 'Behandlingspunkt.Soknadsfristvilkaret'

  getPanelDefinisjoner = () => [new PanelDef()]
}

export default SoknadsfristProsessStegPanelDef;

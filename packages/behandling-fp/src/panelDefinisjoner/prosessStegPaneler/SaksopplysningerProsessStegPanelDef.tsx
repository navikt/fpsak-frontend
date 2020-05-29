import React from 'react';

import CheckPersonStatusIndex from '@fpsak-frontend/prosess-saksopplysninger';
import { prosessStegCodes } from '@fpsak-frontend/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { ProsessStegDef, ProsessStegPanelDef } from '@fpsak-frontend/behandling-felles';

import fpBehandlingApi from '../../data/fpBehandlingApi';

class PanelDef extends ProsessStegPanelDef {
  getKomponent = (props) => <CheckPersonStatusIndex {...props} />

  getAksjonspunktKoder = () => [
    aksjonspunktCodes.AVKLAR_PERSONSTATUS,
  ]

  getEndepunkter = () => [
    fpBehandlingApi.MEDLEMSKAP,
  ]

  getData = ({ personopplysninger }) => ({
    personopplysninger,
  })
}

class SaksopplysningerProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.SAKSOPPLYSNINGER

  getTekstKode = () => 'Behandlingspunkt.Saksopplysninger'

  getPanelDefinisjoner = () => [new PanelDef()]
}

export default SaksopplysningerProsessStegPanelDef;

import React from 'react';

import CheckPersonStatusIndex from '@fpsak-frontend/prosess-saksopplysninger';
import { prosessStegCodes } from '@fpsak-frontend/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { ProsessStegPanelDef, ProsessStegDelPanelDef } from '@fpsak-frontend/behandling-felles';

import svpBehandlingApi from '../../data/svpBehandlingApi';

class PanelDef extends ProsessStegDelPanelDef {
  getKomponent = (props) => <CheckPersonStatusIndex {...props} />

  getAksjonspunktKoder = () => [
    aksjonspunktCodes.AVKLAR_PERSONSTATUS,
  ]

  getEndepunkter = () => [
    svpBehandlingApi.MEDLEMSKAP,
  ]

  getData = ({ personopplysninger }) => ({
    personopplysninger,
  })
}

class SaksopplysningerProsessStegPanelDef extends ProsessStegPanelDef {
  getUrlKode = () => prosessStegCodes.SAKSOPPLYSNINGER

  getTekstKode = () => 'Behandlingspunkt.Saksopplysninger'

  getPanelDefinisjoner = () => [new PanelDef()]
}

export default SaksopplysningerProsessStegPanelDef;

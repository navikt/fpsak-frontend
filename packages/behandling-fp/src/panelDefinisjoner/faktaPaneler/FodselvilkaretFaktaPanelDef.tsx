import React from 'react';

import { faktaPanelCodes } from '@fpsak-frontend/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import FodselFaktaIndex from '@fpsak-frontend/fakta-fodsel';
import { FaktaPanelDef } from '@fpsak-frontend/behandling-felles';
import { fodselsvilkarene } from '@fpsak-frontend/kodeverk/src/vilkarType';

import fpBehandlingApi from '../../data/fpBehandlingApi';

class FodselvilkaretFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.FODSELSVILKARET

  getTekstKode = () => 'FodselInfoPanel.Fodsel'

  getAksjonspunktKoder = () => [
    aksjonspunktCodes.TERMINBEKREFTELSE,
    aksjonspunktCodes.SJEKK_MANGLENDE_FODSEL,
    aksjonspunktCodes.VURDER_OM_VILKAR_FOR_SYKDOM_ER_OPPFYLT,
  ]

  getEndepunkter = () => [
    fpBehandlingApi.FAMILIEHENDELSE,
    fpBehandlingApi.FAMILIEHENDELSE_ORIGINAL_BEHANDLING,
    fpBehandlingApi.SOKNAD_ORIGINAL_BEHANDLING,
  ]

  getKomponent = (props) => <FodselFaktaIndex {...props} />

  getOverstyrVisningAvKomponent = ({ vilkar }) => vilkar.some((v) => fodselsvilkarene.includes(v.vilkarType.kode))

  getData = ({ soknad, personopplysninger }) => ({ soknad, personopplysninger })
}

export default FodselvilkaretFaktaPanelDef;

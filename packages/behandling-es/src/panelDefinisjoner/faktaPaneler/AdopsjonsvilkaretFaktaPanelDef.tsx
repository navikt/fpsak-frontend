import React from 'react';

import { faktaPanelCodes } from '@fpsak-frontend/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import AdopsjonFaktaIndex from '@fpsak-frontend/fakta-adopsjon';
import { FaktaPanelDef } from '@fpsak-frontend/behandling-felles';
import { adopsjonsvilkarene } from '@fpsak-frontend/kodeverk/src/vilkarType';

import esBehandlingApi from '../../data/esBehandlingApi';

class AdopsjonsvilkaretFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.ADOPSJONSVILKARET

  getTekstKode = () => 'AdopsjonInfoPanel.Adopsjon'

  getAksjonspunktKoder = () => [
    aksjonspunktCodes.OM_SOKER_ER_MANN_SOM_ADOPTERER_ALENE,
    aksjonspunktCodes.ADOPSJONSDOKUMENTAJON,
    aksjonspunktCodes.OM_ADOPSJON_GJELDER_EKTEFELLES_BARN,
  ]

  getEndepunkter = () => [esBehandlingApi.FAMILIEHENDELSE]

  getKomponent = (props) => <AdopsjonFaktaIndex {...props} />

  getOverstyrVisningAvKomponent = ({ vilkar }) => vilkar.some((v) => adopsjonsvilkarene.includes(v.vilkarType.kode))

  getData = ({ soknad, personopplysninger }) => ({
    isForeldrepengerFagsak: false,
    soknad,
    personopplysninger,
  })
}

export default AdopsjonsvilkaretFaktaPanelDef;

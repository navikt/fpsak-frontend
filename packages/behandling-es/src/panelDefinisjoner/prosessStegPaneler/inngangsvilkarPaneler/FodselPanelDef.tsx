import React from 'react';

import FodselVilkarProsessIndex from '@fpsak-frontend/prosess-vilkar-fodsel';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { ProsessStegPanelerDef, ProsessStegOverstyringPanelDef } from '@fpsak-frontend/behandling-felles';

import esBehandlingApi from '../../../data/esBehandlingApi';

class FodselPanelDef extends ProsessStegPanelerDef {
  getId = () => 'FODSEL'

  getTekstKode = () => 'Inngangsvilkar.Fodselsvilkaret'

  getKomponent = (props) => <FodselVilkarProsessIndex {...props} />

  getAksjonspunktKoder = () => [
    aksjonspunktCodes.AVKLAR_OM_STONAD_GJELDER_SAMME_BARN,
    aksjonspunktCodes.AVKLAR_OM_STONAD_TIL_ANNEN_FORELDER_GJELDER_SAMME_BARN,
  ]

  getAksjonspunktTekstkoder = () => [
    'FodselVilkarForm.VurderGjelderSammeBarn',
    'FodselVilkarForm.VurderGjelderSammeBarn',
  ]

  getVilkarKoder = () => [
    vilkarType.FODSELSVILKARET_MOR,
  ]

  getEndepunkter = () => [
    esBehandlingApi.FAMILIEHENDELSE,
    esBehandlingApi.FAMILIEHENDELSE_ORIGINAL_BEHANDLING,
    esBehandlingApi.SOKNAD_ORIGINAL_BEHANDLING,
  ]

  getData = () => ({ ytelseTypeKode: fagsakYtelseType.ENGANGSSTONAD })

  getOverstyringspanelDef = () => new ProsessStegOverstyringPanelDef(
    this,
    aksjonspunktCodes.OVERSTYR_FODSELSVILKAR,
  )
}

export default FodselPanelDef;

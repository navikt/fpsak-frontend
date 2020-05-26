import React from 'react';

import AdopsjonVilkarProsessIndex from '@fpsak-frontend/prosess-vilkar-adopsjon';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { ProsessStegPanelerDef } from '@fpsak-frontend/behandling-felles';

import fpBehandlingApi from '../../../data/fpBehandlingApi';
import OverstyringPanelDef from '../overstyring/OverstyringPanelDef';

class AdopsjonPanelDef extends ProsessStegPanelerDef {
  getId = () => 'ADOPSJON'

  getTekstKode = () => 'Inngangsvilkar.Adopsjonsvilkaret'

  getKomponent = (props) => <AdopsjonVilkarProsessIndex {...props} />

  getAksjonspunktKoder = () => [
    aksjonspunktCodes.AVKLAR_OM_STONAD_GJELDER_SAMME_BARN,
    aksjonspunktCodes.AVKLAR_OM_STONAD_TIL_ANNEN_FORELDER_GJELDER_SAMME_BARN,
  ]

  getAksjonspunktTekstkoder = () => [
    'AdopsjonVilkarForm.VurderGjelderSammeBarn',
    'AdopsjonVilkarForm.VurderGjelderSammeBarn',
  ]

  getVilkarKoder = () => [
    vilkarType.ADOPSJONSVILKARET_FORELDREPENGER,
  ]

  getEndepunkter = () => [
    fpBehandlingApi.FAMILIEHENDELSE,
    fpBehandlingApi.FAMILIEHENDELSE_ORIGINAL_BEHANDLING,
    fpBehandlingApi.SOKNAD_ORIGINAL_BEHANDLING,
  ]

  getData = ({ vilkarForSteg }) => ({ vilkar: vilkarForSteg })

  getOverstyringspanelDef = () => new OverstyringPanelDef(
    this,
    aksjonspunktCodes.OVERSTYRING_AV_ADOPSJONSVILKÅRET_FP,
  )
}

export default AdopsjonPanelDef;

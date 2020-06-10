import React from 'react';

import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import FormkravProsessIndex from '@fpsak-frontend/prosess-formkrav';
import { prosessStegCodes } from '@fpsak-frontend/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { ProsessStegDef, ProsessStegPanelDef } from '@fpsak-frontend/behandling-felles';

class PanelDef extends ProsessStegPanelDef {
  getKomponent = (props) => <FormkravProsessIndex {...props} />

  getAksjonspunktKoder = () => [
    aksjonspunktCodes.VURDERING_AV_FORMKRAV_KLAGE_NFP,
  ]

  getOverstyrVisningAvKomponent = () => true

  getData = ({ alleBehandlinger, klageVurdering }) => ({
    avsluttedeBehandlinger: alleBehandlinger.filter((b) => b.status.kode === behandlingStatus.AVSLUTTET),
    klageVurdering,
  })
}

class FormKravFamOgPensjonProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.FORMKRAV_KLAGE_NAV_FAMILIE_OG_PENSJON

  getTekstKode = () => 'Behandlingspunkt.FormkravKlageNFP'

  getPanelDefinisjoner = () => [new PanelDef()]
}

export default FormKravFamOgPensjonProsessStegPanelDef;

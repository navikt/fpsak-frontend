import React from 'react';

import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import VedtakKlageProsessIndex from '@fpsak-frontend/prosess-vedtak-klage';
import { prosessStegCodes } from '@fpsak-frontend/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { ProsessStegDef, ProsessStegPanelDef } from '@fpsak-frontend/behandling-felles';

const getVedtakStatus = (behandlingsresultat, aksjonspunkter) => {
  const harApentAksjonpunkt = aksjonspunkter.some((ap) => ap.status.kode === aksjonspunktStatus.OPPRETTET);
  if (aksjonspunkter.length === 0 || harApentAksjonpunkt) {
    return vilkarUtfallType.IKKE_VURDERT;
  }

  const resultatTypeCode = behandlingsresultat.type.kode;
  if (resultatTypeCode === behandlingResultatType.KLAGE_AVVIST || resultatTypeCode === behandlingResultatType.KLAGE_YTELSESVEDTAK_OPPHEVET) {
    return vilkarUtfallType.IKKE_OPPFYLT;
  }
  return vilkarUtfallType.OPPFYLT;
};

class PanelDef extends ProsessStegPanelDef {
  getKomponent = (props) => <VedtakKlageProsessIndex {...props} />

  getOverstyrVisningAvKomponent = () => true

  getOverstyrtStatus = ({ behandling, aksjonspunkterForSteg }) => getVedtakStatus(behandling.behandlingsresultat, aksjonspunkterForSteg)

  getAksjonspunktKoder = () => [
    aksjonspunktCodes.FORESLA_VEDTAK,
    aksjonspunktCodes.FATTER_VEDTAK,
    aksjonspunktCodes.FORESLA_VEDTAK_MANUELT,
    aksjonspunktCodes.VEDTAK_UTEN_TOTRINNSKONTROLL,
  ]

  getData = ({ previewCallback, klageVurdering, skalBenytteFritekstBrevmal }) => ({
    previewVedtakCallback: previewCallback,
    klageVurdering,
    skalBenytteFritekstBrevmal,
  })
}

class KlageresultatProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.KLAGE_RESULTAT

  getTekstKode = () => 'Behandlingspunkt.ResultatKlage'

  getPanelDefinisjoner = () => [new PanelDef()]
}

export default KlageresultatProsessStegPanelDef;

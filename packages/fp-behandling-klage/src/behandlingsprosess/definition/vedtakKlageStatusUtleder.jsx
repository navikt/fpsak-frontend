import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import { isKlageAksjonspunkt } from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';

const getVedtakStatus = ({
  aksjonspunkter, behandlingsresultat,
}) => {
  const allAksjonspunkterIkkeUtfort = aksjonspunkter
    .filter(ap => isKlageAksjonspunkt(ap.definisjon.kode))
    .some(ak => ak.status.kode !== aksjonspunktStatus.UTFORT);
  if (!allAksjonspunkterIkkeUtfort) {
    const resultatTypeCode = behandlingsresultat.type.kode;
    if (resultatTypeCode === behandlingResultatType.KLAGE_AVVIST || resultatTypeCode === behandlingResultatType.KLAGE_YTELSESVEDTAK_OPPHEVET) {
      return vilkarUtfallType.IKKE_OPPFYLT;
    }
    return vilkarUtfallType.OPPFYLT;
  }
  return vilkarUtfallType.IKKE_VURDERT;
};

export default getVedtakStatus;

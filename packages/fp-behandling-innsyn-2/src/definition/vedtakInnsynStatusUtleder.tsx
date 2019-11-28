import innsynResultatTypeKV from '@fpsak-frontend/kodeverk/src/innsynResultatType';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';

const getVedtakStatus = ({ aksjonspunkter, innsynResultatType }) => {
  const akp = aksjonspunkter.find((ap) => ap.definisjon.kode === aksjonspunktCodes.FORESLA_VEDTAK);
  if (!akp) {
    return vilkarUtfallType.IKKE_VURDERT;
  }
  return innsynResultatType.kode === innsynResultatTypeKV.INNVILGET ? vilkarUtfallType.OPPFYLT : vilkarUtfallType.IKKE_OPPFYLT;
};

export default getVedtakStatus;

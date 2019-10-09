import { behandlingspunktCodes } from '@fpsak-frontend/fp-felles';
import aksjonspunktCode from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import { isObject } from '@fpsak-frontend/utils';


const behandlingspunktToAksjonspunktEngangsstonad = {
  [behandlingspunktCodes.FOEDSEL]: aksjonspunktCode.OVERSTYR_FODSELSVILKAR,
  [behandlingspunktCodes.ADOPSJON]: aksjonspunktCode.OVERSTYR_ADOPSJONSVILKAR,
  [behandlingspunktCodes.MEDLEMSKAP]: aksjonspunktCode.OVERSTYR_MEDLEMSKAPSVILKAR,
  [behandlingspunktCodes.SOEKNADSFRIST]: aksjonspunktCode.OVERSTYR_SOKNADSFRISTVILKAR,
  [behandlingspunktCodes.OPPTJENING]: aksjonspunktCode.OVERSTYRING_AV_OPPTJENINGSVILKARET,
};
const behandlingspunktToAksjonspunktForeldrepenger = {
  [behandlingspunktCodes.FOEDSEL]: {
    [vilkarType.FODSELSVILKARET_MOR]: aksjonspunktCode.OVERSTYR_FODSELSVILKAR,
    [vilkarType.FODSELSVILKARET_FAR]: aksjonspunktCode.OVERSTYR_FODSELSVILKAR_FAR_MEDMOR,
  },
  [behandlingspunktCodes.ADOPSJON]: aksjonspunktCode.OVERSTYRING_AV_ADOPSJONSVILKÅRET_FP,
  [behandlingspunktCodes.MEDLEMSKAP]: aksjonspunktCode.OVERSTYR_MEDLEMSKAPSVILKAR,
  [behandlingspunktCodes.FORTSATTMEDLEMSKAP]: aksjonspunktCode.OVERSTYR_LØPENDE_MEDLEMSKAPSVILKAR,
  [behandlingspunktCodes.SOEKNADSFRIST]: aksjonspunktCode.OVERSTYR_SOKNADSFRISTVILKAR,
  [behandlingspunktCodes.OPPTJENING]: aksjonspunktCode.OVERSTYRING_AV_OPPTJENINGSVILKARET,
};

const behandlingspunktToAksjonspunktSvangerskapspenger = {
  [behandlingspunktCodes.FOEDSEL]: aksjonspunktCode.OVERSTYR_FODSELSVILKAR,
  [behandlingspunktCodes.MEDLEMSKAP]: aksjonspunktCode.OVERSTYR_MEDLEMSKAPSVILKAR,
  [behandlingspunktCodes.FORTSATTMEDLEMSKAP]: aksjonspunktCode.OVERSTYR_LØPENDE_MEDLEMSKAPSVILKAR,
  [behandlingspunktCodes.SOEKNADSFRIST]: aksjonspunktCode.OVERSTYR_SOKNADSFRISTVILKAR,
  [behandlingspunktCodes.OPPTJENING]: aksjonspunktCode.OVERSTYRING_AV_OPPTJENINGSVILKARET,
};


const getApCode = (behandlingspunkt, ytelseType, allVilkar) => {
  let apCode = null;
  if (ytelseType && ytelseType.kode === fagsakYtelseType.FORELDREPENGER) {
    apCode = behandlingspunktToAksjonspunktForeldrepenger[behandlingspunkt];
  } else if (ytelseType && ytelseType.kode === fagsakYtelseType.SVANGERSKAPSPENGER) {
    apCode = behandlingspunktToAksjonspunktSvangerskapspenger[behandlingspunkt];
  } else {
    apCode = behandlingspunktToAksjonspunktEngangsstonad[behandlingspunkt];
  }
  return isObject(apCode)
    ? apCode[allVilkar.map((v) => v.vilkarType.kode).find((v) => apCode[v])]
    : apCode;
};

export default getApCode;

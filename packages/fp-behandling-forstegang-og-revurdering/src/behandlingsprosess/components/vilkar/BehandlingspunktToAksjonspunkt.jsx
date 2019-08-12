import { behandlingspunktCodes } from '@fpsak-frontend/fp-felles';
import aksjonspunktCode from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
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

export const getApCode = (behandlingspunkt, isForeldrepenger, allVilkar) => {
  const apCode = isForeldrepenger
    ? behandlingspunktToAksjonspunktForeldrepenger[behandlingspunkt]
    : behandlingspunktToAksjonspunktEngangsstonad[behandlingspunkt];
  return isObject(apCode)
    ? apCode[allVilkar.map(v => v.vilkarType.kode).find(v => apCode[v])]
    : apCode;
};

export const getAllApCodes = (behandlingspunkt) => {
  const esAp = behandlingspunktToAksjonspunktEngangsstonad[behandlingspunkt];
  const apCodes = esAp ? [esAp] : [];
  const fpAps = behandlingspunktToAksjonspunktForeldrepenger[behandlingspunkt];
  if (isObject(fpAps)) {
    return apCodes.concat(Object.values(fpAps));
  }
  if (fpAps) {
    return apCodes.concat([fpAps]);
  }
  return apCodes;
};

import { behandlingspunktCodes } from '@fpsak-frontend/fp-felles';
import aksjonspunktCode from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { isObject } from '@fpsak-frontend/utils';

const behandlingspunktToAksjonspunktEngangsstonad = {
  [behandlingspunktCodes.FOEDSEL]: aksjonspunktCode.OVERSTYR_FODSELSVILKAR,
  [behandlingspunktCodes.ADOPSJON]: aksjonspunktCode.OVERSTYR_ADOPSJONSVILKAR,
  [behandlingspunktCodes.MEDLEMSKAP]: aksjonspunktCode.OVERSTYR_MEDLEMSKAPSVILKAR,
  [behandlingspunktCodes.SOEKNADSFRIST]: aksjonspunktCode.OVERSTYR_SOKNADSFRISTVILKAR,
  [behandlingspunktCodes.OPPTJENING]: aksjonspunktCode.OVERSTYRING_AV_OPPTJENINGSVILKARET,
};

export const hentAlleOverstyringAksjonspunktKoderFor = (behandlingspunkt) => {
  const esAp = behandlingspunktToAksjonspunktEngangsstonad[behandlingspunkt];
  return esAp ? [esAp] : [];
};

export const hentOverstyringAksjonspunktKodeFor = (behandlingspunkt, allVilkar) => {
  const apCode = behandlingspunktToAksjonspunktEngangsstonad[behandlingspunkt];
  return isObject(apCode)
    ? apCode[allVilkar.map((v) => v.vilkarType.kode).find((v) => apCode[v])]
    : apCode;
};

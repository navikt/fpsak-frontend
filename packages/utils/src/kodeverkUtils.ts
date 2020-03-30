import { KodeverkMedNavn, Kodeverk } from '@fpsak-frontend/types';

export const getKodeverknavnFraKode = (
  alleKodeverk: {[key: string]: KodeverkMedNavn[]},
  kodeverkType: string,
  kode: string,
  undertype?: string,
) => {
  let kodeverkForType = alleKodeverk[kodeverkType];
  if (!kodeverkForType || kodeverkForType.length === 0) {
    return '';
  }
  if (undertype) {
    kodeverkForType = kodeverkForType[undertype];
  }

  const kodeverk = kodeverkForType.find((k) => k.kode === kode);
  return kodeverk ? kodeverk.navn : '';
};

export const getKodeverknavnFn = (
  alleKodeverk: {[key: string]: KodeverkMedNavn[]},
  kodeverkTyper: {[key: string]: string},
) => (
  kodeverkOjekt: Kodeverk,
  undertype?: string,
) => getKodeverknavnFraKode(
  alleKodeverk, kodeverkTyper[kodeverkOjekt.kodeverk], kodeverkOjekt.kode, undertype,
);

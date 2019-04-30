export const getKodeverknavnFraKode = (alleKodeverk, kodeverkType, kode, undertype) => {
  let kodeverkForType = alleKodeverk[kodeverkType];
  if (!kodeverkForType || kodeverkForType.length === 0) {
    return '';
  }
  if (undertype) {
    kodeverkForType = kodeverkForType[undertype];
  }

  const kodeverk = kodeverkForType.find(k => k.kode === kode);
  return kodeverk ? kodeverk.navn : '';
};

export const getKodeverknavnFn = (alleKodeverk, kodeverkTyper) => (kodeverkOjekt, undertype) => getKodeverknavnFraKode(
  alleKodeverk, kodeverkTyper[kodeverkOjekt.kodeverk], kodeverkOjekt.kode, undertype,
);

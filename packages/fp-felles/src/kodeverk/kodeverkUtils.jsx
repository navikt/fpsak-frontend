export const getKodeverknavnFraKode = (alleKodeverk, kodeverkType, kode) => {
  const kodeverkForType = alleKodeverk[kodeverkType];
  if (!kodeverkForType || kodeverkForType.length === 0) {
    return '';
  }
  const kodeverk = kodeverkForType.find(k => k.kode === kode);
  return kodeverk ? kodeverk.navn : '';
};

export const getKodeverknavnFn = (alleKodeverk, kodeverkTyper) => kodeverkOjekt => getKodeverknavnFraKode(
  alleKodeverk, kodeverkTyper[kodeverkOjekt.kodeverk], kodeverkOjekt.kode,
);

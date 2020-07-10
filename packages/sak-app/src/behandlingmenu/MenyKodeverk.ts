import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';

class MenyKodeverk {
  $$behandlingType;

  $$fpSakKodeverk;

  $$fpTilbakeKodeverk;

  constructor(behandlingType) {
    this.$$behandlingType = behandlingType;
  }

  medFpSakKodeverk(fpSakKodeverk) {
    this.$$fpSakKodeverk = fpSakKodeverk;
    return this;
  }

  medFpTilbakeKodeverk(fpTilbakeKodeverk = {}) {
    this.$$fpTilbakeKodeverk = fpTilbakeKodeverk;
    return this;
  }

  getKodeverkForBehandlingstype(behandlingTypeKode, kodeverkType) {
    if (behandlingTypeKode === BehandlingType.TILBAKEKREVING || behandlingTypeKode === BehandlingType.TILBAKEKREVING_REVURDERING) {
      return this.$$fpTilbakeKodeverk[kodeverkType];
    }
    return this.$$fpSakKodeverk[kodeverkType];
  }

  getKodeverkForValgtBehandling(kodeverkType) {
    return this.getKodeverkForBehandlingstype(this.$$behandlingType.kode, kodeverkType);
  }

  getKodeverkForBehandlingstyper(behandlingTypeKoder, kodeverkType) {
    return behandlingTypeKoder.reduce((acc, btk) => {
      const alleKodeverkForKodeverkType = this.getKodeverkForBehandlingstype(btk, kodeverkType);
      return alleKodeverkForKodeverkType ? acc.concat([alleKodeverkForKodeverkType.find((k) => k.kode === btk)]) : acc;
    }, []);
  }
}

export default MenyKodeverk;

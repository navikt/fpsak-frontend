// TODO (TOR) default export feilar for yarn:coverage
// eslint-disable-next-line import/prefer-default-export
export type KlageVurdering = Readonly<{
  klageVurderingResultatNK: {
    klageVurdertAv: string;
    klageVurdering?: string;
    fritekstTilBrev?: string;
    klageMedholdArsakNavn?: string;
    godkjentAvMedunderskriver: boolean;
  };
  klageVurderingResultatNFP: {
    klageVurdertAv: string;
    klageVurdering?: string;
    fritekstTilBrev?: string;
    klageMedholdArsakNavn?: string;
    godkjentAvMedunderskriver: boolean;
  };
  klageFormkravResultatKA: {
    avvistArsaker: [{
      navn?: string;
    }];
  };
  klageFormkravResultatNFP: {
    avvistArsaker: [{
      navn?: string;
    }];
  };
}>

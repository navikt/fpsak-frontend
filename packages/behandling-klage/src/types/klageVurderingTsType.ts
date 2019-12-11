type KlageVurdering = Readonly<{
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
    avvistArsaker: {
      navn?: string;
    }[];
  };
  klageFormkravResultatNFP: {
    avvistArsaker: {
      navn?: string;
    }[];
  };
}>

export default KlageVurdering;

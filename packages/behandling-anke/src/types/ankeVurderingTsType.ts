type AnkeVurdering = Readonly<{
  ankeVurderingResultat: {
    ankeVurdering: string;
    ankeVurderingOmgjoer?: string;
    ankeOmgjoerArsakNavn?: string;
    begrunnelse: string;
    paAnketBehandlingId?: number;
    erAnkerIkkePart: boolean;
    erIkkeKonkret: boolean;
    erFristIkkeOverholdt: boolean;
    erIkkeSignert: boolean;
    erSubsidiartRealitetsbehandles: boolean;
  };
}>

export default AnkeVurdering;

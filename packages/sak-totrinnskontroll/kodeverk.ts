export interface AlleKodeverk {
  AktivitetStatus: Kodeverk[];
  AnkeVurdering: Kodeverk[];
  ArbeidsforholdHandlingType: Kodeverk[];
  Arbeidskategori: Kodeverk[];
  ArbeidType: Kodeverk[];
  Avslagsårsak: { [key: string]: Kodeverk[] };
  BehandlingResultatType: Kodeverk[];
  BehandlingStatus: Kodeverk[];
  BehandlingType: Kodeverk[];
  BehandlingÅrsakType: Kodeverk[];
  BeregningsgrunnlagAndeltype: Kodeverk[];
  DokumentTypeId: Kodeverk[];
  FagsakStatus: Kodeverk[];
  FagsakYtelseType: Kodeverk[];
  Fagsystem: Kodeverk[];
  FaktaOmBeregningTilfelle: Kodeverk[];
  FamilieHendelseType: Kodeverk[];
  FarSøkerType: Kodeverk[];
  ForeldreType: Kodeverk[];
  GraderingAvslagÅrsak: Årsak[];
  HistorikkAktør: Kodeverk[];
  HistorikkBegrunnelseType: Kodeverk[];
  HistorikkEndretFeltType: Kodeverk[];
  HistorikkinnslagType: Kodeverk[];
  HistorikkOpplysningType: Kodeverk[];
  IkkeOppfyltÅrsak: Årsak[];
  InnsynResultatType: Kodeverk[];
  Inntektskategori: Kodeverk[];
  InnvilgetÅrsak: Årsak[];
  KlageAvvistÅrsak: Kodeverk[];
  KlageMedholdÅrsak: Kodeverk[];
  KonsekvensForYtelsen: Kodeverk[];
  Landkoder: Kodeverk[];
  ManuellBehandlingÅrsak: Kodeverk[];
  MedlemskapDekningType: Kodeverk[];
  MedlemskapManuellVurderingType: Kodeverk[];
  MedlemskapType: Kodeverk[];
  MorsAktivitet: Kodeverk[];
  OmsorgsovertakelseVilkårType: Kodeverk[];
  OppgaveÅrsak: Kodeverk[];
  OppholdÅrsak: Kodeverk[];
  OpptjeningAktivitetType: Kodeverk[];
  OverføringÅrsak: Kodeverk[];
  PermisjonsbeskrivelseType: Kodeverk[];
  PersonstatusType: Kodeverk[];
  Region: Kodeverk[];
  RelatertYtelseTilstand: Kodeverk[];
  RelatertYtelseType: Kodeverk[];
  RevurderingVarslingÅrsak: Kodeverk[];
  SivilstandType: Kodeverk[];
  SkjermlenkeType: Kodeverk[];
  StønadskontoType: Kodeverk[];
  TilbakekrevingVidereBehandling: Kodeverk[];
  UtsettelseÅrsak: Kodeverk[];
  UttakArbeidType: Kodeverk[];
  UttakPeriodeType: Kodeverk[];
  UttakPeriodeVurderingType: Kodeverk[];
  UttakUtsettelseType: Kodeverk[];
  Venteårsak: Kodeverk[];
  VergeType: Kodeverk[];
  VilkårType: Kodeverk[];
  VirksomhetType: Kodeverk[];
  VurderArbeidsforholdHistorikkinnslag: Kodeverk[];
  VurderÅrsak: Kodeverk[];
}

export interface Kodeverk {
  kode: string;
  kodeverk: string;
  navn: null | string;
}

export interface Årsak {
  gyldigFom: string;
  gyldigTom: string;
  kode: string;
  kodeverk: KodeverkEnum;
  navn: string;
}

export enum KodeverkEnum {
  GraderingAvslagAarsak = 'GRADERING_AVSLAG_AARSAK',
  IkkeOppfyltAarsak = 'IKKE_OPPFYLT_AARSAK',
  InnvilgetAarsak = 'INNVILGET_AARSAK',
}

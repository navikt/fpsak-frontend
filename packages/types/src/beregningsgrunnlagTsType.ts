import Kodeverk from './kodeverkTsType';

type BeregningsgrunnlagArbeidsforhold = Readonly<{
  arbeidsgiverNavn?: string;
  arbeidsgiverId?: string;
  startdato?: string;
  opphoersdato?: string;
  arbeidsforholdId?: string;
  arbeidsforholdType?: Kodeverk;
}>

type FaktaOmBeregningAndel = Readonly<{
  arbeidsforhold?: BeregningsgrunnlagArbeidsforhold;
  andelsnr?: number;
  inntektskategori?: Kodeverk;
  aktivitetStatus?: Kodeverk;
}>

type AndelForFaktaOmBeregning = Readonly<{
  arbeidsforhold: BeregningsgrunnlagArbeidsforhold;
  andelsnr?: number;
  inntektskategori?: Kodeverk;
  aktivitetStatus?: Kodeverk;
  belopReadOnly?: number;
  fastsattBelop?: number;
  visningsnavn: string;
  skalKunneEndreAktivitet: boolean;
  lagtTilAvSaksbehandler: boolean;
}>

type RefusjonskravSomKommerForSentListe = Readonly<{
  arbeidsgiverId: string;
  arbeidsgiverVisningsnavn: string;
  erRefusjonskravGyldig?: boolean;
}>

type VurderMilitaer = Readonly<{
  harMilitaer?: boolean;
}>

type VurderBesteberegning = Readonly<{
  skalHaBesteberegning?: boolean;
}>

type AvklarAktiviteter = Readonly<{
  aktiviteterTomDatoMapping?: {
    tom: string;
    aktiviteter: {
      arbeidsgiverNavn?: string;
      arbeidsgiverId?: string;
      eksternArbeidsforholdId?: string;
      fom: string;
      tom?: string;
      arbeidsforholdId?: string;
      arbeidsforholdType: Kodeverk;
      aktørIdString?: string;
    }[];
  }[];
}>

type FaktaOmBeregning = Readonly<{
  beregningsgrunnlagArbeidsforhold?: (BeregningsgrunnlagArbeidsforhold & {
    erTidsbegrensetArbeidsforhold?: boolean;
  })[];
  avklarAktiviteter?: AvklarAktiviteter;
  frilansAndel?: FaktaOmBeregningAndel;
  vurderMilitaer?: VurderMilitaer;
  vurderBesteberegning?: VurderBesteberegning;
  refusjonskravSomKommerForSentListe?: RefusjonskravSomKommerForSentListe[];
  arbeidsforholdMedLønnsendringUtenIM?: FaktaOmBeregningAndel[];
  andelerForFaktaOmBeregning: AndelForFaktaOmBeregning[];
}>

type Beregningsgrunnlag = Readonly<{
  aktivitetStatus?: {
    aktivitetStatus: Kodeverk;
  }[];
  beregningsgrunnlagPeriode?: {
    beregningsgrunnlagPrStatusOgAndel?: {
      aktivitetStatus?: Kodeverk;
      arbeidsforholdType?: Kodeverk;
      beregnetPrAar?: number;
      arbeidsforholdId?: string;
      erNyIArbeidslivet?: boolean;
      erTidsbegrensetArbeidsforhold?: boolean;
      erNyoppstartet?: boolean;
      arbeidsgiverId?: string;
      arbeidsgiverNavn?: string;
      andelsnr?: number;
      lonnsendringIBeregningsperioden?: boolean;
      overstyrtPrAar?: number;
    }[];
  }[];
  faktaOmBeregning: FaktaOmBeregning;
}>

export default Beregningsgrunnlag;

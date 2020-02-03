import Kodeverk from './kodeverkTsType';

type Arbeidsforhold = Readonly<{
  id?: string;
  navn?: string;
  arbeidsgiverIdentifikator?: string;
  arbeidsgiverIdentifiktorGUI?: string;
  arbeidsforholdId?: string;
  fomDato?: string;
  tomDato?: string;
  kilde: {
    navn: string;
  };
  mottattDatoInntektsmelding?: string;
  stillingsprosent?: number;
  brukArbeidsforholdet?: boolean;
  fortsettBehandlingUtenInntektsmelding?: boolean;
  erNyttArbeidsforhold?: boolean;
  erSlettet?: boolean;
  erstatterArbeidsforholdId?: string;
  harErsattetEttEllerFlere?: boolean;
  ikkeRegistrertIAaRegister?: boolean;
  tilVurdering?: boolean;
  vurderOmSkalErstattes?: boolean;
  erEndret?: boolean;
  brukMedJustertPeriode?: boolean;
  overstyrtTom?: string;
  lagtTilAvSaksbehandler?: boolean;
  basertPaInntektsmelding?: boolean;
  inntektMedTilBeregningsgrunnlag?: boolean;
  skjaeringstidspunkt?: string;
  begrunnelse?: string;
  permisjoner?: {
    permisjonFom?: string;
    permisjonTom?: string;
    permisjonsprosent?: number;
    type?: Kodeverk;
  }[];
  brukPermisjon?: boolean;
}>

export default Arbeidsforhold;

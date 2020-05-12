import Arbeidsforhold from './arbeidsforholdTsType';

type InntektArbeidYtelse = Readonly<{
  relatertTilgrensendeYtelserForSoker?: {
    relatertYtelseType: string;
    tilgrensendeYtelserListe?: {
      periodeTilDato: string;
      periodeFraDato: string;
      status: string;
      saksNummer: string;
    }[];
  }[];
  relatertTilgrensendeYtelserForAnnenForelder?: {
    relatertYtelseType: string;
    tilgrensendeYtelserListe: {
      periodeTilDato: string;
      periodeFraDato: string;
      status: string;
      saksNummer: string;
    }[];
  }[];
  inntektsmeldinger?: {
    arbeidsgiverStartdato?: string;
  }[];
  arbeidsforhold?: Arbeidsforhold[];
  skalKunneLeggeTilNyeArbeidsforhold: boolean;
}>

export default InntektArbeidYtelse;

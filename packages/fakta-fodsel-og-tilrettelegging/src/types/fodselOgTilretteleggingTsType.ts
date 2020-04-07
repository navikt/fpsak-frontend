import Arbeidsforhold from './arbeidsforholdTsType';

type FodselOgTilrettelegging = Readonly<{
  termindato?: string;
  fødselsdato?: string;
  arbeidsforholdListe: Arbeidsforhold[];
  saksbehandlet: boolean;
}>

export default FodselOgTilrettelegging;

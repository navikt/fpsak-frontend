import { Kodeverk } from '@fpsak-frontend/types';

type FodselOgTilrettelegging = Readonly<{
  tilretteleggingId: number;
  tilretteleggingBehovFom: string;
  tilretteleggingDatoer: {
    fom: string;
    type: Kodeverk;
    stillingsprosent?: number;
    overstyrtUtbetalingsgrad?: boolean;
  }[];
  arbeidsgiverNavn: string;
  arbeidsgiverIdent?: string;
  arbeidsgiverIdentVisning?: string;
  opplysningerOmRisiko?: string;
  opplysningerOmTilrettelegging?: string;
  internArbeidsforholdReferanse?: string;
  eksternArbeidsforholdReferanse?: string;
  skalBrukes: boolean;
  begrunnelse?: string;
}>

export default FodselOgTilrettelegging;

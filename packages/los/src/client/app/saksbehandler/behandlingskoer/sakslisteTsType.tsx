import { Kodeverk } from 'kodeverk/kodeverkTsType';

type AnnetKriterie = Readonly<{
  andreKriterierType: Kodeverk;
  inkluder: boolean;
}>;

// TODO (TOR) default export feilar for yarn:coverage
// eslint-disable-next-line import/prefer-default-export
export type Saksliste = Readonly<{
  sakslisteId: number;
  navn: string;
  behandlingTyper: Kodeverk[];
  fagsakYtelseTyper: Kodeverk[];
  andreKriterier: AnnetKriterie[];
   sortering?: {
    sorteringType: Kodeverk;
    fomDager?: number;
    tomDager?: number;
    fomDato?: string;
    tomDato?: string;
    erDynamiskPeriode: boolean;
  };
}>

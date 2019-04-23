import { Kodeverk } from 'kodeverk/kodeverkTsType';
import { Person } from './personTsType';

// TODO (TOR) default export feilar for yarn:coverage
// eslint-disable-next-line import/prefer-default-export
export type Fagsak = Readonly<{
  saksnummer: number;
  sakstype: Kodeverk;
  status: Kodeverk;
  person: Person;
  barnFodt?: string;
  behandlingStatus?: Kodeverk;
  opprettet: string;
  endret?: string;
}>;

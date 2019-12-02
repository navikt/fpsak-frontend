import { Kodeverk } from './kodeverkTsType';

// TODO (TOR) default export feilar for yarn:coverage
// eslint-disable-next-line import/prefer-default-export
export type FagsakPerson = Readonly<{
  alder: number;
  diskresjonskode?: Kodeverk;
  dodsdato?: string;
  erDod: boolean;
  erKvinne: boolean;
  navn: string;
  personnummer: string;
  personstatusType: Kodeverk;
}>

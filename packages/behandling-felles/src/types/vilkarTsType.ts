import { Kodeverk } from './kodeverkTsType';

// TODO (TOR) default export feilar for yarn:coverage
// eslint-disable-next-line import/prefer-default-export
export type Vilkar = Readonly<{
  lovReferanse?: string;
  vilkarType: Kodeverk;
  vilkarStatus: Kodeverk;
}>

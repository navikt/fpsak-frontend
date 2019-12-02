import { Kodeverk } from './kodeverkTsType';

// TODO (TOR) default export feilar for yarn:coverage
// eslint-disable-next-line import/prefer-default-export
export type Behandling = Readonly<{
  id: number;
  versjon: number;
  uuid: string;
  status: Kodeverk;
}>

import { Kodeverk } from 'kodeverk/kodeverkTsType';

// TODO (TOR) default export feilar for yarn:coverage
// eslint-disable-next-line import/prefer-default-export
export type NyeOgFerdigstilteOppgaver = Readonly<{
  behandlingType: Kodeverk;
  antallNye: number;
  antallFerdigstilte: number;
  dato: string;
}>

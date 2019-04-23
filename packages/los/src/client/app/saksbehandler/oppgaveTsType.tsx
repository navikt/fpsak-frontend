import { Kodeverk } from 'kodeverk/kodeverkTsType';
import { OppgaveStatus } from './oppgaveStatusTsType';

// TODO (TOR) default export feilar for yarn:coverage
// eslint-disable-next-line import/prefer-default-export
export type Oppgave = Readonly<{
  id: number;
  status: OppgaveStatus;
  saksnummer: number;
  behandlingId: number;
  personnummer: string;
  navn: string;
  behandlingstype: Kodeverk;
  behandlingStatus: Kodeverk;
  opprettetTidspunkt: string;
  behandlingsfrist: string;
  fagsakYtelseType: Kodeverk;
  erTilSaksbehandling: boolean;
}>

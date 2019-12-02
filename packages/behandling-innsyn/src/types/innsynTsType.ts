import { Kodeverk } from '@fpsak-frontend/behandling-felles';

// TODO (TOR) default export feilar for yarn:coverage
// eslint-disable-next-line import/prefer-default-export
export type Innsyn = Readonly<{
  dokumenter: [{
    journalpostId: string;
    dokumentId: string;
    tidspunkt: string;
  }];
  innsynMottattDato: string;
  innsynResultatType: Kodeverk;
  vedtaksdokumentasjon: {
    dokumentId: string;
    tittel: string;
    opprettetDato: string;
  };
}>

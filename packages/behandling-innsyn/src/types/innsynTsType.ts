import { Kodeverk } from '@fpsak-frontend/behandling-felles';

type Innsyn = Readonly<{
  dokumenter: {
    journalpostId: string;
    dokumentId: string;
    tidspunkt: string;
  }[];
  innsynMottattDato: string;
  innsynResultatType: Kodeverk;
  vedtaksdokumentasjon: {
    dokumentId: string;
    tittel: string;
    opprettetDato: string;
  };
}>

export default Innsyn;

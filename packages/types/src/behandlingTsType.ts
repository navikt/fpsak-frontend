import Kodeverk from './kodeverkTsType';

type Behandling = Readonly<{
  id: number;
  versjon: number;
  uuid?: string;
  status: Kodeverk;
  type: Kodeverk;
  fristBehandlingPaaVent?: string;
  venteArsakKode?: string;
  behandlingPaaVent: boolean;
  behandlingHenlagt: boolean;
  behandlingsresultat?: {
    type: Kodeverk;
  };
  links: {
    href: string;
    rel: string;
    requestPayload?: any;
    type: string;
  }[];
  taskStatus?: {
    readOnly: boolean;
  };
  opprettet: string;
  avsluttet?: string;
  erAktivPapirsoknad: boolean;
  gjeldendeVedtak: boolean;
  sprakkode: Kodeverk;
  behandlendeEnhetId: string;
  behandlendeEnhetNavn: string;
  behandlingKoet: boolean;
  toTrinnsBehandling: boolean;
  behandlingArsaker: {}[];
  ansvarligSaksbehandler?: string;
  kanHenleggeBehandling?: boolean;
}>

export default Behandling;

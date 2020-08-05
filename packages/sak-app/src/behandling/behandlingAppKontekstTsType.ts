import { Kodeverk, Behandlingsresultat } from '@fpsak-frontend/types';

type BehandlingAppKontekst = Readonly<{
  id: number;
  versjon: number;
  uuid?: string;
  status: Kodeverk;
  type: Kodeverk;
  fristBehandlingPaaVent?: string;
  venteArsakKode?: string;
  behandlingPaaVent: boolean;
  behandlingHenlagt: boolean;
  behandlingsresultat?: Behandlingsresultat;
  links: {
    href: string;
    rel: string;
    requestPayload?: any;
    type: string;
  }[];
  opprettet: string;
  avsluttet?: string;
  erAktivPapirsoknad: boolean;
  gjeldendeVedtak: boolean;
  sprakkode: Kodeverk;
  behandlendeEnhetId: string;
  behandlendeEnhetNavn: string;
  behandlingKoet: boolean;
  toTrinnsBehandling: boolean;
  behandlingArsaker: {
    behandlingArsakType: Kodeverk;
  }[];
  ansvarligSaksbehandler?: string;
  kanHenleggeBehandling?: boolean;
  harVerge?: boolean;
}>

export default BehandlingAppKontekst;

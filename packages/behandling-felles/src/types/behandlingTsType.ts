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
}>

export default Behandling;

import Kodeverk from './kodeverkTsType';

type Fagsak = Readonly<{
  saksnummer: number;
  sakstype: Kodeverk;
  relasjonsRolleType: Kodeverk;
  status: Kodeverk;
  barnFodt: string;
  person: {
    erDod: boolean;
    navn: string;
    alder: number;
    personnummer: string;
    erKvinne: boolean;
    personstatusType: Kodeverk;
    diskresjonskode?: Kodeverk;
    dodsdato?: string;
  };
  opprettet: string;
  endret: string;
  antallBarn: number;
  kanRevurderingOpprettes: boolean;
  skalBehandlesAvInfotrygd: boolean;
  dekningsgrad: number;
}>

export default Fagsak;

import Kodeverk from './kodeverkTsType';
import FagsakPerson from './fagsakPersonTsType';

type Fagsak = Readonly<{
  saksnummer: number;
  sakstype: Kodeverk;
  relasjonsRolleType: Kodeverk;
  status: Kodeverk;
  barnFodt: string;
  person: FagsakPerson;
  opprettet: string;
  endret: string;
  antallBarn: number;
  kanRevurderingOpprettes: boolean;
  skalBehandlesAvInfotrygd: boolean;
  dekningsgrad: number;
}>

export default Fagsak;

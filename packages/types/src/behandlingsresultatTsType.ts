import Kodeverk from './kodeverkTsType';

type Behandlingsresultat = Readonly<{
  type: Kodeverk;
  fritekstbrev?: string;
  overskrift?: string;
  vedtaksbrev?: Kodeverk;
  avslagsarsak?: Kodeverk;
  avslagsarsakFritekst?: string;
}>

export default Behandlingsresultat;

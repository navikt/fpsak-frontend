import Kodeverk from './kodeverkTsType';

type Vilkar = Readonly<{
  lovReferanse?: string;
  vilkarType: Kodeverk;
  vilkarStatus: Kodeverk;
}>

export default Vilkar;

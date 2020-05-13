import { Kodeverk, FagsakPerson } from '@fpsak-frontend/types';

type FagsakInfo = Readonly<{
  saksnummer: number;
  fagsakYtelseType: Kodeverk;
  fagsakPerson: FagsakPerson;
  fagsakStatus: Kodeverk;
}>

export default FagsakInfo;

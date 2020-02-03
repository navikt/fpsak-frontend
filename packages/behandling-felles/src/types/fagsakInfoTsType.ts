import { Kodeverk } from '@fpsak-frontend/types';

import FagsakPerson from './fagsakPersonTsType';

type FagsakInfo = Readonly<{
  saksnummer: number;
  fagsakYtelseType: Kodeverk;
  fagsakPerson: FagsakPerson;
  fagsakStatus: Kodeverk;
}>

export default FagsakInfo;

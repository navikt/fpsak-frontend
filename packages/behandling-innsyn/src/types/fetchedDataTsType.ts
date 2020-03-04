import {
  Aksjonspunkt, Vilkar, Dokument,
} from '@fpsak-frontend/types';

import Innsyn from './innsynTsType';

interface FetchedData {
  aksjonspunkter: Aksjonspunkt[];
  vilkar: Vilkar[];
  innsyn: Innsyn;
  innsynDokumenter: Dokument[];
}

export default FetchedData;

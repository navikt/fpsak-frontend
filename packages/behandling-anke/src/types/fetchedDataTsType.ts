import { Aksjonspunkt, Vilkar } from '@fpsak-frontend/types';

import AnkeVurdering from './ankeVurderingTsType';

interface FetchedData {
  aksjonspunkter: Aksjonspunkt[];
  vilkar: Vilkar[];
  ankeVurdering: AnkeVurdering;
}

export default FetchedData;

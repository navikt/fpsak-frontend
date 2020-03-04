import { Aksjonspunkt, Vilkar } from '@fpsak-frontend/types';

import KlageVurdering from './klageVurderingTsType';

interface FetchedData {
  aksjonspunkter: Aksjonspunkt[];
  vilkar: Vilkar[];
  klageVurdering: KlageVurdering;
}

export default FetchedData;

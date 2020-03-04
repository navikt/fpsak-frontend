import { Aksjonspunkt } from '@fpsak-frontend/types';

import PerioderForeldelse from './perioderForeldelseTsType';
import Beregningsresultat from './beregningsresultatTsType';

interface FetchedData {
  aksjonspunkter: Aksjonspunkt[];
  perioderForeldelse: PerioderForeldelse;
  beregningsresultat: Beregningsresultat;
  feilutbetalingFakta: {};
}

export default FetchedData;

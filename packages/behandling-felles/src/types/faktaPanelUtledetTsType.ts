import { Aksjonspunkt } from '@fpsak-frontend/types';

import FaktaPanelDef from '../util/FaktaPanelDef';

interface FaktaPanelUtledet {
  panelDef: FaktaPanelDef;
  harApneAksjonspunkter: boolean;
  komponentData: {
    aksjonspunkter: Aksjonspunkt[];
    readOnly: boolean;
    submittable: boolean;
    harApneAksjonspunkter: boolean;
    alleMerknaderFraBeslutter: {};
  };
}

export default FaktaPanelUtledet;

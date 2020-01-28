import { ReactNode } from 'react';

import { EndpointOperations } from '@fpsak-frontend/rest-api-redux';

import Aksjonspunkt from './aksjonspunktTsType';

interface FaktaPanelUtledet {
  urlCode: string;
  textCode: string;
  endpoints: EndpointOperations[];
  renderComponent: (props: {}) => ReactNode;
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

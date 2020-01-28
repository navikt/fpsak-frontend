import { ReactNode } from 'react';
import { EndpointOperations } from '@fpsak-frontend/rest-api-redux';

interface FaktaPanelDefinisjon {
  urlCode: string;
  textCode: string;
  aksjonspunkterCodes: string[];
  endpoints: EndpointOperations[];
  renderComponent: (props: {}) => ReactNode;
  showComponent: (data?: {}) => true | false;
  getData: (data?: {}) => {};
}

export default FaktaPanelDefinisjon;

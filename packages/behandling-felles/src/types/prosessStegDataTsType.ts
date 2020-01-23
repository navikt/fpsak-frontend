import { EndpointOperations } from '@fpsak-frontend/rest-api-redux';
import { ReactNode } from 'react';

interface ProsessStegData {
  code: string;
  renderComponent: (props: {}) => ReactNode;
  endpoints: EndpointOperations[];
  komponentData: {};
  isAksjonspunktOpen: boolean;
  aksjonspunktHelpTextCodes: string[];
}
export default ProsessStegData;

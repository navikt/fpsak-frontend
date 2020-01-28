import { ReactNode } from 'react';
import { EndpointOperations } from '@fpsak-frontend/rest-api-redux';

import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';

export interface ProsessStegPanelDefinisjon {
  textCode?: string;
  code?: string;
  aksjonspunkterCodes: string[];
  vilkarCodes: string[];
  endpoints: EndpointOperations[];
  renderComponent: (props: {}) => ReactNode;
  getData: (data?: {}) => {};
  isOverridable: boolean;
  showComponent?: (data?: {}) => true | false;
  overrideStatus?: (data?: {}) => vilkarUtfallType.OPPFYLT | vilkarUtfallType.IKKE_OPPFYLT | vilkarUtfallType.IKKE_VURDERT;
  aksjonspunkterTextCodes?: string[];
  overridePanel?: {
    endpoints: EndpointOperations[];
    showComponent: (data?: {}) => true | false;
    renderComponent: (props: {}) => ReactNode;
    getData: (data?: {}) => {};
    isOverridable: boolean;
    aksjonspunkterTextCodes?: string[];
  };
}

interface ProsessStegDefinisjon {
  urlCode: string;
  textCode: string;
  panels: ProsessStegPanelDefinisjon[];
}

export default ProsessStegDefinisjon;

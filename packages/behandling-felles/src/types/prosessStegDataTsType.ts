import { SetStateAction, ReactNode } from 'react';

import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { EndpointOperations } from '@fpsak-frontend/rest-api-redux';

import Aksjonspunkt from './aksjonspunktTsType';
import Vilkar from './vilkarTsType';

export interface ProsessStegPanelData {
  code: string;
  endpoints: EndpointOperations[];
  renderComponent: (props: {}) => ReactNode;
  aksjonspunkter: Aksjonspunkt[];
  isAksjonspunktOpen: boolean;
  aksjonspunktHelpTextCodes: string[];
  isReadOnly: boolean;
  status: vilkarUtfallType.IKKE_OPPFYLT | vilkarUtfallType.OPPFYLT |vilkarUtfallType.IKKE_VURDERT;
  komponentData: {
    isReadOnly: boolean;
    readOnlySubmitButton: boolean;
    aksjonspunkter: Aksjonspunkt[];
    vilkar: Vilkar[];
    isAksjonspunktOpen: boolean;
    overrideReadOnly?: boolean;
    erOverstyrt?: boolean;
    panelTittelKode?: string;
    erMedlemskapsPanel?: boolean;
    lovReferanse?: string;
    overstyringApKode?: string;
    kanOverstyreAccess?: {};
    toggleOverstyring?: (overstyrtPanel: SetStateAction<string[]>) => void;
  };
}

interface ProsessStegData {
  urlCode: string;
  erStegBehandlet: boolean;
  prosessStegTittelKode: string;
  isAksjonspunktOpen: boolean;
  isReadOnly: boolean;
  aksjonspunkter: Aksjonspunkt[];
  status: vilkarUtfallType.IKKE_OPPFYLT | vilkarUtfallType.OPPFYLT |vilkarUtfallType.IKKE_VURDERT;
  panelData: ProsessStegPanelData[];
}

export default ProsessStegData;

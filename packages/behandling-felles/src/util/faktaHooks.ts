import { useCallback, useEffect, useMemo } from 'react';
import { Dispatch } from 'redux';

import { EndpointOperations } from '@fpsak-frontend/rest-api-redux';
import { Behandling, Aksjonspunkt } from '@fpsak-frontend/types';

import {
  utledFaktaPaneler, finnValgtPanel, formaterPanelerForSidemeny, getBekreftAksjonspunktCallback,
} from './faktaUtils';
import FagsakInfo from '../types/fagsakInfoTsType';
import Rettigheter from '../types/rettigheterTsType';
import FaktaPanelDef from './FaktaPanelDef';
import FaktaPanelUtledet from '../types/faktaPanelUtledetTsType';
import FaktaPanelFaktaPanelMenyRadMeny from '../types/faktaPanelMenyRadTsType';

const useFaktaPaneler = (
  faktaPanelDefinisjoner: FaktaPanelDef[],
  panelData: {},
  behandling: Behandling,
  rettigheter: Rettigheter,
  aksjonspunkter: Aksjonspunkt[],
  hasFetchError: boolean,
  valgtFaktaPanelKode: string,
  intl,
): [FaktaPanelUtledet[], FaktaPanelUtledet, FaktaPanelFaktaPanelMenyRadMeny[]] => {
  const faktaPaneler = useMemo(() => utledFaktaPaneler(faktaPanelDefinisjoner, panelData, behandling, rettigheter,
    aksjonspunkter, hasFetchError),
  [behandling.versjon]);

  const valgtPanel = useMemo(() => finnValgtPanel(faktaPaneler, valgtFaktaPanelKode), [behandling.versjon, valgtFaktaPanelKode]);

  const urlCode = valgtPanel ? valgtPanel.panelDef.getUrlKode() : undefined;
  const formaterteFaktaPaneler = useMemo(() => formaterPanelerForSidemeny(intl, faktaPaneler, urlCode),
    [behandling.versjon, urlCode]);

  return [faktaPaneler, valgtPanel, formaterteFaktaPaneler];
};

const useFaktaAksjonspunktNotifikator = (
  faktaPaneler: FaktaPanelUtledet[],
  setApentFaktaPanel: ({ urlCode, textCode }) => void,
  behandlingVersjon: number,
) => {
  useEffect(() => {
    const panelMedApentAp = faktaPaneler.find((p) => p.harApneAksjonspunkter);
    if (panelMedApentAp) {
      setApentFaktaPanel({ urlCode: panelMedApentAp.panelDef.getUrlKode(), textCode: panelMedApentAp.panelDef.getTekstKode() });
    } else {
      setApentFaktaPanel(undefined);
    }
  }, [behandlingVersjon]);
};

const useCallbacks = (
  faktaPaneler: FaktaPanelUtledet[],
  fagsak: FagsakInfo,
  behandling: Behandling,
  oppdaterProsessStegOgFaktaPanelIUrl: (prosessPanel?: string, faktanavn?: string) => void,
  valgtProsessSteg: string,
  overstyringApCodes: string[],
  behandlingApi: {[name: string]: EndpointOperations},
  dispatch: Dispatch,
) => {
  const velgFaktaPanelCallback = useCallback((index) => oppdaterProsessStegOgFaktaPanelIUrl(valgtProsessSteg, faktaPaneler[index].panelDef.getUrlKode()),
    [behandling.versjon, valgtProsessSteg]);

  const bekreftAksjonspunktCallback = useCallback(getBekreftAksjonspunktCallback(dispatch, fagsak, behandling,
    oppdaterProsessStegOgFaktaPanelIUrl, overstyringApCodes, behandlingApi),
  [behandling.versjon]);

  return [velgFaktaPanelCallback, bekreftAksjonspunktCallback];
};

const faktaHooks = {
  useFaktaPaneler,
  useFaktaAksjonspunktNotifikator,
  useCallbacks,
};

export default faktaHooks;

import { useCallback, useEffect, useMemo } from 'react';
import { Dispatch } from 'redux';

import { EndpointOperations } from '@fpsak-frontend/rest-api-redux';
import { Behandling, Aksjonspunkt } from '@fpsak-frontend/types';

import {
  utledFaktaPaneler, finnValgtPanel, formaterPanelerForSidemeny, getBekreftAksjonspunktCallback,
} from './faktaUtils';
import FagsakInfo from '../../types/fagsakInfoTsType';
import Rettigheter from '../../types/rettigheterTsType';
import FaktaPanelMenyRad from '../../types/faktaPanelMenyRadTsType';
import FaktaPanelDef from './FaktaPanelDef';
import FaktaPanelUtledet from './FaktaPanelUtledet';

const useFaktaPaneler = (
  faktaPanelDefinisjoner: FaktaPanelDef[],
  panelData: any,
  behandling: Behandling,
  rettigheter: Rettigheter,
  aksjonspunkter: Aksjonspunkt[],
  valgtFaktaPanelKode: string,
  intl,
): [FaktaPanelUtledet[], FaktaPanelUtledet, FaktaPanelMenyRad[]] => {
  const faktaPaneler = useMemo(() => utledFaktaPaneler(faktaPanelDefinisjoner, panelData, behandling, rettigheter, aksjonspunkter),
    [behandling.versjon]);

  const valgtPanel = useMemo(() => finnValgtPanel(faktaPaneler, valgtFaktaPanelKode), [behandling.versjon, valgtFaktaPanelKode]);

  const urlCode = valgtPanel ? valgtPanel.getUrlKode() : undefined;
  const sidemenyPaneler = useMemo(() => formaterPanelerForSidemeny(intl, faktaPaneler, urlCode),
    [behandling.versjon, urlCode]);

  return [faktaPaneler, valgtPanel, sidemenyPaneler];
};

const useFaktaAksjonspunktNotifikator = (
  faktaPaneler: FaktaPanelUtledet[],
  setApentFaktaPanel: ({ urlCode, textCode }) => void,
  behandlingVersjon: number,
) => {
  useEffect(() => {
    const panelMedApentAp = faktaPaneler.find((p) => p.getHarApneAksjonspunkter());
    if (panelMedApentAp) {
      setApentFaktaPanel({ urlCode: panelMedApentAp.getUrlKode(), textCode: panelMedApentAp.getTekstKode() });
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
  const velgFaktaPanelCallback = useCallback((index) => oppdaterProsessStegOgFaktaPanelIUrl(valgtProsessSteg, faktaPaneler[index].getUrlKode()),
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

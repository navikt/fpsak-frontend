import { useCallback, useEffect, useMemo } from 'react';

import {
  utledFaktaPaneler, finnValgtPanel, formaterPanelerForSidemeny, getBekreftAksjonspunktCallback,
} from './faktaPanelUtils';

const useFaktaPaneler = (faktaPanelDefinisjoner, fpPanelerData, fagsak, behandling, navAnsatt, aksjonspunkter, hasFetchError, valgtFaktaSteg, intl) => {
  const faktaPaneler = useMemo(() => utledFaktaPaneler(faktaPanelDefinisjoner, fpPanelerData, fagsak, behandling, navAnsatt, aksjonspunkter, hasFetchError),
    [behandling.versjon]);

  const valgtPanel = useMemo(() => {
    const panel = finnValgtPanel(faktaPaneler, valgtFaktaSteg);
    return panel || { urlCode: undefined };
  }, [behandling.versjon, valgtFaktaSteg]);

  const formaterteFaktaPaneler = useMemo(() => formaterPanelerForSidemeny(intl, faktaPaneler, valgtPanel.urlCode),
    [behandling.versjon, valgtPanel.urlCode]);

  return [faktaPaneler, valgtPanel, formaterteFaktaPaneler];
};

const useFaktaAksjonspunktNotifikator = (faktaPaneler, setApentFaktaPanel, behandlingVersjon) => {
  useEffect(() => {
    const panelMedApentAp = faktaPaneler.find((p) => p.harApneAksjonspunkter);
    if (panelMedApentAp) {
      setApentFaktaPanel({ urlCode: panelMedApentAp.urlCode, textCode: panelMedApentAp.textCode });
    } else {
      setApentFaktaPanel(undefined);
    }
  }, [behandlingVersjon]);
};

const useCallbacks = (faktaPaneler, fagsak, behandling, oppdaterProsessStegOgFaktaPanelIUrl, valgtProsessSteg, overstyringApCodes, behandlingApi, dispatch) => {
  const velgFaktaPanelCallback = useCallback((index) => oppdaterProsessStegOgFaktaPanelIUrl(valgtProsessSteg, faktaPaneler[index].urlCode),
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

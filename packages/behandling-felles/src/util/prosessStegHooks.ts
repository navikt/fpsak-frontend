import {
  useState, useMemo, useCallback, useEffect,
} from 'react';
import { useIntl } from 'react-intl';

import {
  utledProsessStegPaneler, finnValgtPanel, formaterPanelerForProsessmeny, getBekreftAksjonspunktCallback,
} from './prosessStegPanelUtils';

const useProsessStegPaneler = (prosessStegPanelDefinisjoner, ekstraData, valgtProsessSteg, apentFaktaPanelInfo, fagsak, navAnsatt, behandling,
  aksjonspunkter, vilkar, hasFetchError) => {
  const intl = useIntl();
  const [overstyrteAksjonspunkter, toggleOverstyring] = useState([]);
  const ekstraPanelData = { ...ekstraData, overstyrteAksjonspunkter };

  const prosessStegPaneler = useMemo(() => utledProsessStegPaneler(prosessStegPanelDefinisjoner, ekstraPanelData, toggleOverstyring,
    overstyrteAksjonspunkter, behandling, aksjonspunkter, vilkar, navAnsatt, fagsak, hasFetchError, intl),
  [behandling.versjon, overstyrteAksjonspunkter]);

  const valgtPanel = useMemo(() => {
    const panel = finnValgtPanel(prosessStegPaneler, valgtProsessSteg, behandling.behandlingHenlagt, apentFaktaPanelInfo);
    return panel || { urlCode: undefined };
  },
  [behandling.versjon, valgtProsessSteg, overstyrteAksjonspunkter, apentFaktaPanelInfo]);

  const formaterteProsessStegPaneler = useMemo(() => formaterPanelerForProsessmeny(intl, prosessStegPaneler, valgtPanel.urlCode),
    [behandling.versjon, valgtPanel.urlCode, overstyrteAksjonspunkter]);

  return [prosessStegPaneler, valgtPanel, formaterteProsessStegPaneler];
};

const useCallbacks = (prosessStegPaneler, valgtFaktaSteg, fagsak, behandling, oppdaterProsessStegOgFaktaPanelIUrl, valgtProsessSteg,
  behandlingApi, lagringSideEffectsCallback, dispatch) => {
  const velgProsessStegPanelCallback = useCallback((index) => {
    const nyttProsessStegValg = prosessStegPaneler[index].urlCode;
    oppdaterProsessStegOgFaktaPanelIUrl(!valgtProsessSteg || nyttProsessStegValg !== valgtProsessSteg ? nyttProsessStegValg : undefined, valgtFaktaSteg);
  }, [behandling.versjon, valgtProsessSteg, valgtFaktaSteg]);

  const bekreftAksjonspunktCallback = useCallback((aksjonspunktModels) => {
    const valgtPanel = prosessStegPaneler.find((p) => p.urlCode === valgtProsessSteg);
    return getBekreftAksjonspunktCallback(dispatch,
      lagringSideEffectsCallback, fagsak, behandling, valgtPanel.aksjonspunkter, behandlingApi)(aksjonspunktModels);
  }, [behandling.versjon]);

  return [velgProsessStegPanelCallback, bekreftAksjonspunktCallback];
};

const useOppdateringAvBehandlingsversjon = (behandlingVersjon, oppdaterBehandlingVersjon) => {
  const [skalOppdatereFagsakKontekst, toggleSkalOppdatereFagsakContext] = useState(true);
  useEffect(() => {
    if (skalOppdatereFagsakKontekst) {
      oppdaterBehandlingVersjon(behandlingVersjon);
    }
  }, [behandlingVersjon]);

  return toggleSkalOppdatereFagsakContext;
};

const prosessStegHooks = {
  useProsessStegPaneler,
  useCallbacks,
  useOppdateringAvBehandlingsversjon,
};

export default prosessStegHooks;

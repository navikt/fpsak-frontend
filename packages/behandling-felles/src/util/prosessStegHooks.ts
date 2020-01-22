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

  const valgtPanel = useMemo(() => finnValgtPanel(prosessStegPaneler, valgtProsessSteg, behandling.behandlingHenlagt, apentFaktaPanelInfo),
    [behandling.versjon, valgtProsessSteg, overstyrteAksjonspunkter, apentFaktaPanelInfo]);

  const urlCode = valgtPanel ? valgtPanel.urlCode : undefined;
  const formaterteProsessStegPaneler = useMemo(() => formaterPanelerForProsessmeny(intl, prosessStegPaneler, urlCode),
    [behandling.versjon, urlCode, overstyrteAksjonspunkter]);

  return [prosessStegPaneler, valgtPanel, formaterteProsessStegPaneler];
};

const useProsessStegVelger = (prosessStegPaneler, valgtFaktaSteg, behandling, oppdaterProsessStegOgFaktaPanelIUrl,
  valgtProsessSteg) => useCallback((index) => {
  const nyttProsessStegValg = prosessStegPaneler[index].urlCode;
  oppdaterProsessStegOgFaktaPanelIUrl(!valgtProsessSteg || nyttProsessStegValg !== valgtProsessSteg ? nyttProsessStegValg : undefined, valgtFaktaSteg);
}, [behandling.versjon, valgtProsessSteg, valgtFaktaSteg]);

const useBekreftAksjonspunkt = (valgtPanel, fagsak, behandling, behandlingApi, lagringSideEffectsCallback, dispatch) => useCallback((
  aksjonspunktModels,
) => getBekreftAksjonspunktCallback(dispatch, lagringSideEffectsCallback, fagsak,
  behandling, valgtPanel.aksjonspunkter, behandlingApi)(aksjonspunktModels), [behandling.versjon, valgtPanel]);

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
  useProsessStegVelger,
  useBekreftAksjonspunkt,
  useOppdateringAvBehandlingsversjon,
};

export default prosessStegHooks;

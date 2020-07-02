import {
  useState, useMemo, useCallback, useEffect,
} from 'react';
import { Dispatch } from 'redux';

import { EndpointOperations } from '@fpsak-frontend/rest-api-redux';
import {
  Behandling, Aksjonspunkt, Vilkar,
} from '@fpsak-frontend/types';

import FagsakInfo from '../../types/fagsakInfoTsType';
import Rettigheter from '../../types/rettigheterTsType';
import ProsessStegMenyRad from '../../types/prosessStegMenyRadTsType';
import {
  utledProsessStegPaneler, finnValgtPanel, formaterPanelerForProsessmeny, getBekreftAksjonspunktCallback,
} from './prosessStegUtils';
import { ProsessStegDef } from './ProsessStegDef';
import { ProsessStegUtledet } from './ProsessStegUtledet';

const useProsessStegPaneler = (
  prosessStegPanelDefinisjoner: ProsessStegDef[],
  panelData: any,
  fagsak: FagsakInfo,
  rettigheter: Rettigheter,
  behandling: Behandling,
  aksjonspunkter: Aksjonspunkt[],
  vilkar: Vilkar[],
  hasFetchError: boolean,
  valgtProsessSteg?: string,
  apentFaktaPanelInfo?: { urlCode: string; textCode: string},
): [ProsessStegUtledet[], ProsessStegUtledet, ProsessStegMenyRad[]] => {
  const [overstyrteAksjonspunktKoder, toggleOverstyring] = useState<string[]>([]);
  const ekstraPanelData = {
    ...panelData,
    fagsak,
    behandling,
    aksjonspunkter,
    vilkar,
    rettigheter,
    overstyrteAksjonspunktKoder,
  };

  useEffect(() => {
    if (overstyrteAksjonspunktKoder.length > 0) {
      toggleOverstyring([]);
    }
  }, [behandling.versjon]);

  const prosessStegPaneler = useMemo(() => utledProsessStegPaneler(prosessStegPanelDefinisjoner, ekstraPanelData, toggleOverstyring,
    overstyrteAksjonspunktKoder, behandling, aksjonspunkter, vilkar, rettigheter, hasFetchError),
  [behandling.versjon, overstyrteAksjonspunktKoder]);

  const valgtPanel = useMemo(() => finnValgtPanel(prosessStegPaneler, behandling.behandlingHenlagt, valgtProsessSteg, apentFaktaPanelInfo),
    [behandling.versjon, valgtProsessSteg, overstyrteAksjonspunktKoder, apentFaktaPanelInfo]);

  const urlCode = valgtPanel ? valgtPanel.getUrlKode() : undefined;
  const formaterteProsessStegPaneler = useMemo(() => formaterPanelerForProsessmeny(prosessStegPaneler, urlCode),
    [behandling.versjon, urlCode, overstyrteAksjonspunktKoder]);

  return [prosessStegPaneler, valgtPanel, formaterteProsessStegPaneler];
};

const useProsessStegVelger = (
  prosessStegPaneler: ProsessStegUtledet[],
  valgtFaktaSteg: string,
  behandling: Behandling,
  oppdaterProsessStegOgFaktaPanelIUrl: (punktnavn?: string, faktanavn?: string) => void,
  valgtProsessSteg: string,
  valgtPanel?: ProsessStegUtledet,
) => useCallback((index) => {
  const urlCode = prosessStegPaneler[index].getUrlKode();

  const erNyvalgtPanelDetSammeSomForrige = valgtPanel && valgtPanel.getUrlKode() === urlCode;
  const erNyvalgtPanelUlikForrige = urlCode !== valgtProsessSteg;

  const nyvalgtProsessSteg = !erNyvalgtPanelDetSammeSomForrige && (!valgtProsessSteg || erNyvalgtPanelUlikForrige) ? urlCode : undefined;
  oppdaterProsessStegOgFaktaPanelIUrl(nyvalgtProsessSteg, valgtFaktaSteg);
}, [behandling.versjon, valgtProsessSteg, valgtFaktaSteg]);

const useBekreftAksjonspunkt = (
  fagsak: FagsakInfo,
  behandling: Behandling,
  behandlingApi: {[name: string]: EndpointOperations},
  lagringSideEffectsCallback: (aksjonspunktModeller: any) => () => void,
  dispatch: Dispatch,
  valgtPanel?: ProsessStegUtledet,
) => useCallback((
  aksjonspunktModels,
) => getBekreftAksjonspunktCallback(dispatch, lagringSideEffectsCallback, fagsak,
  behandling, valgtPanel ? valgtPanel.getAksjonspunkter() : [], behandlingApi)(aksjonspunktModels),
[behandling.versjon, valgtPanel]);

const useOppdateringAvBehandlingsversjon = (behandlingVersjon: number, oppdaterBehandlingVersjon: (versjon: number) => void) => {
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

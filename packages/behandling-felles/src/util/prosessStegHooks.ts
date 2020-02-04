import {
  useState, useMemo, useCallback, useEffect,
} from 'react';
import { Dispatch } from 'redux';

import { EndpointOperations } from '@fpsak-frontend/rest-api-redux';
import {
  Behandling, NavAnsatt, Aksjonspunkt, Vilkar,
} from '@fpsak-frontend/types';

import FagsakInfo from '../types/fagsakInfoTsType';
import ProsessStegDefinisjon from '../types/prosessStegDefinisjonTsType';
import ProsessStegData from '../types/prosessStegDataTsType';
import ProsessStegMenyRad from '../types/prosessStegMenyRadTsType';
import {
  utledProsessStegPaneler, finnValgtPanel, formaterPanelerForProsessmeny, getBekreftAksjonspunktCallback,
} from './prosessStegUtils';

const useProsessStegPaneler = (
  prosessStegPanelDefinisjoner: ProsessStegDefinisjon[],
  panelData: {},
  fagsak: FagsakInfo,
  navAnsatt: NavAnsatt,
  behandling: Behandling,
  aksjonspunkter: Aksjonspunkt[],
  vilkar: Vilkar[],
  hasFetchError: boolean,
  intl,
  valgtProsessSteg?: string,
  apentFaktaPanelInfo?: { urlCode: string; textCode: string},
): [ProsessStegData[], ProsessStegData, ProsessStegMenyRad[]] => {
  const [overstyrteAksjonspunktKoder, toggleOverstyring] = useState<string[]>([]);
  const ekstraPanelData = { ...panelData, overstyrteAksjonspunktKoder };

  useEffect(() => {
    if (overstyrteAksjonspunktKoder.length > 0) {
      toggleOverstyring([]);
    }
  }, [behandling.versjon]);

  const prosessStegPaneler = useMemo(() => utledProsessStegPaneler(prosessStegPanelDefinisjoner, ekstraPanelData, toggleOverstyring,
    overstyrteAksjonspunktKoder, fagsak, navAnsatt, behandling, aksjonspunkter, vilkar, hasFetchError),
  [behandling.versjon, overstyrteAksjonspunktKoder]);

  const valgtPanel = useMemo(() => finnValgtPanel(prosessStegPaneler, behandling.behandlingHenlagt, valgtProsessSteg, apentFaktaPanelInfo),
    [behandling.versjon, valgtProsessSteg, overstyrteAksjonspunktKoder, apentFaktaPanelInfo]);

  const urlCode = valgtPanel ? valgtPanel.urlCode : undefined;
  const formaterteProsessStegPaneler = useMemo(() => formaterPanelerForProsessmeny(prosessStegPaneler, intl, urlCode),
    [behandling.versjon, urlCode, overstyrteAksjonspunktKoder]);

  return [prosessStegPaneler, valgtPanel, formaterteProsessStegPaneler];
};

const useProsessStegVelger = (
  prosessStegPaneler: ProsessStegData[],
  valgtFaktaSteg: string,
  behandling: Behandling,
  oppdaterProsessStegOgFaktaPanelIUrl: (punktnavn?: string, faktanavn?: string) => void,
  valgtProsessSteg: string,
) => useCallback((index) => {
  const { urlCode } = prosessStegPaneler[index];
  const nyvalgtProsessSteg = !valgtProsessSteg || urlCode !== valgtProsessSteg ? urlCode : undefined;
  oppdaterProsessStegOgFaktaPanelIUrl(nyvalgtProsessSteg, valgtFaktaSteg);
}, [behandling.versjon, valgtProsessSteg, valgtFaktaSteg]);

const useBekreftAksjonspunkt = (
  fagsak: FagsakInfo,
  behandling: Behandling,
  behandlingApi: {[name: string]: EndpointOperations},
  lagringSideEffectsCallback: (aksjonspunktModeller: {}) => () => void,
  dispatch: Dispatch,
  valgtPanel?: ProsessStegData,
) => useCallback((
  aksjonspunktModels,
) => getBekreftAksjonspunktCallback(dispatch, lagringSideEffectsCallback, fagsak,
  behandling, valgtPanel ? valgtPanel.aksjonspunkter : [], behandlingApi)(aksjonspunktModels),
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

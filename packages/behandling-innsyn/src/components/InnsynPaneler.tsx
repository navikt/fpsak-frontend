import React, { FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';

import {
  FagsakInfo, BehandlingPaVent, SettPaVentParams,
} from '@fpsak-frontend/behandling-felles';
import { Kodeverk, NavAnsatt, Behandling } from '@fpsak-frontend/types';

import InnsynProsess from './InnsynProsess';
import FetchedData from '../types/fetchedDataTsType';

interface OwnProps {
  fagsak: FagsakInfo;
  behandling: Behandling;
  fetchedData: FetchedData;
  kodeverk: {[key: string]: Kodeverk[]};
  navAnsatt: NavAnsatt;
  valgtProsessSteg?: string;
  oppdaterProsessStegOgFaktaPanelIUrl: (punktnavn?: string, faktanavn?: string) => void;
  oppdaterBehandlingVersjon: (versjon: number) => void;
  settPaVent: (params: SettPaVentParams) => Promise<any>;
  hentBehandling: ({ behandlingId: number }, { keepData: boolean }) => Promise<any>;
  opneSokeside: () => void;
}

const InnsynPaneler: FunctionComponent<OwnProps> = ({
  fagsak,
  behandling,
  fetchedData,
  kodeverk,
  navAnsatt,
  valgtProsessSteg,
  oppdaterProsessStegOgFaktaPanelIUrl,
  oppdaterBehandlingVersjon,
  settPaVent,
  hentBehandling,
  opneSokeside,
}) => {
  // TODO (TOR) Har trekt denne ut hit grunna redux test-oppsett. Fiks
  const dispatch = useDispatch();

  return (
    <>
      <BehandlingPaVent
        behandling={behandling}
        aksjonspunkter={fetchedData.aksjonspunkter}
        kodeverk={kodeverk}
        settPaVent={settPaVent}
        hentBehandling={hentBehandling}
        navAnsatt={navAnsatt}
      />
      <InnsynProsess
        fagsak={fagsak}
        behandling={behandling}
        data={fetchedData}
        alleKodeverk={kodeverk}
        navAnsatt={navAnsatt}
        valgtProsessSteg={valgtProsessSteg}
        oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
        oppdaterBehandlingVersjon={oppdaterBehandlingVersjon}
        opneSokeside={opneSokeside}
        dispatch={dispatch}
      />
    </>
  );
};

export default InnsynPaneler;

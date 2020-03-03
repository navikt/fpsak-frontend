import React, { FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';

import {
  FagsakInfo, BehandlingPaVent, SettPaVentParams,
} from '@fpsak-frontend/behandling-felles';
import { Behandling, Kodeverk, NavAnsatt } from '@fpsak-frontend/types';

import KlageProsess from './KlageProsess';
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
  alleBehandlinger: [{
    id: number;
    type: Kodeverk;
    avsluttet?: string;
    status: Kodeverk;
    uuid: string;
  }];
}

const KlagePaneler: FunctionComponent<OwnProps> = ({
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
  alleBehandlinger,
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
      <KlageProsess
        data={fetchedData}
        fagsak={fagsak}
        behandling={behandling}
        navAnsatt={navAnsatt}
        valgtProsessSteg={valgtProsessSteg}
        oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
        oppdaterBehandlingVersjon={oppdaterBehandlingVersjon}
        opneSokeside={opneSokeside}
        alleBehandlinger={alleBehandlinger}
        dispatch={dispatch}
        alleKodeverk={kodeverk}
      />
    </>
  );
};


export default KlagePaneler;

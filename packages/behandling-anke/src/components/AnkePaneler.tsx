import React, { FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';

import {
  FagsakInfo, BehandlingPaVent, SettPaVentParams, Rettigheter,
} from '@fpsak-frontend/behandling-felles';
import { Behandling, Kodeverk, KodeverkMedNavn } from '@fpsak-frontend/types';

import AnkeProsess from './AnkeProsess';
import FetchedData from '../types/fetchedDataTsType';

interface OwnProps {
  fagsak: FagsakInfo;
  behandling: Behandling;
  fetchedData: FetchedData;
  rettigheter: Rettigheter;
  alleKodeverk: {[key: string]: KodeverkMedNavn[]};
  valgtProsessSteg?: string;
  oppdaterProsessStegOgFaktaPanelIUrl: (punktnavn?: string, faktanavn?: string) => void;
  oppdaterBehandlingVersjon: (versjon: number) => void;
  settPaVent: (params: SettPaVentParams) => Promise<any>;
  hentBehandling: ({ behandlingId: number }, { keepData: boolean }) => Promise<any>;
  opneSokeside: () => void;
  alleBehandlinger: {
    id: number;
    type: Kodeverk;
    avsluttet?: string;
  }[];
}

const AnkePaneler: FunctionComponent<OwnProps> = ({
  fagsak,
  behandling,
  fetchedData,
  rettigheter,
  alleKodeverk,
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
        kodeverk={alleKodeverk}
        settPaVent={settPaVent}
        hentBehandling={hentBehandling}
      />
      <AnkeProsess
        data={fetchedData}
        fagsak={fagsak}
        behandling={behandling}
        rettigheter={rettigheter}
        valgtProsessSteg={valgtProsessSteg}
        oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
        oppdaterBehandlingVersjon={oppdaterBehandlingVersjon}
        opneSokeside={opneSokeside}
        alleBehandlinger={alleBehandlinger}
        dispatch={dispatch}
        alleKodeverk={alleKodeverk}
      />
    </>
  );
};

export default AnkePaneler;

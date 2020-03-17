import React, { FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';

import {
  FagsakInfo, BehandlingPaVent, SettPaVentParams,
} from '@fpsak-frontend/behandling-felles';
import { Behandling, Kodeverk, NavAnsatt } from '@fpsak-frontend/types';

import TilbakekrevingProsess from './TilbakekrevingProsess';
import TilbakekrevingFakta from './TilbakekrevingFakta';
import FetchedData from '../types/fetchedDataTsType';

interface OwnProps {
  fetchedData: FetchedData;
  fagsak: FagsakInfo;
  behandling: Behandling;
  kodeverk: {[key: string]: Kodeverk[]};
  fpsakKodeverk: {[key: string]: Kodeverk[]};
  navAnsatt: NavAnsatt;
  valgtProsessSteg?: string;
  oppdaterProsessStegOgFaktaPanelIUrl: (punktnavn?: string, faktanavn?: string) => void;
  oppdaterBehandlingVersjon: (versjon: number) => void;
  settPaVent: (params: SettPaVentParams) => Promise<any>;
  hentBehandling: ({ behandlingId: number }, { keepData: boolean }) => Promise<any>;
  opneSokeside: () => void;
  harApenRevurdering: boolean;
  hasFetchError: boolean;
}

const TilbakekrevingPaneler: FunctionComponent<OwnProps> = ({
  fetchedData,
  fagsak,
  behandling,
  kodeverk,
  fpsakKodeverk,
  navAnsatt,
  valgtProsessSteg,
  oppdaterProsessStegOgFaktaPanelIUrl,
  oppdaterBehandlingVersjon,
  settPaVent,
  hentBehandling,
  opneSokeside,
  harApenRevurdering,
  hasFetchError,
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
      />
      <TilbakekrevingProsess
        data={fetchedData}
        fagsak={fagsak}
        behandling={behandling}
        alleKodeverk={kodeverk}
        navAnsatt={navAnsatt}
        valgtProsessSteg={valgtProsessSteg}
        oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
        oppdaterBehandlingVersjon={oppdaterBehandlingVersjon}
        opneSokeside={opneSokeside}
        harApenRevurdering={harApenRevurdering}
        hasFetchError={hasFetchError}
        dispatch={dispatch}
      />
      <TilbakekrevingFakta
        data={fetchedData}
        fagsak={fagsak}
        behandling={behandling}
        navAnsatt={navAnsatt}
        alleKodeverk={kodeverk}
        fpsakKodeverk={fpsakKodeverk}
        oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
        hasFetchError={hasFetchError}
        dispatch={dispatch}
      />
    </>
  );
};

export default TilbakekrevingPaneler;

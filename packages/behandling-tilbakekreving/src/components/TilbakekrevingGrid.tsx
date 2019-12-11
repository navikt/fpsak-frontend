import React, { FunctionComponent } from 'react';

import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { PersonIndex } from '@fpsak-frontend/person-info';
import {
  Kodeverk, NavAnsatt, FagsakInfo, Behandling, Aksjonspunkt, BehandlingPaVent, SettPaVentParams,
} from '@fpsak-frontend/behandling-felles';

import TilbakekrevingProsess from './TilbakekrevingProsess';
import TilbakekrevingFakta from './TilbakekrevingFakta';
import PerioderForeldelse from '../types/perioderForeldelseTsType';
import Beregningsresultat from '../types/beregningsresultatTsType';

interface OwnProps {
  fagsak: FagsakInfo;
  behandling: Behandling;
  aksjonspunkter: Aksjonspunkt[];
  perioderForeldelse?: PerioderForeldelse;
  beregningsresultat?: Beregningsresultat;
  kodeverk: {[key: string]: Kodeverk[]};
  navAnsatt: NavAnsatt;
  valgtProsessSteg?: string;
  oppdaterProsessStegIUrl: (punktnavn?: string) => void;
  oppdaterBehandlingVersjon: (versjon: number) => void;
  settPaVent: (params: SettPaVentParams) => Promise<any>;
  hentBehandling: ({ behandlingId: number }, { keepData: boolean }) => Promise<any>;
  opneSokeside: () => void;
  harApenRevurdering: boolean;
  hasFetchError: boolean;
}

const TilbakekrevingGrid: FunctionComponent<OwnProps> = ({
  fagsak,
  behandling,
  aksjonspunkter,
  perioderForeldelse,
  beregningsresultat,
  kodeverk,
  navAnsatt,
  valgtProsessSteg,
  oppdaterProsessStegIUrl,
  oppdaterBehandlingVersjon,
  settPaVent,
  hentBehandling,
  opneSokeside,
  harApenRevurdering,
  hasFetchError,
}) => (
  <>
    <BehandlingPaVent
      behandling={behandling}
      aksjonspunkter={aksjonspunkter}
      kodeverk={kodeverk}
      settPaVent={settPaVent}
      hentBehandling={hentBehandling}
    />
    <TilbakekrevingProsess
      fagsak={fagsak}
      behandling={behandling}
      aksjonspunkter={aksjonspunkter}
      perioderForeldelse={perioderForeldelse}
      beregningsresultat={beregningsresultat}
      kodeverk={kodeverk}
      navAnsatt={navAnsatt}
      valgtProsessSteg={valgtProsessSteg}
      oppdaterProsessStegIUrl={oppdaterProsessStegIUrl}
      oppdaterBehandlingVersjon={oppdaterBehandlingVersjon}
      opneSokeside={opneSokeside}
      harApenRevurdering={harApenRevurdering}
      hasFetchError={hasFetchError}
    />
    <VerticalSpacer sixteenPx />
    <PersonIndex medPanel person={fagsak.fagsakPerson} />
    <VerticalSpacer sixteenPx />
    <TilbakekrevingFakta
      fagsak={fagsak}
      behandling={behandling}
      aksjonspunkter={aksjonspunkter}
      kodeverk={kodeverk}
      navAnsatt={navAnsatt}
      hasFetchError={hasFetchError}
      oppdaterProsessStegIUrl={oppdaterProsessStegIUrl}
    />
  </>
);

export default TilbakekrevingGrid;

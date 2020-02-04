import React, { FunctionComponent } from 'react';

import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { PersonIndex } from '@fpsak-frontend/person-info';
import {
  FagsakInfo, BehandlingPaVent, SettPaVentParams,
} from '@fpsak-frontend/behandling-felles';
import {
  Behandling, Kodeverk, NavAnsatt, Aksjonspunkt, Vilkar,
} from '@fpsak-frontend/types';

import AnkeProsess from './AnkeProsess';
import AnkeVurdering from '../types/ankeVurderingTsType';

interface OwnProps {
  fagsak: FagsakInfo;
  behandling: Behandling;
  aksjonspunkter: Aksjonspunkt[];
  vilkar: Vilkar[];
  ankeVurdering: AnkeVurdering;
  navAnsatt: NavAnsatt;
  kodeverk: {[key: string]: Kodeverk[]};
  valgtProsessSteg?: string;
  oppdaterProsessStegIUrl: (punktnavn?: string) => void;
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

const AnkeGrid: FunctionComponent<OwnProps> = ({
  fagsak,
  behandling,
  aksjonspunkter,
  vilkar,
  ankeVurdering,
  navAnsatt,
  kodeverk,
  valgtProsessSteg,
  oppdaterProsessStegIUrl,
  oppdaterBehandlingVersjon,
  settPaVent,
  hentBehandling,
  opneSokeside,
  alleBehandlinger,
}) => (
  <>
    <BehandlingPaVent
      behandling={behandling}
      aksjonspunkter={aksjonspunkter}
      kodeverk={kodeverk}
      settPaVent={settPaVent}
      hentBehandling={hentBehandling}
    />
    <AnkeProsess
      fagsak={fagsak}
      behandling={behandling}
      aksjonspunkter={aksjonspunkter}
      vilkar={vilkar}
      ankeVurdering={ankeVurdering}
      navAnsatt={navAnsatt}
      valgtProsessSteg={valgtProsessSteg}
      oppdaterProsessStegIUrl={oppdaterProsessStegIUrl}
      oppdaterBehandlingVersjon={oppdaterBehandlingVersjon}
      opneSokeside={opneSokeside}
      alleBehandlinger={alleBehandlinger}
    />
    <VerticalSpacer sixteenPx />
    <PersonIndex medPanel person={fagsak.fagsakPerson} />
  </>
);

export default AnkeGrid;

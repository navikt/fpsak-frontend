import React, { FunctionComponent } from 'react';

import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { PersonIndex } from '@fpsak-frontend/person-info';
import {
  FagsakInfo, BehandlingPaVent, SettPaVentParams,
} from '@fpsak-frontend/behandling-felles';
import {
  Kodeverk, Dokument, NavAnsatt, Behandling, Aksjonspunkt, Vilkar,
} from '@fpsak-frontend/types';

import InnsynProsess from './InnsynProsess';
import Innsyn from '../types/innsynTsType';

interface OwnProps {
  fagsak: FagsakInfo;
  behandling: Behandling;
  aksjonspunkter: Aksjonspunkt[];
  vilkar: Vilkar[];
  innsyn: Innsyn;
  kodeverk: {[key: string]: Kodeverk[]};
  innsynDokumenter: Dokument[];
  navAnsatt: NavAnsatt;
  valgtProsessSteg?: string;
  oppdaterProsessStegIUrl: (punktnavn?: string) => void;
  oppdaterBehandlingVersjon: (versjon: number) => void;
  settPaVent: (params: SettPaVentParams) => Promise<any>;
  hentBehandling: ({ behandlingId: number }, { keepData: boolean }) => Promise<any>;
  opneSokeside: () => void;
}

const InnsynGrid: FunctionComponent<OwnProps> = ({
  fagsak,
  behandling,
  aksjonspunkter,
  vilkar,
  innsyn,
  kodeverk,
  innsynDokumenter,
  navAnsatt,
  valgtProsessSteg,
  oppdaterProsessStegIUrl,
  oppdaterBehandlingVersjon,
  settPaVent,
  hentBehandling,
  opneSokeside,
}) => (
  <>
    <BehandlingPaVent
      behandling={behandling}
      aksjonspunkter={aksjonspunkter}
      kodeverk={kodeverk}
      settPaVent={settPaVent}
      hentBehandling={hentBehandling}
    />
    <InnsynProsess
      fagsak={fagsak}
      behandling={behandling}
      aksjonspunkter={aksjonspunkter}
      vilkar={vilkar}
      innsyn={innsyn}
      kodeverk={kodeverk}
      alleDokumenter={innsynDokumenter}
      navAnsatt={navAnsatt}
      valgtProsessSteg={valgtProsessSteg}
      oppdaterProsessStegIUrl={oppdaterProsessStegIUrl}
      oppdaterBehandlingVersjon={oppdaterBehandlingVersjon}
      opneSokeside={opneSokeside}
    />
    <VerticalSpacer sixteenPx />
    <PersonIndex medPanel person={fagsak.fagsakPerson} />
  </>
);

export default InnsynGrid;

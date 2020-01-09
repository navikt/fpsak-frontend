import React, { FunctionComponent, useEffect } from 'react';

import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { PersonIndex } from '@fpsak-frontend/person-info';
import {
  Kodeverk, NavAnsatt, FagsakInfo, Behandling, Aksjonspunkt, BehandlingPaVent, SettPaVentParams, Vilkar, BehandlingDataCache,
} from '@fpsak-frontend/behandling-felles';

import ForeldrepengerProsess from './ForeldrepengerProsess';
import ForeldrepengerFakta from './ForeldrepengerFakta';

interface OwnProps {
  fagsak: FagsakInfo;
  behandling: Behandling;
  aksjonspunkter: Aksjonspunkt[];
  vilkar: Vilkar[];
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

const ForeldrepengerGrid: FunctionComponent<OwnProps> = ({
  fagsak,
  behandling,
  aksjonspunkter,
  vilkar,
  beregningresultatForeldrepenger,
  uttakStnadskontoer,
  uttaksresultatPerioder,
  simuleringResultat,
  soknad,
  personopplysninger,
  inntektArbeidYtelse,
  ytelsefordeling,
  kodeverk,
  navAnsatt,
  valgtProsessSteg,
  valgtFaktaSteg,
  oppdaterProsessStegIUrl,
  oppdaterFaktaPanelIUrl,
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
    <ForeldrepengerProsess
      fagsak={fagsak}
      behandling={behandling}
      aksjonspunkter={aksjonspunkter}
      vilkar={vilkar}
      kodeverk={kodeverk}
      navAnsatt={navAnsatt}
      valgtProsessSteg={valgtProsessSteg}
      oppdaterProsessStegIUrl={oppdaterProsessStegIUrl}
      oppdaterBehandlingVersjon={oppdaterBehandlingVersjon}
      opneSokeside={opneSokeside}
      harApenRevurdering={harApenRevurdering}
      hasFetchError={hasFetchError}
      beregningresultatForeldrepenger={beregningresultatForeldrepenger}
      uttakStonadskontoer={uttakStnadskontoer}
      uttaksresultatPerioder={uttaksresultatPerioder}
      simuleringResultat={simuleringResultat}
    />
    <VerticalSpacer sixteenPx />
    <PersonIndex medPanel person={fagsak.fagsakPerson} />
    <VerticalSpacer sixteenPx />
    <ForeldrepengerFakta
      fagsak={fagsak}
      behandling={behandling}
      aksjonspunkter={aksjonspunkter}
      vilkar={vilkar}
      soknad={soknad}
      personopplysninger={personopplysninger}
      inntektArbeidYtelse={inntektArbeidYtelse}
      ytelsefordeling={ytelsefordeling}
      alleKodeverk={kodeverk}
      navAnsatt={navAnsatt}
      hasFetchError={hasFetchError}
      valgtFaktaSteg={valgtFaktaSteg}
      oppdaterFaktaPanelIUrl={oppdaterFaktaPanelIUrl}
    />
  </>
);

export default ForeldrepengerGrid;

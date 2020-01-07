import React, { FunctionComponent } from 'react';

import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import PersonFaktaIndex from '@fpsak-frontend/fakta-person';
import {
  Kodeverk, NavAnsatt, FagsakInfo, Behandling, Aksjonspunkt, BehandlingPaVent, SettPaVentParams, Vilkar, SimuleringResultat,
} from '@fpsak-frontend/behandling-felles';
import { featureToggle as FeatureToggle } from '@fpsak-frontend/fp-felles';

import EngangsstonadProsess from './EngangsstonadProsess';
import EngangsstonadFakta from './EngangsstonadFakta';

interface OwnProps {
  fagsak: FagsakInfo;
  behandling: Behandling;
  aksjonspunkter: Aksjonspunkt[];
  vilkar: Vilkar[];
  simuleringResultat: SimuleringResultat;
  alleKodeverk: {[key: string]: Kodeverk[]};
  navAnsatt: NavAnsatt;
  valgtProsessSteg?: string;
  oppdaterProsessStegIUrl: (punktnavn?: string) => void;
  oppdaterFaktaPanelIUrl: (faktanavn?: string) => void;
  valgtFaktaSteg?: string;
  oppdaterBehandlingVersjon: (versjon: number) => void;
  settPaVent: (params: SettPaVentParams) => Promise<any>;
  hentBehandling: ({ behandlingId: number }, { keepData: boolean }) => Promise<any>;
  opneSokeside: () => void;
  harApenRevurdering: boolean;
  hasFetchError: boolean;
}

const EngangsstonadGrid: FunctionComponent<OwnProps> = ({
  fagsak,
  behandling,
  aksjonspunkter,
  vilkar,
  simuleringResultat,
  beregningresultatEngangsstonad,
  personopplysninger,
  inntektArbeidYtelse,
  soknad,
  alleKodeverk,
  navAnsatt,
  valgtProsessSteg,
  oppdaterProsessStegIUrl,
  valgtFaktaSteg,
  oppdaterFaktaPanelIUrl,
  oppdaterBehandlingVersjon,
  settPaVent,
  hentBehandling,
  opneSokeside,
  harApenRevurdering,
  hasFetchError,
  featureToggles,
}) => (
  <>
    <BehandlingPaVent
      behandling={behandling}
      aksjonspunkter={aksjonspunkter}
      kodeverk={alleKodeverk}
      settPaVent={settPaVent}
      hentBehandling={hentBehandling}
    />
    <EngangsstonadProsess
      fagsak={fagsak}
      behandling={behandling}
      aksjonspunkter={aksjonspunkter}
      vilkar={vilkar}
      simuleringResultat={simuleringResultat}
      beregningresultatEngangsstonad={beregningresultatEngangsstonad}
      soknad={soknad}
      alleKodeverk={alleKodeverk}
      navAnsatt={navAnsatt}
      valgtProsessSteg={valgtProsessSteg}
      oppdaterProsessStegIUrl={oppdaterProsessStegIUrl}
      oppdaterBehandlingVersjon={oppdaterBehandlingVersjon}
      opneSokeside={opneSokeside}
      harApenRevurdering={harApenRevurdering}
      hasFetchError={hasFetchError}
      featureToggles={featureToggles}
    />
    <VerticalSpacer sixteenPx />
    <PersonFaktaIndex
      behandling={behandling}
      fagsakPerson={fagsak.fagsakPerson}
      aksjonspunkter={aksjonspunkter}
      personopplysninger={personopplysninger}
      inntektArbeidYtelse={inntektArbeidYtelse}
      submitCallback={() => undefined}
      readOnly={false}
      featureToggleUtland={featureToggles[FeatureToggle.MARKER_UTENLANDSSAK]}
      alleKodeverk={alleKodeverk}
    />
    <VerticalSpacer sixteenPx />
    <EngangsstonadFakta
      fagsak={fagsak}
      behandling={behandling}
      aksjonspunkter={aksjonspunkter}
      vilkar={vilkar}
      soknad={soknad}
      personopplysninger={personopplysninger}
      inntektArbeidYtelse={inntektArbeidYtelse}
      alleKodeverk={alleKodeverk}
      navAnsatt={navAnsatt}
      hasFetchError={hasFetchError}
      valgtFaktaSteg={valgtFaktaSteg}
      oppdaterFaktaPanelIUrl={oppdaterFaktaPanelIUrl}
    />
  </>
);

export default EngangsstonadGrid;

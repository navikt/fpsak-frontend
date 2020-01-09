import React, { FunctionComponent } from 'react';

import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import PersonFaktaIndex from '@fpsak-frontend/fakta-person';
import {
  Kodeverk, NavAnsatt, FagsakInfo, Behandling, Aksjonspunkt, BehandlingPaVent, SettPaVentParams, Vilkar,
} from '@fpsak-frontend/behandling-felles';
import { featureToggle as FeatureToggle } from '@fpsak-frontend/fp-felles';

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
  beregningsgrunnlag,
  uttaksresultatPerioder,
  simuleringResultat,
  soknad,
  personopplysninger,
  inntektArbeidYtelse,
  ytelsefordeling,
  alleKodeverk,
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
    <ForeldrepengerProsess
      fagsak={fagsak}
      behandling={behandling}
      aksjonspunkter={aksjonspunkter}
      vilkar={vilkar}
      uttaksresultatPerioder={uttaksresultatPerioder}
      simuleringResultat={simuleringResultat}
      beregningsgrunnlag={beregningsgrunnlag}
      beregningresultatForeldrepenger={beregningresultatForeldrepenger}
      alleKodeverk={alleKodeverk}
      navAnsatt={navAnsatt}
      valgtProsessSteg={valgtProsessSteg}
      oppdaterProsessStegIUrl={oppdaterProsessStegIUrl}
      oppdaterBehandlingVersjon={oppdaterBehandlingVersjon}
      opneSokeside={opneSokeside}
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
    <ForeldrepengerFakta
      fagsak={fagsak}
      behandling={behandling}
      aksjonspunkter={aksjonspunkter}
      vilkar={vilkar}
      soknad={soknad}
      personopplysninger={personopplysninger}
      inntektArbeidYtelse={inntektArbeidYtelse}
      ytelsefordeling={ytelsefordeling}
      alleKodeverk={alleKodeverk}
      navAnsatt={navAnsatt}
      hasFetchError={hasFetchError}
      valgtFaktaSteg={valgtFaktaSteg}
      oppdaterFaktaPanelIUrl={oppdaterFaktaPanelIUrl}
    />
  </>
);

export default ForeldrepengerGrid;

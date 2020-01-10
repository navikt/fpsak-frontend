import React, { FunctionComponent } from 'react';

import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import PersonFaktaIndex from '@fpsak-frontend/fakta-person';
import {
  Kodeverk, NavAnsatt, FagsakInfo, BehandlingPaVent, SettPaVentParams,
} from '@fpsak-frontend/behandling-felles';
import { featureToggle as FeatureToggle } from '@fpsak-frontend/fp-felles';

import ForeldrepengerProsess from './ForeldrepengerProsess';
import ForeldrepengerFakta from './ForeldrepengerFakta';
import FetchedData from '../types/fetchedDataTsType';

interface OwnProps {
  fetchedData: FetchedData;
  fagsak: FagsakInfo;
  alleKodeverk: {[key: string]: Kodeverk[]};
  navAnsatt: NavAnsatt;
  valgtProsessSteg?: string;
  oppdaterProsessStegIUrl: (punktnavn?: string) => void;
  valgtFaktaSteg?: string;
  oppdaterFaktaPanelIUrl: (faktanavn?: string) => void;
  oppdaterBehandlingVersjon: (versjon: number) => void;
  settPaVent: (params: SettPaVentParams) => Promise<any>;
  hentBehandling: ({ behandlingId: number }, { keepData: boolean }) => Promise<any>;
  opneSokeside: () => void;
  hasFetchError: boolean;
  featureToggles: {};
}

const ForeldrepengerGrid: FunctionComponent<OwnProps> = ({
  fetchedData,
  fagsak,
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
  hasFetchError,
  featureToggles,
}) => (
  <>
    <BehandlingPaVent
      behandling={fetchedData.behandling}
      aksjonspunkter={fetchedData.aksjonspunkter}
      kodeverk={alleKodeverk}
      settPaVent={settPaVent}
      hentBehandling={hentBehandling}
    />
    <ForeldrepengerProsess
      data={fetchedData}
      fagsak={fagsak}
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
      behandling={fetchedData.behandling}
      fagsakPerson={fagsak.fagsakPerson}
      aksjonspunkter={fetchedData.aksjonspunkter}
      personopplysninger={fetchedData.personopplysninger}
      inntektArbeidYtelse={fetchedData.inntektArbeidYtelse}
      submitCallback={() => undefined}
      readOnly={false}
      featureToggleUtland={featureToggles[FeatureToggle.MARKER_UTENLANDSSAK]}
      alleKodeverk={alleKodeverk}
    />
    <VerticalSpacer sixteenPx />
    <ForeldrepengerFakta
      data={fetchedData}
      fagsak={fagsak}
      alleKodeverk={alleKodeverk}
      navAnsatt={navAnsatt}
      hasFetchError={hasFetchError}
      valgtFaktaSteg={valgtFaktaSteg}
      oppdaterFaktaPanelIUrl={oppdaterFaktaPanelIUrl}
    />
  </>
);

export default ForeldrepengerGrid;

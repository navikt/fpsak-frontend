import React, { FunctionComponent, useState } from 'react';

import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import PersonFaktaIndex from '@fpsak-frontend/fakta-person';
import {
  Kodeverk, NavAnsatt, FagsakInfo, Behandling, BehandlingPaVent, SettPaVentParams,
} from '@fpsak-frontend/behandling-felles';
import { featureToggle as FeatureToggle } from '@fpsak-frontend/fp-felles';

import EngangsstonadProsess from './EngangsstonadProsess';
import EngangsstonadFakta from './EngangsstonadFakta';
import FetchedData from '../types/fetchedDataTsType';

interface OwnProps {
  fetchedData: FetchedData;
  fagsak: FagsakInfo;
  behandling: Behandling;
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
  hasFetchError: boolean;
  featureToggles: {};
}

const EngangsstonadGrid: FunctionComponent<OwnProps> = ({
  fetchedData,
  fagsak,
  behandling,
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
}) => {
  const [harApentFaktaAksjonspunkt, setApentFaktaAksjonspunkt] = useState(false);
  return (
    <>
      <BehandlingPaVent
        behandling={behandling}
        aksjonspunkter={fetchedData.aksjonspunkter}
        kodeverk={alleKodeverk}
        settPaVent={settPaVent}
        hentBehandling={hentBehandling}
      />
      <EngangsstonadProsess
        data={fetchedData}
        fagsak={fagsak}
        behandling={behandling}
        alleKodeverk={alleKodeverk}
        navAnsatt={navAnsatt}
        valgtProsessSteg={valgtProsessSteg}
        oppdaterProsessStegIUrl={oppdaterProsessStegIUrl}
        oppdaterBehandlingVersjon={oppdaterBehandlingVersjon}
        opneSokeside={opneSokeside}
        hasFetchError={hasFetchError}
        featureToggles={featureToggles}
        harApentFaktaAksjonspunkt={harApentFaktaAksjonspunkt}
      />
      <VerticalSpacer sixteenPx />
      <PersonFaktaIndex
        behandling={behandling}
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
      <EngangsstonadFakta
        behandling={behandling}
        data={fetchedData}
        fagsak={fagsak}
        alleKodeverk={alleKodeverk}
        navAnsatt={navAnsatt}
        hasFetchError={hasFetchError}
        valgtFaktaSteg={valgtFaktaSteg}
        oppdaterFaktaPanelIUrl={oppdaterFaktaPanelIUrl}
        setApentFaktaAksjonspunkt={setApentFaktaAksjonspunkt}
      />
    </>
  );
};

export default EngangsstonadGrid;

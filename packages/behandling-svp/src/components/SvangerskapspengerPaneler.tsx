import React, { FunctionComponent, useState } from 'react';

import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import PersonFaktaIndex from '@fpsak-frontend/fakta-person';
import {
  Kodeverk, NavAnsatt, FagsakInfo, BehandlingPaVent, SettPaVentParams, Behandling,
} from '@fpsak-frontend/behandling-felles';
import { featureToggle as FeatureToggle } from '@fpsak-frontend/fp-felles';

import SvangerskapspengerProsess from './SvangerskapspengerProsess';
import SvangerskapspengerFakta from './SvangerskapspengerFakta';
import FetchedData from '../types/fetchedDataTsType';

interface OwnProps {
  fetchedData: FetchedData;
  fagsak: FagsakInfo;
  behandling: Behandling;
  alleKodeverk: {[key: string]: Kodeverk[]};
  navAnsatt: NavAnsatt;
  valgtProsessSteg?: string;
  valgtFaktaSteg?: string;
  oppdaterProsessStegOgFaktaPanelIUrl: (punktnavn?: string, faktanavn?: string) => void;
  oppdaterBehandlingVersjon: (versjon: number) => void;
  settPaVent: (params: SettPaVentParams) => Promise<any>;
  hentBehandling: ({ behandlingId: number }, { keepData: boolean }) => Promise<any>;
  opneSokeside: () => void;
  hasFetchError: boolean;
  featureToggles: {};
}

const SvangerskapspengerPaneler: FunctionComponent<OwnProps> = ({
  fetchedData,
  fagsak,
  behandling,
  alleKodeverk,
  navAnsatt,
  valgtProsessSteg,
  valgtFaktaSteg,
  oppdaterProsessStegOgFaktaPanelIUrl,
  oppdaterBehandlingVersjon,
  settPaVent,
  hentBehandling,
  opneSokeside,
  hasFetchError,
  featureToggles,
}) => {
  const [apentFaktaPanelInfo, setApentFaktaPanel] = useState();
  return (
    <>
      <BehandlingPaVent
        behandling={behandling}
        aksjonspunkter={fetchedData.aksjonspunkter}
        kodeverk={alleKodeverk}
        settPaVent={settPaVent}
        hentBehandling={hentBehandling}
      />
      <SvangerskapspengerProsess
        data={fetchedData}
        behandling={behandling}
        fagsak={fagsak}
        alleKodeverk={alleKodeverk}
        navAnsatt={navAnsatt}
        valgtProsessSteg={valgtProsessSteg}
        valgtFaktaSteg={valgtFaktaSteg}
        oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
        oppdaterBehandlingVersjon={oppdaterBehandlingVersjon}
        opneSokeside={opneSokeside}
        hasFetchError={hasFetchError}
        featureToggles={featureToggles}
        apentFaktaPanelInfo={apentFaktaPanelInfo}
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
      <SvangerskapspengerFakta
        behandling={behandling}
        data={fetchedData}
        fagsak={fagsak}
        alleKodeverk={alleKodeverk}
        navAnsatt={navAnsatt}
        hasFetchError={hasFetchError}
        valgtFaktaSteg={valgtFaktaSteg}
        valgtProsessSteg={valgtProsessSteg}
        oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
        setApentFaktaPanel={setApentFaktaPanel}
      />
    </>
  );
};

export default SvangerskapspengerPaneler;

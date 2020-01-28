import React, { FunctionComponent, useState } from 'react';
import { useDispatch } from 'react-redux';

import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import {
  Kodeverk, NavAnsatt, FagsakInfo, BehandlingPaVent, SettPaVentParams, Behandling, TempPersonPanel,
} from '@fpsak-frontend/behandling-felles';
import { featureToggle as FeatureToggle } from '@fpsak-frontend/fp-felles';

import SvangerskapspengerProsess from './SvangerskapspengerProsess';
import SvangerskapspengerFakta from './SvangerskapspengerFakta';
import FetchedData from '../types/fetchedDataTsType';
import svpBehandlingApi from '../data/svpBehandlingApi';

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
  // TODO (TOR) Har trekt denne ut hit grunna redux test-oppsett. Fiks
  const dispatch = useDispatch();

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
        apentFaktaPanelInfo={apentFaktaPanelInfo}
        dispatch={dispatch}
        featureToggles={featureToggles}
      />
      <VerticalSpacer sixteenPx />
      <TempPersonPanel
        behandling={behandling}
        fagsak={fagsak}
        aksjonspunkter={fetchedData.aksjonspunkter}
        personopplysninger={fetchedData.personopplysninger}
        inntektArbeidYtelse={fetchedData.inntektArbeidYtelse}
        featureToggleUtland={featureToggles[FeatureToggle.MARKER_UTENLANDSSAK]}
        alleKodeverk={alleKodeverk}
        dispatch={dispatch}
        behandlingApi={svpBehandlingApi}
        oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
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
        dispatch={dispatch}
      />
    </>
  );
};

export default SvangerskapspengerPaneler;

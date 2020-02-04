import React, { FunctionComponent, useState } from 'react';
import { useDispatch } from 'react-redux';

import { VerticalSpacer } from '@fpsak-frontend/shared-components';

import {
  FagsakInfo, BehandlingPaVent, SettPaVentParams, TempPersonPanel,
} from '@fpsak-frontend/behandling-felles';
import { featureToggle as FeatureToggle } from '@fpsak-frontend/fp-felles';
import {
  Kodeverk, NavAnsatt, Behandling,
} from '@fpsak-frontend/types';

import fpBehandlingApi from '../data/fpBehandlingApi';
import ForeldrepengerProsess from './ForeldrepengerProsess';
import ForeldrepengerFakta from './ForeldrepengerFakta';
import FetchedData from '../types/fetchedDataTsType';

interface OwnProps {
  fetchedData: FetchedData;
  fagsak: FagsakInfo;
  behandling: Behandling;
  alleKodeverk: {[key: string]: Kodeverk[]};
  navAnsatt: NavAnsatt;
  valgtProsessSteg?: string;
  oppdaterProsessStegOgFaktaPanelIUrl: (punktnavn?: string, faktanavn?: string) => void;
  valgtFaktaSteg?: string;
  oppdaterBehandlingVersjon: (versjon: number) => void;
  settPaVent: (params: SettPaVentParams) => Promise<any>;
  hentBehandling: ({ behandlingId: number }, { keepData: boolean }) => Promise<any>;
  opneSokeside: () => void;
  hasFetchError: boolean;
  featureToggles: {};
}

const ForeldrepengerPaneler: FunctionComponent<OwnProps> = ({
  fetchedData,
  fagsak,
  behandling,
  alleKodeverk,
  navAnsatt,
  valgtProsessSteg,
  oppdaterProsessStegOgFaktaPanelIUrl,
  valgtFaktaSteg,
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
      <ForeldrepengerProsess
        data={fetchedData}
        fagsak={fagsak}
        behandling={behandling}
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
        dispatch={dispatch}
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
        behandlingApi={fpBehandlingApi}
        oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
      />
      <VerticalSpacer sixteenPx />
      <ForeldrepengerFakta
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

export default ForeldrepengerPaneler;

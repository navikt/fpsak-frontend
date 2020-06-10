import React, {
  FunctionComponent, useState, useCallback, useMemo,
} from 'react';
import { Dispatch } from 'redux';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import {
  FagsakInfo, Rettigheter, prosessStegHooks, IverksetterVedtakStatusModal, ProsessStegPanel, ProsessStegContainer,
} from '@fpsak-frontend/behandling-felles';
import { Kodeverk, KodeverkMedNavn, Behandling } from '@fpsak-frontend/types';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';

import AnkeBehandlingModal from './AnkeBehandlingModal';
import ankeBehandlingApi from '../data/ankeBehandlingApi';
import prosessStegPanelDefinisjoner from '../panelDefinisjoner/prosessStegAnkePanelDefinisjoner';
import FetchedData from '../types/fetchedDataTsType';

import '@fpsak-frontend/assets/styles/arrowForProcessMenu.less';

interface OwnProps {
  data: FetchedData;
  fagsak: FagsakInfo;
  behandling: Behandling;
  alleKodeverk: {[key: string]: KodeverkMedNavn[]};
  rettigheter: Rettigheter;
  valgtProsessSteg?: string;
  oppdaterBehandlingVersjon: (versjon: number) => void;
  oppdaterProsessStegOgFaktaPanelIUrl: (punktnavn?: string, faktanavn?: string) => void;
  opneSokeside: () => void;
  dispatch: Dispatch;
  alleBehandlinger: {
    id: number;
    type: Kodeverk;
    avsluttet?: string;
  }[];
}

const saveAnkeText = (dispatch, behandling, aksjonspunkter) => (aksjonspunktModel) => {
  const data = {
    behandlingId: behandling.id,
    ...aksjonspunktModel,
  };

  const getForeslaVedtakAp = aksjonspunkter
    .filter((ap) => ap.status.kode === aksjonspunktStatus.OPPRETTET)
    .filter((ap) => ap.definisjon.kode === aksjonspunktCodes.FORESLA_VEDTAK);

  if (getForeslaVedtakAp.length === 1) {
    dispatch(ankeBehandlingApi.SAVE_REOPEN_ANKE_VURDERING.makeRestApiRequest()(data));
  } else {
    dispatch(ankeBehandlingApi.SAVE_ANKE_VURDERING.makeRestApiRequest()(data));
  }
};

const previewCallback = (dispatch, fagsak, behandling) => (data) => {
  const brevData = {
    ...data,
    behandlingUuid: behandling.uuid,
    ytelseType: fagsak.fagsakYtelseType,
  };
  return dispatch(ankeBehandlingApi.PREVIEW_MESSAGE.makeRestApiRequest()(brevData));
};

const getLagringSideeffekter = (toggleIverksetterVedtakModal, toggleAnkeModal, toggleOppdatereFagsakContext,
  oppdaterProsessStegOgFaktaPanelIUrl) => (aksjonspunktModels) => {
  const skalTilMedunderskriver = aksjonspunktModels
    .some((apValue) => apValue.kode === aksjonspunktCodes.FORESLA_VEDTAK);
  const skalFerdigstilles = aksjonspunktModels
    .some((apValue) => apValue.kode === aksjonspunktCodes.VEDTAK_UTEN_TOTRINNSKONTROLL);
  const erManuellVurderingAvAnke = aksjonspunktModels
    .some((apValue) => apValue.kode === aksjonspunktCodes.MANUELL_VURDERING_AV_ANKE_MERKNADER);

  if (skalTilMedunderskriver || skalFerdigstilles || erManuellVurderingAvAnke) {
    toggleOppdatereFagsakContext(false);
  }

  // Returner funksjon som blir kjørt etter lagring av aksjonspunkt(er)
  return () => {
    if (skalTilMedunderskriver || skalFerdigstilles) {
      toggleAnkeModal(true);
    } else if (erManuellVurderingAvAnke) {
      toggleIverksetterVedtakModal(true);
    } else {
      oppdaterProsessStegOgFaktaPanelIUrl('default', 'default');
    }
  };
};

const AnkeProsess: FunctionComponent<OwnProps> = ({
  data,
  fagsak,
  behandling,
  alleKodeverk,
  rettigheter,
  valgtProsessSteg,
  oppdaterProsessStegOgFaktaPanelIUrl,
  oppdaterBehandlingVersjon,
  opneSokeside,
  alleBehandlinger,
  dispatch,
}) => {
  const toggleSkalOppdatereFagsakContext = prosessStegHooks.useOppdateringAvBehandlingsversjon(behandling.versjon, oppdaterBehandlingVersjon);

  const dataTilUtledingAvFpPaneler = {
    alleBehandlinger,
    ankeVurdering: data.ankeVurdering,
    saveAnke: useCallback(saveAnkeText(dispatch, behandling, data.aksjonspunkter), [behandling.versjon]),
    previewCallback: useCallback(previewCallback(dispatch, fagsak, behandling), [behandling.versjon]),
    ...data,
  };
  const [prosessStegPaneler, valgtPanel, formaterteProsessStegPaneler] = prosessStegHooks.useProsessStegPaneler(prosessStegPanelDefinisjoner,
    dataTilUtledingAvFpPaneler, fagsak, rettigheter, behandling, data.aksjonspunkter, data.vilkar, false, valgtProsessSteg);

  const [visIverksetterVedtakModal, toggleIverksetterVedtakModal] = useState(false);
  const [visModalAnkeBehandling, toggleAnkeModal] = useState(false);
  const lagringSideeffekterCallback = getLagringSideeffekter(toggleIverksetterVedtakModal, toggleAnkeModal, toggleSkalOppdatereFagsakContext,
    oppdaterProsessStegOgFaktaPanelIUrl);

  const velgProsessStegPanelCallback = prosessStegHooks.useProsessStegVelger(prosessStegPaneler, 'undefined', behandling,
    oppdaterProsessStegOgFaktaPanelIUrl, valgtProsessSteg, valgtPanel);

  const erFerdigbehandlet = useMemo(() => data.aksjonspunkter
    .some((ap) => ap.definisjon.kode === aksjonspunktCodes.VEDTAK_UTEN_TOTRINNSKONTROLL && ap.status.kode === aksjonspunktStatus.UTFORT),
  [behandling.versjon]);

  return (
    <>
      <IverksetterVedtakStatusModal
        visModal={visIverksetterVedtakModal}
        lukkModal={useCallback(() => { toggleIverksetterVedtakModal(false); opneSokeside(); }, [])}
        behandlingsresultat={behandling.behandlingsresultat}
      />
      <AnkeBehandlingModal
        visModal={visModalAnkeBehandling}
        lukkModal={useCallback(() => { toggleAnkeModal(false); opneSokeside(); }, [])}
        erFerdigbehandlet={erFerdigbehandlet}
      />
      <ProsessStegContainer
        formaterteProsessStegPaneler={formaterteProsessStegPaneler}
        velgProsessStegPanelCallback={velgProsessStegPanelCallback}
      >
        <ProsessStegPanel
          valgtProsessSteg={valgtPanel}
          fagsak={fagsak}
          behandling={behandling}
          alleKodeverk={alleKodeverk}
          lagringSideeffekterCallback={lagringSideeffekterCallback}
          behandlingApi={ankeBehandlingApi}
          dispatch={dispatch}
        />
      </ProsessStegContainer>
    </>
  );
};

export default AnkeProsess;

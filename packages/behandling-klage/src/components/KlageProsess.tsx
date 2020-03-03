import React, {
  FunctionComponent, useState, useCallback,
} from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { Dispatch } from 'redux';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import {
  FagsakInfo, prosessStegHooks, FatterVedtakStatusModal, ProsessStegPanel, ProsessStegContainer,
} from '@fpsak-frontend/behandling-felles';
import { Kodeverk, NavAnsatt, Behandling } from '@fpsak-frontend/types';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import klageVurderingKodeverk from '@fpsak-frontend/kodeverk/src/klageVurdering';

import KlageBehandlingModal from './KlageBehandlingModal';
import klageBehandlingApi from '../data/klageBehandlingApi';
import prosessStegPanelDefinisjoner from '../panelDefinisjoner/prosessStegKlagePanelDefinisjoner';
import FetchedData from '../types/fetchedDataTsType';

import '@fpsak-frontend/assets/styles/arrowForProcessMenu.less';

interface OwnProps {
  data: FetchedData;
  fagsak: FagsakInfo;
  behandling: Behandling;
  alleKodeverk: {[key: string]: Kodeverk[]};
  navAnsatt: NavAnsatt;
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

const saveKlageText = (dispatch, behandling, aksjonspunkter) => (aksjonspunktModel) => {
  const data = {
    behandlingId: behandling.id,
    ...aksjonspunktModel,
  };

  const getForeslaVedtakAp = aksjonspunkter
    .filter((ap) => ap.status.kode === aksjonspunktStatus.OPPRETTET)
    .filter((ap) => ap.definisjon.kode === aksjonspunktCodes.FORESLA_VEDTAK);

  if (getForeslaVedtakAp.length === 1) {
    dispatch(klageBehandlingApi.SAVE_REOPEN_KLAGE_VURDERING.makeRestApiRequest()(data));
  } else {
    dispatch(klageBehandlingApi.SAVE_KLAGE_VURDERING.makeRestApiRequest()(data));
  }
};

const previewCallback = (dispatch, fagsak, behandling) => (data) => {
  const brevData = {
    ...data,
    behandlingUuid: behandling.uuid,
    ytelseType: fagsak.fagsakYtelseType,
  };
  return dispatch(klageBehandlingApi.PREVIEW_MESSAGE.makeRestApiRequest()(brevData));
};

const getLagringSideeffekter = (toggleFatterVedtakModal, toggleKlageModal, toggleOppdatereFagsakContext,
  oppdaterProsessStegOgFaktaPanelIUrl) => (aksjonspunktModels) => {
  const skalByttTilKlageinstans = aksjonspunktModels
    .some((apValue) => apValue.kode === aksjonspunktCodes.BEHANDLE_KLAGE_NFP
    && apValue.klageVurdering === klageVurderingKodeverk.STADFESTE_YTELSESVEDTAK);
  const erVedtakAp = aksjonspunktModels[0].kode === aksjonspunktCodes.FORESLA_VEDTAK
    || aksjonspunktModels[0].kode === aksjonspunktCodes.VEDTAK_UTEN_TOTRINNSKONTROLL;

  if (skalByttTilKlageinstans || erVedtakAp) {
    toggleOppdatereFagsakContext(false);
  }

  // Returner funksjon som blir kjørt etter lagring av aksjonspunkt(er)
  return () => {
    if (skalByttTilKlageinstans) {
      toggleKlageModal(false);
    } else if (erVedtakAp) {
      toggleFatterVedtakModal(false);
    } else {
      oppdaterProsessStegOgFaktaPanelIUrl('default', 'default');
    }
  };
};

const AnkeProsess: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  intl,
  data,
  fagsak,
  behandling,
  alleKodeverk,
  navAnsatt,
  valgtProsessSteg,
  oppdaterBehandlingVersjon,
  oppdaterProsessStegOgFaktaPanelIUrl,
  opneSokeside,
  alleBehandlinger,
  dispatch,
}) => {
  const toggleSkalOppdatereFagsakContext = prosessStegHooks.useOppdateringAvBehandlingsversjon(behandling.versjon, oppdaterBehandlingVersjon);

  const dataTilUtledingAvFpPaneler = {
    alleBehandlinger,
    klageVurdering: data.klageVurdering,
    saveKlageText: useCallback(saveKlageText(dispatch, behandling, data.aksjonspunkter), [behandling.versjon]),
    previewCallback: useCallback(previewCallback(dispatch, fagsak, behandling), [behandling.versjon]),
    ...data,
  };
  const [prosessStegPaneler, valgtPanel, formaterteProsessStegPaneler] = prosessStegHooks.useProsessStegPaneler(prosessStegPanelDefinisjoner,
    dataTilUtledingAvFpPaneler, fagsak, navAnsatt, behandling, data.aksjonspunkter, data.vilkar, false, intl, valgtProsessSteg);

  const [visFatterVedtakModal, toggleFatterVedtakModal] = useState(false);
  const [visModalKlageBehandling, toggleKlageModal] = useState(false);
  const lagringSideeffekterCallback = getLagringSideeffekter(toggleFatterVedtakModal, toggleKlageModal, toggleSkalOppdatereFagsakContext,
    oppdaterProsessStegOgFaktaPanelIUrl);

  const velgProsessStegPanelCallback = prosessStegHooks.useProsessStegVelger(prosessStegPaneler, 'undefined', behandling,
    oppdaterProsessStegOgFaktaPanelIUrl, valgtProsessSteg, valgtPanel);

  const skalViseTilBeslutterTekst = data.klageVurdering && data.klageVurdering.klageVurderingResultatNK
    && data.klageVurdering.klageVurderingResultatNK.godkjentAvMedunderskriver;

  return (
    <>
      <KlageBehandlingModal
        visModal={visModalKlageBehandling}
        lukkModal={useCallback(() => { toggleKlageModal(false); opneSokeside(); }, [])}
      />
      <FatterVedtakStatusModal
        visModal={visFatterVedtakModal}
        lukkModal={useCallback(() => { toggleFatterVedtakModal(false); opneSokeside(); }, [])}
        tekstkode={skalViseTilBeslutterTekst
          ? 'FatterVedtakStatusModal.SendtKlageResultatTilBeslutter' : 'FatterVedtakStatusModal.SendtKlageResultatTilMedunderskriver'}
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
          behandlingApi={klageBehandlingApi}
          dispatch={dispatch}
        />
      </ProsessStegContainer>
    </>
  );
};

export default injectIntl(AnkeProsess);

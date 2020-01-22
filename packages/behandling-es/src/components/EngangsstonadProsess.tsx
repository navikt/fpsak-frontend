import React, {
  FunctionComponent, useState, useCallback, useMemo,
} from 'react';
import { setSubmitFailed } from 'redux-form';
import ProcessMenu from '@navikt/nap-process-menu';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import {
  Kodeverk, NavAnsatt, FagsakInfo, Behandling, prosessStegHooks, IverksetterVedtakStatusModal, ProsessStegPanel, FatterVedtakStatusModal,
} from '@fpsak-frontend/behandling-felles';

import esBehandlingApi from '../data/esBehandlingApi';
import prosessStegPanelDefinisjoner from '../panelDefinisjoner/prosessStegEsPanelDefinisjoner';
import FetchedData from '../types/fetchedDataTsType';

import '@fpsak-frontend/assets/styles/arrowForProcessMenu.less';

interface OwnProps {
  data: FetchedData;
  fagsak: FagsakInfo;
  behandling: Behandling;
  alleKodeverk: {[key: string]: Kodeverk[]};
  navAnsatt: NavAnsatt;
  valgtProsessSteg?: string;
  valgtFaktaSteg?: string;
  hasFetchError: boolean;
  oppdaterBehandlingVersjon: (versjon: number) => void;
  oppdaterProsessStegOgFaktaPanelIUrl: (punktnavn?: string, faktanavn?: string) => void;
  featureToggles: {};
  opneSokeside: () => void;
  apentFaktaPanelInfo?: { urlCode: string; textCode: string };
  dispatch: (data: any) => Promise<any>;
}

const getForhandsvisCallback = (dispatch, behandling) => (data) => {
  const brevData = {
    ...data,
    behandling: behandling.uuid,
    ytelseType: fagsakYtelseType.ENGANGSSTONAD,
  };
  return dispatch(esBehandlingApi.PREVIEW_MESSAGE.makeRestApiRequest()(brevData));
};

const getForhandsvisFptilbakeCallback = (dispatch, fagsak, behandling) => (mottaker, brevmalkode, fritekst, saksnummer) => {
  const data = {
    behandlingUuid: behandling.uuid,
    fagsakYtelseType: fagsak.fagsakYtelseType,
    varseltekst: fritekst || '',
    mottaker,
    brevmalkode,
    saksnummer,
  };
  return dispatch(esBehandlingApi.PREVIEW_TILBAKEKREVING_MESSAGE.makeRestApiRequest()(data));
};

const getLagringSideeffekter = (toggleIverksetterVedtakModal, toggleFatterVedtakModal, toggleOppdatereFagsakContext, oppdaterProsessStegOgFaktaPanelIUrl,
  opneSokeside) => (aksjonspunktModels) => {
  const erRevurderingsaksjonspunkt = aksjonspunktModels.some((apModel) => ((apModel.kode === aksjonspunktCodes.VARSEL_REVURDERING_MANUELL
    || apModel.kode === aksjonspunktCodes.VARSEL_REVURDERING_ETTERKONTROLL) && apModel.sendVarsel));
  const visIverksetterVedtakModal = aksjonspunktModels[0].isVedtakSubmission && aksjonspunktModels[0].kode === aksjonspunktCodes.FATTER_VEDTAK;
  const visFatterVedtakModal = aksjonspunktModels[0].isVedtakSubmission && aksjonspunktModels[0].kode === aksjonspunktCodes.FORESLA_VEDTAK;
  const isVedtakAp = aksjonspunktModels.some((a) => a.isVedtakSubmission);

  if (visIverksetterVedtakModal || visFatterVedtakModal || erRevurderingsaksjonspunkt || isVedtakAp) {
    toggleOppdatereFagsakContext(false);
  }

  // Returner funksjon som blir kjørt etter lagring av aksjonspunkt(er)
  return () => {
    if (visFatterVedtakModal) {
      toggleFatterVedtakModal(true);
    } else if (visIverksetterVedtakModal) {
      toggleIverksetterVedtakModal(true);
    } else if (erRevurderingsaksjonspunkt) {
      opneSokeside();
    } else {
      oppdaterProsessStegOgFaktaPanelIUrl('default', 'default');
    }
  };
};

const EngangsstonadProsess: FunctionComponent<OwnProps> = ({
  data,
  fagsak,
  behandling,
  alleKodeverk,
  navAnsatt,
  valgtProsessSteg,
  valgtFaktaSteg,
  hasFetchError,
  oppdaterBehandlingVersjon,
  oppdaterProsessStegOgFaktaPanelIUrl,
  featureToggles,
  opneSokeside,
  apentFaktaPanelInfo,
  dispatch,
}) => {
  const toggleSkalOppdatereFagsakContext = prosessStegHooks.useOppdateringAvBehandlingsversjon(behandling.versjon, oppdaterBehandlingVersjon);

  const dataTilUtledingAvFpPaneler = {
    previewCallback: useCallback(() => getForhandsvisCallback(dispatch, behandling), []),
    previewFptilbakeCallback: useCallback(() => getForhandsvisFptilbakeCallback(dispatch, fagsak, behandling), []),
    dispatchSubmitFailed: useCallback(() => dispatch(setSubmitFailed), []),
    alleKodeverk,
    featureToggles,
    ...data,
  };
  const [prosessStegPaneler, valgtPanel, formaterteProsessStegPaneler] = prosessStegHooks.useProsessStegPaneler(prosessStegPanelDefinisjoner,
    dataTilUtledingAvFpPaneler, valgtProsessSteg, apentFaktaPanelInfo, fagsak, navAnsatt, behandling, data.aksjonspunkter, data.vilkar, hasFetchError);

  const [visIverksetterVedtakModal, toggleIverksetterVedtakModal] = useState(false);
  const [visFatterVedtakModal, toggleFatterVedtakModal] = useState(false);
  const lagringSideeffekterCallback = getLagringSideeffekter(toggleIverksetterVedtakModal, toggleFatterVedtakModal, toggleSkalOppdatereFagsakContext,
    oppdaterProsessStegOgFaktaPanelIUrl, opneSokeside);

  const velgProsessStegPanelCallback = prosessStegHooks.useProsessStegVelger(prosessStegPaneler, valgtFaktaSteg, behandling,
    oppdaterProsessStegOgFaktaPanelIUrl, valgtProsessSteg);

  const fatterVedtakTextCode = useMemo(() => (valgtPanel && valgtPanel.status === vilkarUtfallType.OPPFYLT
    ? 'FatterVedtakStatusModal.SendtBeslutter' : 'FatterVedtakStatusModal.ModalDescriptionES'),
  [behandling.versjon]);

  return (
    <>
      <IverksetterVedtakStatusModal
        visModal={visIverksetterVedtakModal}
        lukkModal={useCallback(() => { toggleIverksetterVedtakModal(false); opneSokeside(); }, [])}
        behandlingsresultat={behandling.behandlingsresultat}
      />
      <FatterVedtakStatusModal
        visModal={visFatterVedtakModal && behandling.status.kode === behandlingStatus.FATTER_VEDTAK}
        lukkModal={useCallback(() => { toggleFatterVedtakModal(false); opneSokeside(); }, [])}
        tekstkode={fatterVedtakTextCode}
      />
      <ProcessMenu steps={formaterteProsessStegPaneler} onClick={velgProsessStegPanelCallback} />
      <ProsessStegPanel
        valgtPanel={valgtPanel}
        fagsak={fagsak}
        behandling={behandling}
        alleKodeverk={alleKodeverk}
        apentFaktaPanelInfo={apentFaktaPanelInfo}
        oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
        lagringSideeffekterCallback={lagringSideeffekterCallback}
        behandlingApi={esBehandlingApi}
        dispatch={dispatch}
      />
    </>
  );
};

export default EngangsstonadProsess;

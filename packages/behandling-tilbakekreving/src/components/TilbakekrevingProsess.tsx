import React, {
  FunctionComponent, useState, useCallback,
} from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { Dispatch } from 'redux';

import aksjonspunktCodesTilbakekreving from '@fpsak-frontend/kodeverk/src/aksjonspunktCodesTilbakekreving';
import { AdvarselModal } from '@fpsak-frontend/shared-components';
import {
  FagsakInfo, prosessStegHooks, FatterVedtakStatusModal, ProsessStegPanel, ProsessStegContainer, Rettigheter,
} from '@fpsak-frontend/behandling-felles';
import { Kodeverk, Behandling } from '@fpsak-frontend/types';

import tilbakekrevingApi from '../data/tilbakekrevingBehandlingApi';
import prosessStegPanelDefinisjoner from '../panelDefinisjoner/prosessStegTilbakekrevingPanelDefinisjoner';
import FetchedData from '../types/fetchedDataTsType';

import '@fpsak-frontend/assets/styles/arrowForProcessMenu.less';

interface OwnProps {
  data: FetchedData;
  fagsak: FagsakInfo;
  behandling: Behandling;
  alleKodeverk: {[key: string]: Kodeverk[]};
  rettigheter: Rettigheter;
  valgtProsessSteg?: string;
  hasFetchError: boolean;
  oppdaterBehandlingVersjon: (versjon: number) => void;
  oppdaterProsessStegOgFaktaPanelIUrl: (punktnavn?: string, faktanavn?: string) => void;
  opneSokeside: () => void;
  dispatch: Dispatch;
  harApenRevurdering: boolean;
}

const getForhandsvisCallback = (dispatch) => (data) => dispatch(tilbakekrevingApi.PREVIEW_VEDTAKSBREV.makeRestApiRequest()(data));

const getBeregnBelopCallback = (dispatch) => (data) => dispatch(tilbakekrevingApi.BEREGNE_BELØP.makeRestApiRequest()(data));

const getLagringSideeffekter = (toggleFatterVedtakModal, toggleOppdatereFagsakContext, oppdaterProsessStegOgFaktaPanelIUrl) => (aksjonspunktModels) => {
  const isFatterVedtakAp = aksjonspunktModels.some((ap) => ap.kode === aksjonspunktCodesTilbakekreving.FORESLA_VEDTAK);
  if (isFatterVedtakAp) {
    toggleOppdatereFagsakContext(false);
  }

  // Returner funksjon som blir kjørt etter lagring av aksjonspunkt(er)
  return () => {
    if (isFatterVedtakAp) {
      toggleFatterVedtakModal(true);
    } else {
      oppdaterProsessStegOgFaktaPanelIUrl('default', 'default');
    }
  };
};

const TilbakekrevingProsess: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  intl,
  data,
  fagsak,
  behandling,
  alleKodeverk,
  rettigheter,
  valgtProsessSteg,
  hasFetchError,
  oppdaterBehandlingVersjon,
  oppdaterProsessStegOgFaktaPanelIUrl,
  opneSokeside,
  harApenRevurdering,
  dispatch,
}) => {
  const toggleSkalOppdatereFagsakContext = prosessStegHooks.useOppdateringAvBehandlingsversjon(behandling.versjon, oppdaterBehandlingVersjon);

  const dataTilUtledingAvTilbakekrevingPaneler = {
    beregnBelop: useCallback(getBeregnBelopCallback(dispatch), [behandling.versjon]),
    fetchPreviewVedtaksbrev: useCallback(getForhandsvisCallback(dispatch), [behandling.versjon]),
    ...data,
  };
  const [prosessStegPaneler, valgtPanel, formaterteProsessStegPaneler] = prosessStegHooks.useProsessStegPaneler(prosessStegPanelDefinisjoner,
    dataTilUtledingAvTilbakekrevingPaneler, fagsak, rettigheter, behandling, data.aksjonspunkter, [], hasFetchError, intl, valgtProsessSteg);

  const [visApenRevurderingModal, toggleApenRevurderingModal] = useState(harApenRevurdering);
  const lukkApenRevurderingModal = useCallback(() => toggleApenRevurderingModal(false), []);
  const [visFatterVedtakModal, toggleFatterVedtakModal] = useState(false);
  const lagringSideeffekterCallback = getLagringSideeffekter(toggleFatterVedtakModal, toggleSkalOppdatereFagsakContext, oppdaterProsessStegOgFaktaPanelIUrl);

  const velgProsessStegPanelCallback = prosessStegHooks.useProsessStegVelger(prosessStegPaneler, 'default', behandling,
    oppdaterProsessStegOgFaktaPanelIUrl, valgtProsessSteg, valgtPanel);

  return (
    <>
      {visApenRevurderingModal && (
        <AdvarselModal
          headerTextCode="BehandlingTilbakekrevingIndex.ApenRevurderingHeader"
          textCode="BehandlingTilbakekrevingIndex.ApenRevurdering"
          showModal
          submit={lukkApenRevurderingModal}
        />
      )}
      <FatterVedtakStatusModal
        visModal={visFatterVedtakModal}
        lukkModal={useCallback(() => { toggleFatterVedtakModal(false); opneSokeside(); }, [])}
        tekstkode="FatterTilbakekrevingVedtakStatusModal.Sendt"
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
          oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
          lagringSideeffekterCallback={lagringSideeffekterCallback}
          behandlingApi={tilbakekrevingApi}
          dispatch={dispatch}
        />
      </ProsessStegContainer>
    </>
  );
};

export default injectIntl(TilbakekrevingProsess);

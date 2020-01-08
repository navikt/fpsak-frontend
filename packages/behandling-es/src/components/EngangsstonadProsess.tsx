import React, {
  FunctionComponent, useState, useEffect, useCallback, useMemo,
} from 'react';
import { useIntl, WrappedComponentProps } from 'react-intl';
import { useDispatch } from 'react-redux';
import { setSubmitFailed } from 'redux-form';
import ProcessMenu from '@navikt/nap-process-menu';

import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import aksjonspunktCodesTilbakekreving from '@fpsak-frontend/kodeverk/src/aksjonspunktCodesTilbakekreving';
import { behandlingspunktCodes as bpc, allAccessRights } from '@fpsak-frontend/fp-felles';
import {
  Kodeverk, NavAnsatt, FagsakInfo, Behandling, Aksjonspunkt, MargMarkering, prosessStegPanelUtils, Vilkar,
  BehandlingHenlagtPanel, ProsessStegIkkeBehandletPanel, SimuleringResultat,
  DataFetcherBehandlingDataV2,
} from '@fpsak-frontend/behandling-felles';

import esBehandlingApi from '../data/esBehandlingApi';
import prosessStegPanelDefinisjoner from '../definition/prosessStegPanelDefinisjoner';
import EngangsstonadProsessModaler from './EngangsstonadProsessModaler';

import '@fpsak-frontend/assets/styles/arrowForProcessMenu.less';

interface OwnProps {
  fagsak: FagsakInfo;
  behandling: Behandling;
  aksjonspunkter: Aksjonspunkt[];
  vilkar: Vilkar[];
  simuleringResultat: SimuleringResultat;
  alleKodeverk: {[key: string]: Kodeverk[]};
  navAnsatt: NavAnsatt;
  valgtProsessSteg?: string;
  oppdaterProsessStegIUrl: (punktnavn?: string) => void;
  oppdaterBehandlingVersjon: (versjon: number) => void;
  opneSokeside: () => void;
  hasFetchError: boolean;
  harApenRevurdering: boolean;
}

interface DispatchProps {
  lagreAksjonspunkt: (params: {}, { keepData: boolean }) => Promise<any>;
}

type Props = OwnProps & DispatchProps & WrappedComponentProps;

const getPreviewCallback = (dispatch, behandling) => (data) => {
  const brevData = {
    ...data,
    behandling: behandling.uuid,
    ytelseType: fagsakYtelseType.ENGANGSSTONAD,
  };
  return dispatch(esBehandlingApi.PREVIEW_MESSAGE.makeRestApiRequest()(brevData));
};

const getPreviewFptilbakeCallback = (dispatch, fagsak, behandling) => (mottaker, brevmalkode, fritekst, saksnummer) => {
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

const getSubmitAksjonspunkter = (dispatch, toggleFatterVedtakModal, toggleOppdatereFagsakContext,
  fagsak, behandling, oppdaterProsessStegIUrl) => (aksjonspunktModels) => {
  const isFatterVedtakAp = aksjonspunktModels.some((ap) => ap.kode === aksjonspunktCodesTilbakekreving.FORESLA_VEDTAK);

  const { id, versjon } = behandling;
  const models = aksjonspunktModels.map((ap) => ({
    '@type': ap.kode,
    ...ap,
  }));

  const params = {
    saksnummer: fagsak.saksnummer,
    behandlingId: id,
    behandlingVersjon: versjon,
    bekreftedeAksjonspunktDtoer: models,
  };

  return dispatch(esBehandlingApi.SAVE_AKSJONSPUNKT.makeRestApiRequest()(params, { keepData: true }))
    .then(() => {
      if (isFatterVedtakAp) {
        toggleOppdatereFagsakContext(false);
        toggleFatterVedtakModal(true);
      } else {
        oppdaterProsessStegIUrl('default');
      }
    });
};

const EngangsstonadProsess: FunctionComponent<Props> = ({
  fagsak,
  behandling,
  aksjonspunkter,
  vilkar,
  simuleringResultat,
  beregningresultatEngangsstonad,
  alleKodeverk,
  navAnsatt,
  valgtProsessSteg,
  hasFetchError,
  harApenRevurdering,
  oppdaterBehandlingVersjon,
  oppdaterProsessStegIUrl,
  featureToggles,
}) => {
  const intl = useIntl();
  const dispatch = useDispatch();

  const [visFatterVedtakModal, toggleFatterVedtakModal] = useState(false);
  const [skalOppdatereFagsakKontekst, toggleOppdatereFagsakContext] = useState(true);
  const [overstyrteProsessSteg, toggleOverstyrteProsessSteg] = useState([]);

  const submitAksjonspunkter = useCallback(() => getSubmitAksjonspunkter(dispatch,
    toggleFatterVedtakModal, toggleOppdatereFagsakContext, fagsak, behandling, oppdaterProsessStegIUrl), [behandling.versjon]);
  const previewCallback = useCallback(() => getPreviewCallback(dispatch, behandling), []);
  const previewFptilbakeCallback = useCallback(() => getPreviewFptilbakeCallback(dispatch, fagsak, behandling), []);
  const dispatchSubmitFailed = useCallback(() => dispatch(setSubmitFailed), []);

  useEffect(() => {
    if (skalOppdatereFagsakKontekst) {
      oppdaterBehandlingVersjon(behandling.versjon);
    }
  }, [behandling.versjon]);

  const rettigheter = allAccessRights(navAnsatt, fagsak.fagsakStatus, behandling.status, behandling.type);
  const ekstraPanelData = {
    previewCallback,
    previewFptilbakeCallback,
    rettigheter,
    aksjonspunkter,
    vilkar,
    overstyrteProsessSteg,
    alleKodeverk,
    dispatchSubmitFailed,
    featureToggles,
    simuleringResultat,
    fagsak,
    beregningresultatEngangsstonad,
    behandlingsresultat: behandling.behandlingsresultat,
  };

  const prosessStegPaneler = useMemo(() => prosessStegPanelUtils.utledProsessStegPaneler(
    prosessStegPanelDefinisjoner, ekstraPanelData, behandling, aksjonspunkter, vilkar, navAnsatt, fagsak, hasFetchError, intl,
  ), [
    behandling.versjon,
  ]);

  const valgtPanel = useMemo(() => prosessStegPanelUtils.finnValgtPanel(prosessStegPaneler, valgtProsessSteg), [behandling.versjon, valgtProsessSteg]);
  const valgtPanelKode = valgtPanel ? valgtPanel.urlCode : undefined;

  const formaterteProsessStegPaneler = useMemo(() => prosessStegPanelUtils.formaterPanelerForProsessmeny(intl, prosessStegPaneler, valgtPanelKode),
    [behandling.versjon, valgtPanelKode]);

  const processMenuCallback = useCallback((index) => {
    const nyttValg = prosessStegPaneler[index].urlCode;
    const forrigeValg = valgtProsessSteg;
    oppdaterProsessStegIUrl(!forrigeValg || nyttValg !== forrigeValg ? nyttValg : undefined);
  }, [behandling.versjon, valgtProsessSteg]);

  return (
    <>
      <EngangsstonadProsessModaler
        behandling={behandling}
        harApenRevurdering={harApenRevurdering}
        visFatterVedtakModal={visFatterVedtakModal}
        toggleFatterVedtakModal={toggleFatterVedtakModal}
      />
      <ProcessMenu steps={formaterteProsessStegPaneler} onClick={processMenuCallback} />
      {(valgtPanel && valgtPanel.erStegBehandlet) && (
        <MargMarkering
          behandlingStatus={behandling.status}
          aksjonspunkter={valgtPanel.aksjonspunkter}
          isReadOnly={valgtPanel.isReadOnly}
        >
          <DataFetcherBehandlingDataV2
            key={valgtPanel.urlCode}
            behandlingVersion={behandling.versjon}
            endpoints={valgtPanel.endpoints}
            render={(dataProps) => valgtPanel.renderComponent({
              ...dataProps,
              alleKodeverk,
              submitCallback: submitAksjonspunkter,
              kanOverstyreAccess: rettigheter.kanOverstyreAccess,
              toggleOverstyring: toggleOverstyrteProsessSteg,
              ...valgtPanel.componentData,
            })}
          />
        </MargMarkering>
      )}
      {(valgtPanelKode === bpc.VEDTAK && behandling.behandlingHenlagt) && (
        <BehandlingHenlagtPanel />
      )}
      {(valgtPanel && !valgtPanel.erStegBehandlet && (valgtPanelKode !== bpc.VEDTAK
        || (valgtPanelKode === bpc.VEDTAK && !behandling.behandlingHenlagt))) && (
        <ProsessStegIkkeBehandletPanel />
      )}

    </>
  );
};

export default EngangsstonadProsess;

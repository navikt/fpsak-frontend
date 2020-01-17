import React, {
  FunctionComponent, useState, useEffect, useCallback, useMemo,
} from 'react';
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { setSubmitFailed } from 'redux-form';
import ProcessMenu from '@navikt/nap-process-menu';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { behandlingspunktCodes as bpc } from '@fpsak-frontend/fp-felles';
import {
  Kodeverk, NavAnsatt, Behandling, FagsakInfo, MargMarkering, prosessStegPanelUtils, BehandlingHenlagtPanel, ProsessStegIkkeBehandletPanel,
  MultipleProcessPanel, IverksetterVedtakStatusModal,
} from '@fpsak-frontend/behandling-felles';

import svpBehandlingApi from '../data/svpBehandlingApi';
import prosessStegPanelDefinisjoner from '../panelDefinisjoner/prosessStegSvpPanelDefinisjoner';
import FetchedData from '../types/fetchedDataTsType';

import '@fpsak-frontend/assets/styles/arrowForProcessMenu.less';

interface OwnProps {
  data: FetchedData;
  fagsak: FagsakInfo;
  behandling: Behandling;
  alleKodeverk: {[key: string]: Kodeverk[]};
  navAnsatt: NavAnsatt;
  valgtProsessSteg?: string;
  hasFetchError: boolean;
  oppdaterBehandlingVersjon: (versjon: number) => void;
  oppdaterProsessStegIUrl: (punktnavn?: string) => void;
  featureToggles: {};
  opneSokeside: () => void;
  harApentFaktaAksjonspunkt: boolean;
}

const getPreviewCallback = (dispatch, behandling) => (data) => {
  const brevData = {
    ...data,
    behandling: behandling.uuid,
    ytelseType: fagsakYtelseType.ENGANGSSTONAD,
  };
  return dispatch(svpBehandlingApi.PREVIEW_MESSAGE.makeRestApiRequest()(brevData));
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
  return dispatch(svpBehandlingApi.PREVIEW_TILBAKEKREVING_MESSAGE.makeRestApiRequest()(data));
};

const getLagringSideEffects = (toggleIverksetterVedtakModal, toggleOppdatereFagsakContext, oppdaterProsessStegIUrl, opneSokeside) => (aksjonspunktModels) => {
  const erRevurderingsaksjonspunkt = aksjonspunktModels.some((apModel) => ((apModel.kode === aksjonspunktCodes.VARSEL_REVURDERING_MANUELL
    || apModel.kode === aksjonspunktCodes.VARSEL_REVURDERING_ETTERKONTROLL) && apModel.sendVarsel));
  const visIverksetterVedtakModal = aksjonspunktModels[0].isVedtakSubmission && aksjonspunktModels[0].kode === aksjonspunktCodes.FATTER_VEDTAK;
  const isVedtakAp = aksjonspunktModels.some((a) => a.isVedtakSubmission);

  if (visIverksetterVedtakModal || erRevurderingsaksjonspunkt || isVedtakAp) {
    toggleOppdatereFagsakContext(false);
  }

  // Returner funksjon som blir kjørt etter lagring av aksjonspunkt(er)
  return () => {
    if (visIverksetterVedtakModal) {
      toggleIverksetterVedtakModal(true);
    } else if (erRevurderingsaksjonspunkt) {
      opneSokeside();
    } else {
      oppdaterProsessStegIUrl('default');
    }
  };
};

const SvangerskapspengerProsess: FunctionComponent<OwnProps> = ({
  data,
  fagsak,
  behandling,
  alleKodeverk,
  navAnsatt,
  valgtProsessSteg,
  hasFetchError,
  oppdaterBehandlingVersjon,
  oppdaterProsessStegIUrl,
  featureToggles,
  opneSokeside,
  harApentFaktaAksjonspunkt,
}) => {
  const {
    aksjonspunkter, vilkar, simuleringResultat, beregningresultatForeldrepenger, beregningsgrunnlag,
  } = data;
  const intl = useIntl();
  const dispatch = useDispatch();

  const [overstyrteAksjonspunkter, toggleOverstyring] = useState([]);
  const [visIverksetterVedtakModal, toggleIverksetterVedtakModal] = useState(false);
  const [skalOppdatereFagsakKontekst, toggleOppdatereFagsakContext] = useState(true);
  const toggleIverksetterModalOgGaTilSokeside = useCallback(() => { toggleIverksetterVedtakModal(false); opneSokeside(); }, []);

  useEffect(() => {
    if (skalOppdatereFagsakKontekst) {
      oppdaterBehandlingVersjon(behandling.versjon);
    }
  }, [behandling.versjon]);


  const ekstraPanelData = {
    previewCallback: useCallback(() => getPreviewCallback(dispatch, behandling), []),
    previewFptilbakeCallback: useCallback(() => getPreviewFptilbakeCallback(dispatch, fagsak, behandling), []),
    dispatchSubmitFailed: useCallback(() => dispatch(setSubmitFailed), []),
    tempUpdateStonadskontoer: useCallback(() => dispatch(svpBehandlingApi.STONADSKONTOER_GITT_UTTAKSPERIODER.makeRestApiRequest()(data)), []),
    overstyrteAksjonspunkter,
    alleKodeverk,
    featureToggles,
    simuleringResultat,
    beregningresultatForeldrepenger,
    beregningsgrunnlag,
  };
  const prosessStegPaneler = useMemo(() => prosessStegPanelUtils.utledProsessStegPaneler(prosessStegPanelDefinisjoner, ekstraPanelData, toggleOverstyring,
    overstyrteAksjonspunkter, behandling, aksjonspunkter, vilkar, navAnsatt, fagsak, hasFetchError, intl), [behandling.versjon, overstyrteAksjonspunkter]);

  const valgtPanel = useMemo(() => prosessStegPanelUtils.finnValgtPanel(prosessStegPaneler, valgtProsessSteg, behandling.behandlingHenlagt),
    [behandling.versjon, valgtProsessSteg, overstyrteAksjonspunkter]);
  const valgtPanelKode = valgtPanel ? valgtPanel.urlCode : undefined;
  const erStegBehandlet = valgtPanel ? valgtPanel.erStegBehandlet : false;
  const erHenlagtOgVedtakStegValgt = behandling.behandlingHenlagt && valgtPanelKode === bpc.VEDTAK;

  const formaterteProsessStegPaneler = useMemo(() => prosessStegPanelUtils.formaterPanelerForProsessmeny(intl, prosessStegPaneler, valgtPanelKode),
    [behandling.versjon, valgtPanelKode, overstyrteAksjonspunkter]);

  const prosessmenyCallback = useCallback((index) => {
    const nyttProsessStegValg = prosessStegPaneler[index].urlCode;
    oppdaterProsessStegIUrl(!valgtProsessSteg || nyttProsessStegValg !== valgtProsessSteg ? nyttProsessStegValg : undefined);
  }, [behandling.versjon, valgtProsessSteg]);

  const lagringSideEffectsCallback = getLagringSideEffects(toggleIverksetterVedtakModal, toggleOppdatereFagsakContext, oppdaterProsessStegIUrl, opneSokeside);
  const bekreftAksjonspunktCallback = useCallback((aksjonspunktModels) => prosessStegPanelUtils.getBekreftAksjonspunktCallback(dispatch,
    lagringSideEffectsCallback, fagsak, behandling, aksjonspunkter, svpBehandlingApi)(aksjonspunktModels), [behandling.versjon]);

  return (
    <>
      <IverksetterVedtakStatusModal
        visModal={visIverksetterVedtakModal}
        lukkModal={toggleIverksetterModalOgGaTilSokeside}
        behandlingsresultat={behandling.behandlingsresultat}
      />
      <ProcessMenu steps={formaterteProsessStegPaneler} onClick={prosessmenyCallback} />
      {erStegBehandlet && (
        <MargMarkering
          behandlingStatus={behandling.status}
          aksjonspunkter={valgtPanel.aksjonspunkter}
          isReadOnly={valgtPanel.isReadOnly}
        >
          <MultipleProcessPanel
            behandling={behandling}
            alleKodeverk={alleKodeverk}
            prosessStegData={valgtPanel.panelData}
            submitCallback={bekreftAksjonspunktCallback}
            harApentFaktaAksjonspunkt={harApentFaktaAksjonspunkt}
          />
        </MargMarkering>
      )}
      {erHenlagtOgVedtakStegValgt && (
        <BehandlingHenlagtPanel />
      )}
      {(valgtPanelKode && !erStegBehandlet && !erHenlagtOgVedtakStegValgt) && (
        <ProsessStegIkkeBehandletPanel />
      )}
    </>
  );
};

export default SvangerskapspengerProsess;

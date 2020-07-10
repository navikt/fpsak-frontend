import React, {
  FunctionComponent, useState, useEffect, useCallback,
} from 'react';
import { withRouter } from 'react-router-dom';
import { push } from 'connected-react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Location } from 'history';

import { useGlobalStateRestApiData, RestApiState } from '@fpsak-frontend/rest-api-hooks';
import vurderPaNyttArsakType from '@fpsak-frontend/kodeverk/src/vurderPaNyttArsakType';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { featureToggle } from '@fpsak-frontend/konstanter';
import { NavAnsatt, Kodeverk, KodeverkMedNavn } from '@fpsak-frontend/types';
import { requireProps, LoadingPanel } from '@fpsak-frontend/shared-components';
import TotrinnskontrollSakIndex, { FatterVedtakApprovalModalSakIndex } from '@fpsak-frontend/sak-totrinnskontroll';
import klageBehandlingArsakType from '@fpsak-frontend/kodeverk/src/behandlingArsakType';
import { DataFetcher, DataFetcherTriggers } from '@fpsak-frontend/rest-api-redux';

import { createLocationForSkjermlenke } from '../../app/paths';
import fpsakApi from '../../data/fpsakApi';
import { getFagsakYtelseType, isForeldrepengerFagsak } from '../../fagsak/fagsakSelectors';
import { getBehandlingerUuidsMappedById } from '../../behandling/selectors/behandlingerSelectors';
import {
  getBehandlingAnsvarligSaksbehandler,
  getBehandlingIdentifier,
  getBehandlingToTrinnsBehandling,
  getBehandlingVersjon,
  previewMessage,
  getBehandlingStatus,
  getBehandlingType,
  getBehandlingArsaker,
  getSelectedBehandlingId,
  getBehandlingsresultat,
} from '../../behandling/duck';
import BehandlingIdentifier from '../../behandling/BehandlingIdentifier';
import { FpsakApiKeys, useRestApi, requestApi } from '../../data/fpsakApiNyUtenRedux';
import { useFpSakKodeverk, useFpTilbakeKodeverk } from '../../data/useKodeverk';

const getArsaker = (approval) => ([{
  code: vurderPaNyttArsakType.FEIL_FAKTA,
  isSet: approval.feilFakta,
}, {
  code: vurderPaNyttArsakType.FEIL_LOV,
  isSet: approval.feilLov,
}, {
  code: vurderPaNyttArsakType.FEIL_REGEL,
  isSet: approval.feilRegel,
}, {
  code: vurderPaNyttArsakType.ANNET,
  isSet: approval.annet,
}].filter((arsak) => arsak.isSet)
  .map((arsak) => arsak.code)
);

const revurderingData = [fpsakApi.HAR_REVURDERING_SAMME_RESULTAT];
const ingenData = [];

const getOnSubmit = (erTilbakekreving, behandlingIdentifier, selectedBehandlingVersjon, setAllAksjonspunktApproved,
  setShowBeslutterModal, approveAp) => (values) => {
  const aksjonspunkter = values.approvals
    .map((context) => context.aksjonspunkter)
    .reduce((a, b) => a.concat(b));

  const aksjonspunktGodkjenningDtos = aksjonspunkter
    .map((toTrinnsAksjonspunkt) => ({
      aksjonspunktKode: toTrinnsAksjonspunkt.aksjonspunktKode,
      godkjent: toTrinnsAksjonspunkt.totrinnskontrollGodkjent,
      begrunnelse: toTrinnsAksjonspunkt.besluttersBegrunnelse,
      arsaker: getArsaker(toTrinnsAksjonspunkt),
    }));

  // TODO (TOR) Fjern hardkodinga av 5005
  const fatterVedtakAksjonspunktDto = {
    '@type': erTilbakekreving ? '5005' : aksjonspunktCodes.FATTER_VEDTAK,
    begrunnelse: null,
    aksjonspunktGodkjenningDtos,
  };
  const params = {
    ...behandlingIdentifier.toJson(),
    behandlingVersjon: selectedBehandlingVersjon,
    bekreftedeAksjonspunktDtoer: [fatterVedtakAksjonspunktDto],
  };
  setAllAksjonspunktApproved(aksjonspunkter.every((ap) => ap.totrinnskontrollGodkjent && ap.totrinnskontrollGodkjent === true));
  setShowBeslutterModal(true);
  return approveAp(params);
};

const NO_PARAM = {};

interface TotrinnsKlageVurdering {
  klageVurdering?: string;
  klageVurderingOmgjoer?: string;
  klageVurderingResultatNFP?: any;
  klageVurderingResultatNK?: any;
}

interface OwnProps {
  totrinnskontrollSkjermlenkeContext?: any[];
  totrinnskontrollReadOnlySkjermlenkeContext?: any[];
  approve: (params: any) => Promise<any>;
  previewMessage: (erTilbakekreving: boolean, erHenleggelse: boolean, data: any) => void;
  behandlingIdentifier: BehandlingIdentifier;
  selectedBehandlingVersjon?: number;
  ansvarligSaksbehandler?: string;
  behandlingStatus: Kodeverk;
  toTrinnsBehandling?: boolean;
  push: (location: string) => void;
  resetApproval: () => void;
  location: Location;
  erTilbakekreving: boolean;
  behandlingUuid: string;
  fagsakYtelseType: Kodeverk;
  alleKodeverk: {[key: string]: [KodeverkMedNavn]};
  erBehandlingEtterKlage?: boolean;
  isForeldrepenger: boolean;
  erGodkjenningFerdig?: boolean;
  behandlingsresultat?: any;
  behandlingId?: number;
  behandlingTypeKode?: string;
}

interface StateProps {
  showBeslutterModal: boolean;
  allAksjonspunktApproved?: boolean;
}

/**
 * ApprovalIndex
 *
 * Containerklass ansvarlig for att rita opp vilkår og aksjonspunkter med toTrinnskontroll
 */
const ApprovalIndex: FunctionComponent<OwnProps> = ({
  toTrinnsBehandling = false,
  erBehandlingEtterKlage = false,
  erGodkjenningFerdig = false,
  resetApproval,
  behandlingIdentifier,
  selectedBehandlingVersjon,
  approve: approveAp,
  erTilbakekreving,
  previewMessage: fetchPreview,
  fagsakYtelseType,
  behandlingUuid,
  push: pushLocation,
  totrinnskontrollSkjermlenkeContext,
  totrinnskontrollReadOnlySkjermlenkeContext,
  behandlingStatus,
  location,
  ansvarligSaksbehandler,
  alleKodeverk,
  isForeldrepenger,
  behandlingsresultat,
  behandlingId,
  behandlingTypeKode,
}) => {
  const [showBeslutterModal, setShowBeslutterModal] = useState(false);
  const [allAksjonspunktApproved, setAllAksjonspunktApproved] = useState(false);

  const skjermlenkeTyperFpsak = useFpSakKodeverk(kodeverkTyper.SKJERMLENKE_TYPE);
  const skjermlenkeTyperFptilbake = useFpTilbakeKodeverk(kodeverkTyper.SKJERMLENKE_TYPE);
  const skjemalenkeTyper = erTilbakekreving ? skjermlenkeTyperFptilbake : skjermlenkeTyperFpsak;

  const navAnsatt = useGlobalStateRestApiData<NavAnsatt>(FpsakApiKeys.NAV_ANSATT);
  const { brukernavn, kanVeilede } = navAnsatt;

  const featureToggles = useGlobalStateRestApiData<{[key: string]: boolean}>(FpsakApiKeys.FEATURE_TOGGLE);
  const disableGodkjennKnapp = erTilbakekreving ? !featureToggles[featureToggle.BESLUTT_TILBAKEKREVING] : false;

  const { data: totrinnsKlageVurdering, state: totrinnsKlageVurderingState } = useRestApi<TotrinnsKlageVurdering>(
    FpsakApiKeys.TOTRINNS_KLAGE_VURDERING, NO_PARAM, {
      keepData: true,
      updateTriggers: [behandlingIdentifier.behandlingId, selectedBehandlingVersjon],
      suspendRequest: !requestApi.hasPath(FpsakApiKeys.TOTRINNS_KLAGE_VURDERING),
    },
  );

  useEffect(() => () => {
    resetApproval();
  }, []);

  const forhandsvisVedtaksbrev = useCallback(() => {
    fetchPreview(erTilbakekreving, false, {
      behandlingUuid,
      ytelseType: fagsakYtelseType,
      gjelderVedtak: true,
    });
  }, []);
  const onSubmit = useCallback(getOnSubmit(erTilbakekreving, behandlingIdentifier, selectedBehandlingVersjon,
    setAllAksjonspunktApproved, setShowBeslutterModal, approveAp),
  [behandlingIdentifier.behandlingId, selectedBehandlingVersjon]);
  const goToSearchPage = useCallback(() => {
    pushLocation('/');
  }, []);

  const readOnly = brukernavn === ansvarligSaksbehandler || kanVeilede;

  if (!totrinnskontrollSkjermlenkeContext && !totrinnskontrollReadOnlySkjermlenkeContext) {
    return null;
  }

  if (totrinnsKlageVurderingState === RestApiState.LOADING) {
    return <LoadingPanel />;
  }

  return (
    <>
      <TotrinnskontrollSakIndex
        behandlingId={behandlingIdentifier.behandlingId}
        behandlingVersjon={selectedBehandlingVersjon}
        behandlingsresultat={behandlingsresultat}
        behandlingStatus={behandlingStatus}
        totrinnskontrollSkjermlenkeContext={totrinnskontrollSkjermlenkeContext}
        totrinnskontrollReadOnlySkjermlenkeContext={totrinnskontrollReadOnlySkjermlenkeContext}
        location={location}
        readOnly={readOnly}
        onSubmit={onSubmit}
        forhandsvisVedtaksbrev={forhandsvisVedtaksbrev}
        toTrinnsBehandling={toTrinnsBehandling}
        skjemalenkeTyper={skjemalenkeTyper}
        isForeldrepengerFagsak={isForeldrepenger}
        alleKodeverk={alleKodeverk}
        behandlingKlageVurdering={totrinnsKlageVurdering}
        erBehandlingEtterKlage={erBehandlingEtterKlage}
        disableGodkjennKnapp={disableGodkjennKnapp}
        erTilbakekreving={erTilbakekreving}
        createLocationForSkjermlenke={createLocationForSkjermlenke}
      />
      {showBeslutterModal && (
        <DataFetcher
          fetchingTriggers={new DataFetcherTriggers({
            behandlingId: behandlingIdentifier.behandlingId,
            behandlingVersion: selectedBehandlingVersjon,
          }, true)}
          key={revurderingData.some((rd) => rd.isEndpointEnabled()) ? 0 : 1}
          endpoints={revurderingData.some((rd) => rd.isEndpointEnabled()) ? revurderingData : ingenData}
          loadingPanel={<LoadingPanel />}
          render={(modalProps: { harRevurderingSammeResultat: boolean }) => (
            <FatterVedtakApprovalModalSakIndex
              showModal={showBeslutterModal}
              closeEvent={goToSearchPage}
              allAksjonspunktApproved={allAksjonspunktApproved}
              fagsakYtelseType={fagsakYtelseType}
              erGodkjenningFerdig={erGodkjenningFerdig}
              erKlageWithKA={totrinnsKlageVurdering ? !!totrinnsKlageVurdering.klageVurderingResultatNK : undefined}
              behandlingsresultat={behandlingsresultat}
              behandlingId={behandlingId}
              behandlingStatusKode={behandlingStatus.kode}
              behandlingTypeKode={behandlingTypeKode}
              harSammeResultatSomOriginalBehandling={modalProps.harRevurderingSammeResultat}
            />
          )}
        />
      )}
    </>
  );
};

const erArsakTypeBehandlingEtterKlage = createSelector([getBehandlingArsaker], (behandlingArsaker: { behandlingArsakType: Kodeverk}[] = []) => behandlingArsaker
  .map(({ behandlingArsakType }) => behandlingArsakType)
  .some((bt: Kodeverk) => bt.kode === klageBehandlingArsakType.ETTER_KLAGE || bt.kode === klageBehandlingArsakType.KLAGE_U_INNTK
    || bt.kode === klageBehandlingArsakType.KLAGE_M_INNTK));

const mapStateToPropsFactory = () => (state) => {
  const behandlingType = getBehandlingType(state);
  const behandlingTypeKode = behandlingType ? behandlingType.kode : undefined;
  const erTilbakekreving = BehandlingType.TILBAKEKREVING === behandlingTypeKode || BehandlingType.TILBAKEKREVING_REVURDERING === behandlingTypeKode;
  const behandlingIdentifier = getBehandlingIdentifier(state);
  return {
    selectedBehandlingVersjon: getBehandlingVersjon(state),
    ansvarligSaksbehandler: getBehandlingAnsvarligSaksbehandler(state),
    behandlingStatus: getBehandlingStatus(state),
    toTrinnsBehandling: getBehandlingToTrinnsBehandling(state),
    alleKodeverk: erTilbakekreving ? fpsakApi.KODEVERK_FPTILBAKE.getRestApiData()(state) : fpsakApi.KODEVERK.getRestApiData()(state),
    location: state.router.location,
    behandlingUuid: getBehandlingerUuidsMappedById(state)[behandlingIdentifier.behandlingId],
    fagsakYtelseType: getFagsakYtelseType(state),
    erGodkjenningFerdig: fpsakApi.SAVE_TOTRINNSAKSJONSPUNKT.getRestApiFinished()(state),
    isForeldrepenger: isForeldrepengerFagsak(state),
    erBehandlingEtterKlage: erArsakTypeBehandlingEtterKlage(state),
    behandlingsresultat: getBehandlingsresultat(state),
    behandlingId: getSelectedBehandlingId(state),
    behandlingIdentifier,
    erTilbakekreving,
    behandlingTypeKode,
  };
};

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    push,
    approve: fpsakApi.SAVE_TOTRINNSAKSJONSPUNKT.makeRestApiRequest(),
    resetApproval: fpsakApi.SAVE_TOTRINNSAKSJONSPUNKT.resetRestApi(),
    previewMessage,
  }, dispatch),
});

const comp = requireProps(['behandlingIdentifier', 'selectedBehandlingVersjon'])(ApprovalIndex);
export default withRouter(connect(mapStateToPropsFactory, mapDispatchToProps)(comp));

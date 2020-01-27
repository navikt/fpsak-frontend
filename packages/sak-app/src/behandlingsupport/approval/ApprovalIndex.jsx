import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { push } from 'connected-react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import vurderPaNyttArsakType from '@fpsak-frontend/kodeverk/src/vurderPaNyttArsakType';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import {
  DataFetcher, requireProps, featureToggle, BehandlingIdentifier,
} from '@fpsak-frontend/fp-felles';
import { navAnsattPropType, kodeverkObjektPropType } from '@fpsak-frontend/prop-types';
import TotrinnskontrollSakIndex, { FatterVedtakApprovalModalSakIndex } from '@fpsak-frontend/sak-totrinnskontroll';
import klageBehandlingArsakType from '@fpsak-frontend/kodeverk/src/behandlingArsakType';

import fpsakApi from '../../data/fpsakApi';
import { getFagsakYtelseType, isForeldrepengerFagsak } from '../../fagsak/fagsakSelectors';
import { getNavAnsatt, getFeatureToggles } from '../../app/duck';
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
import { getKodeverk, getFpTilbakeKodeverk } from '../../kodeverk/duck';

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

const klageData = [fpsakApi.TOTRINNS_KLAGE_VURDERING];
const revurderingData = [fpsakApi.HAR_REVURDERING_SAMME_RESULTAT];
const ingenData = [];

/**
 * ApprovalIndex
 *
 * Containerklass ansvarlig for att rita opp vilkår og aksjonspunkter med toTrinnskontroll
 */
export class ApprovalIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showBeslutterModal: false,
      allAksjonspunktApproved: undefined,
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.goToSearchPage = this.goToSearchPage.bind(this);
    this.forhandsvisVedtaksbrev = this.forhandsvisVedtaksbrev.bind(this);
  }

  componentWillUnmount() {
    const { resetApproval: reset } = this.props;
    reset();
  }

  onSubmit(values) {
    const {
      behandlingIdentifier,
      selectedBehandlingVersjon,
      approve: approveAp,
      erTilbakekreving,
    } = this.props;
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
    this.setAksjonspunktApproved(aksjonspunkter);
    this.setState({
      showBeslutterModal: true,
    });
    return approveAp(params);
  }

  setAksjonspunktApproved(toTrinnsAksjonspunkter) {
    this.setState({
      allAksjonspunktApproved: toTrinnsAksjonspunkter.every((ap) => ap.totrinnskontrollGodkjent && ap.totrinnskontrollGodkjent === true),
    });
  }

  forhandsvisVedtaksbrev() {
    const {
      previewMessage: fetchPreview, fagsakYtelseType, behandlingUuid, erTilbakekreving,
    } = this.props;
    fetchPreview(erTilbakekreving, {
      behandlingUuid,
      ytelseType: fagsakYtelseType,
      gjelderVedtak: true,
    });
  }

  goToSearchPage() {
    const { push: pushLocation } = this.props;
    pushLocation('/');
  }

  render() {
    const {
      totrinnskontrollSkjermlenkeContext, totrinnskontrollReadOnlySkjermlenkeContext, behandlingStatus,
      location, navAnsatt, ansvarligSaksbehandler, toTrinnsBehandling, skjemalenkeTyper,
      behandlingIdentifier, selectedBehandlingVersjon, alleKodeverk, erBehandlingEtterKlage,
      isForeldrepenger, disableGodkjennKnapp, fagsakYtelseType, erGodkjenningFerdig,
      behandlingsresultat, behandlingId, behandlingTypeKode, erTilbakekreving,
    } = this.props;
    const { showBeslutterModal, allAksjonspunktApproved } = this.state;
    const { brukernavn, kanVeilede } = navAnsatt;
    const readOnly = brukernavn === ansvarligSaksbehandler || kanVeilede;

    if (!totrinnskontrollSkjermlenkeContext && !totrinnskontrollReadOnlySkjermlenkeContext) {
      return null;
    }

    return (
      <DataFetcher
        behandlingId={behandlingIdentifier.behandlingId}
        behandlingVersjon={selectedBehandlingVersjon}
        endpoints={klageData.some((kd) => kd.isEndpointEnabled()) ? klageData : ingenData}
        render={(props) => (
          <>
            <TotrinnskontrollSakIndex
              behandlingId={behandlingIdentifier.behandlingId}
              behandlingVersjon={selectedBehandlingVersjon}
              behandlingStatus={behandlingStatus}
              totrinnskontrollSkjermlenkeContext={totrinnskontrollSkjermlenkeContext}
              totrinnskontrollReadOnlySkjermlenkeContext={totrinnskontrollReadOnlySkjermlenkeContext}
              location={location}
              readOnly={readOnly}
              onSubmit={this.onSubmit}
              forhandsvisVedtaksbrev={this.forhandsvisVedtaksbrev}
              toTrinnsBehandling={toTrinnsBehandling}
              skjemalenkeTyper={skjemalenkeTyper}
              isForeldrepengerFagsak={isForeldrepenger}
              alleKodeverk={alleKodeverk}
              behandlingKlageVurdering={props.totrinnsKlageVurdering}
              erBehandlingEtterKlage={erBehandlingEtterKlage}
              disableGodkjennKnapp={disableGodkjennKnapp}
              erTilbakekreving={erTilbakekreving}
            />
            {showBeslutterModal && (
              <DataFetcher
                behandlingId={behandlingIdentifier.behandlingId}
                behandlingVersjon={selectedBehandlingVersjon}
                endpoints={revurderingData.some((rd) => rd.isEndpointEnabled()) ? revurderingData : ingenData}
                render={(modalProps) => (
                  <FatterVedtakApprovalModalSakIndex
                    showModal={showBeslutterModal}
                    closeEvent={this.goToSearchPage}
                    allAksjonspunktApproved={allAksjonspunktApproved}
                    fagsakYtelseType={fagsakYtelseType}
                    erGodkjenningFerdig={erGodkjenningFerdig}
                    erKlageWithKA={props.totrinnsKlageVurdering ? !!props.totrinnsKlageVurdering.klageVurderingResultatNK : undefined}
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
        )}
      />
    );
  }
}

ApprovalIndex.propTypes = {
  totrinnskontrollSkjermlenkeContext: PropTypes.arrayOf(PropTypes.shape()),
  totrinnskontrollReadOnlySkjermlenkeContext: PropTypes.arrayOf(PropTypes.shape()),
  approve: PropTypes.func.isRequired,
  previewMessage: PropTypes.func.isRequired,
  behandlingIdentifier: PropTypes.instanceOf(BehandlingIdentifier).isRequired,
  selectedBehandlingVersjon: PropTypes.number,
  ansvarligSaksbehandler: PropTypes.string,
  behandlingStatus: PropTypes.shape().isRequired,
  toTrinnsBehandling: PropTypes.bool,
  push: PropTypes.func.isRequired,
  resetApproval: PropTypes.func.isRequired,
  location: PropTypes.shape().isRequired,
  navAnsatt: navAnsattPropType.isRequired,
  skjemalenkeTyper: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  erTilbakekreving: PropTypes.bool.isRequired,
  behandlingUuid: PropTypes.string.isRequired,
  fagsakYtelseType: kodeverkObjektPropType.isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  erBehandlingEtterKlage: PropTypes.bool,
  isForeldrepenger: PropTypes.bool.isRequired,
  disableGodkjennKnapp: PropTypes.bool.isRequired,
  erGodkjenningFerdig: PropTypes.bool,
  behandlingsresultat: PropTypes.shape(),
  behandlingId: PropTypes.number,
  behandlingTypeKode: PropTypes.string,
};

ApprovalIndex.defaultProps = {
  ansvarligSaksbehandler: undefined,
  totrinnskontrollSkjermlenkeContext: undefined,
  totrinnskontrollReadOnlySkjermlenkeContext: undefined,
  toTrinnsBehandling: false,
  selectedBehandlingVersjon: undefined,
  erBehandlingEtterKlage: false,
  erGodkjenningFerdig: false,
  behandlingId: undefined,
  behandlingTypeKode: undefined,
};

const erArsakTypeBehandlingEtterKlage = createSelector([getBehandlingArsaker], (behandlingArsaker = []) => behandlingArsaker
  .map(({ behandlingArsakType }) => behandlingArsakType)
  .some((bt) => bt.kode === klageBehandlingArsakType.ETTER_KLAGE || bt.kode === klageBehandlingArsakType.KLAGE_U_INNTK
    || bt.kode === klageBehandlingArsakType.KLAGE_M_INNTK));

const mapStateToPropsFactory = (initialState) => {
  const skjermlenkeTyperFpsak = getKodeverk(kodeverkTyper.SKJERMLENKE_TYPE)(initialState);
  const skjermlenkeTyperFptilbake = getFpTilbakeKodeverk(kodeverkTyper.SKJERMLENKE_TYPE)(initialState);
  return (state) => {
    const behandlingType = getBehandlingType(state);
    const behandlingTypeKode = behandlingType ? behandlingType.kode : undefined;
    const erTilbakekreving = BehandlingType.TILBAKEKREVING === behandlingTypeKode || BehandlingType.TILBAKEKREVING_REVURDERING === behandlingTypeKode;
    const behandlingIdentifier = getBehandlingIdentifier(state);
    return {
      totrinnskontrollSkjermlenkeContext: fpsakApi.TOTRINNSAKSJONSPUNKT_ARSAKER.getRestApiData()(state),
      totrinnskontrollReadOnlySkjermlenkeContext: fpsakApi.TOTRINNSAKSJONSPUNKT_ARSAKER_READONLY.getRestApiData()(state),
      selectedBehandlingVersjon: getBehandlingVersjon(state),
      ansvarligSaksbehandler: getBehandlingAnsvarligSaksbehandler(state),
      behandlingStatus: getBehandlingStatus(state),
      toTrinnsBehandling: getBehandlingToTrinnsBehandling(state),
      navAnsatt: getNavAnsatt(state),
      alleKodeverk: erTilbakekreving ? fpsakApi.KODEVERK_FPTILBAKE.getRestApiData()(state) : fpsakApi.KODEVERK.getRestApiData()(state),
      skjemalenkeTyper: erTilbakekreving ? skjermlenkeTyperFptilbake : skjermlenkeTyperFpsak,
      location: state.router.location,
      behandlingUuid: getBehandlingerUuidsMappedById(state)[behandlingIdentifier.behandlingId],
      fagsakYtelseType: getFagsakYtelseType(state),
      erGodkjenningFerdig: fpsakApi.SAVE_TOTRINNSAKSJONSPUNKT.getRestApiFinished()(state),
      isForeldrepenger: isForeldrepengerFagsak(state),
      erBehandlingEtterKlage: erArsakTypeBehandlingEtterKlage(state),
      behandlingsresultat: getBehandlingsresultat(state),
      behandlingId: getSelectedBehandlingId(state),
      disableGodkjennKnapp: erTilbakekreving ? !getFeatureToggles(state)[featureToggle.BESLUTT_TILBAKEKREVING] : false,
      behandlingIdentifier,
      erTilbakekreving,
      behandlingTypeKode,
    };
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

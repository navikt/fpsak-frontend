import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setSubmitFailed as dispatchSubmitFailed } from 'redux-form';

import { kodeverkObjektPropType, aksjonspunktPropType } from '@fpsak-frontend/prop-types';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { CommonBehandlingsprosessIndex } from '@fpsak-frontend/fp-behandling-felles';

import { BehandlingIdentifier, behandlingspunktCodes, trackRouteParam } from '@fpsak-frontend/fp-felles';

import { getBehandlingIdentifier, getFagsakYtelseType } from '../duckBehandlingForstegangOgRev';
import statusIconsBeregningsgrunnlag from './statusIconsBeregningsgrunnlag';
import statusIconsUttak from './statusIconsUttak';
import IverksetterVedtakStatusModal from './components/IverksetterVedtakStatusModal';
import statusIconsAvregning from './statusIconsAvregning';
import behandlingSelectors from '../selectors/forsteOgRevBehandlingSelectors';
import {
  fetchPreviewBrev,
  getResolveProsessAksjonspunkterSuccess,
  overrideProsessAksjonspunkter,
  resetBehandlingspunkter,
  resolveProsessAksjonspunkter,
  fetchFptilbakePreviewBrev as fetchFptilbakePreview,
  getSelectedBehandlingspunktNavn,
  setSelectedBehandlingspunktNavn,
} from './duckBpForstegangOgRev';
import behandlingspunktSelectors from './selectors/behandlingsprosessForstegangOgRevSelectors';
import BehandlingspunktInfoPanel from './components/BehandlingspunktInfoPanel';

const hasRevurderingAp = (apModels) => (
  apModels.some((apValue) => (
    (apValue.kode === aksjonspunktCodes.VARSEL_REVURDERING_MANUELL || apValue.kode === aksjonspunktCodes.VARSEL_REVURDERING_ETTERKONTROLL) && apValue.sendVarsel
  ))
);

const additionalBehandlingspunktImages = {
  [behandlingspunktCodes.BEREGNINGSGRUNNLAG]: statusIconsBeregningsgrunnlag,
  [behandlingspunktCodes.UTTAK]: statusIconsUttak,
  [behandlingspunktCodes.AVREGNING]: statusIconsAvregning,
};

/**
 * BehandlingsprosessForstegangOgRevIndex
 *
 * Har ansvar for behandlingsprosessdelen av hovedvinduet når behandlingstypen er Førstegangsbehandling eller Revurdering.
 */
export class BehandlingsprosessForstegangOgRevIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showIverksetterVedtakModal: false,
    };
  }

  previewFptilbakeCallback = (mottaker, brevmalkode, fritekst, saksnummer) => {
    const { behandlingUuid, fagsakYtelseType, fetchFptilbakePreview: fetchBrevPreview } = this.props;
    const data = {
      behandlingUuid,
      fagsakYtelseType,
      varseltekst: fritekst || '',
      mottaker,
      brevmalkode,
      saksnummer,
    };
    fetchBrevPreview(data);
  }

  submit = (aksjonspunktModels) => {
    const submitIsRevurdering = hasRevurderingAp(aksjonspunktModels);
    const shouldUpdateInfo = !submitIsRevurdering;

    const afterAksjonspunktSubmit = () => {
      const showModal = aksjonspunktModels[0].isVedtakSubmission && aksjonspunktModels[0].kode === aksjonspunktCodes.FATTER_VEDTAK;
      if (showModal) {
        this.setState((prevState) => ({ ...prevState, showIverksetterVedtakModal: true }));
      } else if (submitIsRevurdering) {
        this.goToSearchPage();
      } else {
        this.goToDefaultPage();
      }
    };

    return this.submitCallback(aksjonspunktModels, afterAksjonspunktSubmit, shouldUpdateInfo);
  }

  getSubmit = (submitCallback, goToDefaultPage, goToSearchPage) => {
    this.submitCallback = submitCallback;
    this.goToDefaultPage = goToDefaultPage;
    this.goToSearchPage = goToSearchPage;
    return this.submit;
  }

  render = () => {
    const {
      selectedBehandlingspunkt, aksjonspunkter, aksjonspunkterOpenStatus, behandlingIdentifier, behandlingspunkter,
      resolveProsessAksjonspunkterSuccess, behandlingspunkterStatus, behandlingspunkterTitleCodes, behandlingsresultat,
      behandlingStatus, behandlingType, behandlingVersjon, fagsakYtelseType, isSelectedBehandlingHenlagt,
      location, dispatchSubmitFailed: submitFailedDispatch, behandlingUuid,
    } = this.props;
    const {
      showIverksetterVedtakModal,
    } = this.state;

    return (
      <CommonBehandlingsprosessIndex
        aksjonspunkter={aksjonspunkter}
        aksjonspunkterOpenStatus={aksjonspunkterOpenStatus}
        behandlingUuid={behandlingUuid}
        behandlingIdentifier={behandlingIdentifier}
        behandlingspunkter={behandlingspunkter}
        selectedBehandlingspunkt={selectedBehandlingspunkt}
        behandlingspunkterStatus={behandlingspunkterStatus}
        behandlingspunkterTitleCodes={behandlingspunkterTitleCodes}
        behandlingsresultat={behandlingsresultat}
        behandlingStatus={behandlingStatus}
        behandlingType={behandlingType}
        behandlingVersjon={behandlingVersjon}
        fagsakYtelseType={fagsakYtelseType}
        fetchPreviewBrev={fetchPreviewBrev}
        isSelectedBehandlingHenlagt={isSelectedBehandlingHenlagt}
        location={location}
        resetBehandlingspunkter={resetBehandlingspunkter}
        resolveProsessAksjonspunkter={resolveProsessAksjonspunkter}
        resolveProsessAksjonspunkterSuccess={resolveProsessAksjonspunkterSuccess}
        additionalBehandlingspunktImages={additionalBehandlingspunktImages}
        overrideProsessAksjonspunkter={overrideProsessAksjonspunkter}
        doNotUseIverksetterVedtakModal
        render={(previewCallback, submitCallback, goToDefaultPage, goToSearchPage) => (
          <>
            <BehandlingspunktInfoPanel
              submitCallback={this.getSubmit(submitCallback, goToDefaultPage, goToSearchPage)}
              previewCallback={previewCallback}
              previewFptilbakeCallback={this.previewFptilbakeCallback}
              dispatchSubmitFailed={submitFailedDispatch}
              selectedBehandlingspunkt={selectedBehandlingspunkt}
            />
            <IverksetterVedtakStatusModal
              closeEvent={goToSearchPage}
              isVedtakSubmission={showIverksetterVedtakModal}
            />
          </>
        )}
      />
    );
  }
}

BehandlingsprosessForstegangOgRevIndex.propTypes = {
  behandlingUuid: PropTypes.string.isRequired,
  behandlingIdentifier: PropTypes.instanceOf(BehandlingIdentifier).isRequired,
  selectedBehandlingspunkt: PropTypes.string,
  dispatchSubmitFailed: PropTypes.func.isRequired,
  fetchFptilbakePreview: PropTypes.func.isRequired,
  aksjonspunkter: PropTypes.arrayOf(aksjonspunktPropType).isRequired,
  aksjonspunkterOpenStatus: PropTypes.shape(),
  behandlingspunkter: PropTypes.arrayOf(PropTypes.string),
  behandlingspunkterStatus: PropTypes.shape(),
  behandlingspunkterTitleCodes: PropTypes.shape(),
  behandlingsresultat: PropTypes.shape(),
  behandlingStatus: kodeverkObjektPropType.isRequired,
  behandlingType: kodeverkObjektPropType.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  fagsakYtelseType: kodeverkObjektPropType.isRequired,
  isSelectedBehandlingHenlagt: PropTypes.bool.isRequired,
  location: PropTypes.shape().isRequired,
  resolveProsessAksjonspunkterSuccess: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  behandlingUuid: behandlingSelectors.getBehandlingUuid(state),
  behandlingIdentifier: getBehandlingIdentifier(state),
  fagsakYtelseType: getFagsakYtelseType(state),
  isSelectedBehandlingHenlagt: behandlingSelectors.getBehandlingHenlagt(state),
  behandlingVersjon: behandlingSelectors.getBehandlingVersjon(state),
  behandlingspunkter: behandlingspunktSelectors.getBehandlingspunkter(state),
  selectedBehandlingspunkt: behandlingspunktSelectors.getSelectedBehandlingspunkt(state),
  resolveProsessAksjonspunkterSuccess: getResolveProsessAksjonspunkterSuccess(state),
  behandlingStatus: behandlingSelectors.getBehandlingStatus(state),
  behandlingsresultat: behandlingSelectors.getBehandlingsresultat(state),
  behandlingType: behandlingSelectors.getBehandlingType(state),
  aksjonspunkter: behandlingSelectors.getAksjonspunkter(state),
  behandlingspunkterStatus: behandlingspunktSelectors.getBehandlingspunkterStatus(state),
  behandlingspunkterTitleCodes: behandlingspunktSelectors.getBehandlingspunkterTitleCodes(state),
  aksjonspunkterOpenStatus: behandlingspunktSelectors.getAksjonspunkterOpenStatus(state),
  location: state.router.location,
});

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    dispatchSubmitFailed,
    fetchFptilbakePreview,
  }, dispatch),
});

const TrackRouteParamBehandlingsprosessIndex = trackRouteParam({
  paramName: 'punkt',
  paramPropType: PropTypes.string,
  storeParam: setSelectedBehandlingspunktNavn,
  getParamFromStore: getSelectedBehandlingspunktNavn,
  isQueryParam: true,
})(connect(mapStateToProps, mapDispatchToProps)(BehandlingsprosessForstegangOgRevIndex));

export default TrackRouteParamBehandlingsprosessIndex;

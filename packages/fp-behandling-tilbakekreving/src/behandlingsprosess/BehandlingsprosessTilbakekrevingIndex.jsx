import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setSubmitFailed as dispatchSubmitFailed } from 'redux-form';

import { CommonBehandlingsprosessIndex } from '@fpsak-frontend/fp-behandling-felles';
import { BehandlingIdentifier, trackRouteParam } from '@fpsak-frontend/fp-felles';
import { aksjonspunktPropType, kodeverkObjektPropType } from '@fpsak-frontend/prop-types';

import { getBehandlingIdentifier, getFagsakYtelseType } from 'behandlingTilbakekreving/src/duckBehandlingTilbakekreving';
import behandlingSelectors from '../selectors/tilbakekrevingBehandlingSelectors';
import {
  getResolveProsessAksjonspunkterSuccess, resetBehandlingspunkter, resolveProsessAksjonspunkter,
  setSelectedBehandlingspunktNavn, getSelectedBehandlingspunktNavn,
} from './duckBpTilbake';
import behandlingspunktTilbakekrevingSelectors from './selectors/behandlingsprosessTilbakeSelectors';
import tilbakekrevingAksjonspunktCodes from '../kodeverk/tilbakekrevingAksjonspunktCodes';
import TilbakekrevingBehandlingspunktInfoPanel from './components/TilbakekrevingBehandlingspunktInfoPanel';
import FatterTilbakekrevingVedtakStatusModal from './components/FatterTilbakekrevingVedtakStatusModal';

/**
 * BehandlingsprosessTilbakekrevingIndex
 *
 * Har ansvar for behandlingsprosessdelen av hovedvinduet når behandlingstypen er Tilbakekreving.
 */
export class BehandlingsprosessTilbakekrevingIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showFatterVedtakModal: false,
    };
  }

  submit = (submitCallback, goToDefaultPage) => (aksjonspunktModels) => {
    const afterAksjonspunktSubmit = () => {
      const isFatterVedtakAp = aksjonspunktModels.some((ap) => ap.kode === tilbakekrevingAksjonspunktCodes.FORESLA_VEDTAK);
      if (isFatterVedtakAp) {
        this.setState((prevState) => ({ ...prevState, showFatterVedtakModal: true }));
      } else {
        goToDefaultPage();
      }
    };

    return submitCallback(aksjonspunktModels, afterAksjonspunktSubmit, true);
  }

  render = () => {
    const {
      selectedBehandlingspunkt, aksjonspunkter, aksjonspunkterOpenStatus, behandlingIdentifier, behandlingspunkter,
      resolveProsessAksjonspunkterSuccess, behandlingspunkterStatus, behandlingspunkterTitleCodes, behandlingsresultat,
      behandlingStatus, behandlingType, behandlingVersjon, fagsakYtelseType, isSelectedBehandlingHenlagt,
      location, dispatchSubmitFailed: submitFailedDispatch, behandlingUuid,
    } = this.props;
    const { showFatterVedtakModal } = this.state;

    return (
      <CommonBehandlingsprosessIndex
        behandlingUuid={behandlingUuid}
        aksjonspunkter={aksjonspunkter}
        aksjonspunkterOpenStatus={aksjonspunkterOpenStatus}
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
        isSelectedBehandlingHenlagt={isSelectedBehandlingHenlagt}
        location={location}
        resetBehandlingspunkter={resetBehandlingspunkter}
        resolveProsessAksjonspunkter={resolveProsessAksjonspunkter}
        resolveProsessAksjonspunkterSuccess={resolveProsessAksjonspunkterSuccess}
        doNotUseFatterVedtakModal
        render={(previewCallback, submitCallback, goToDefaultPage, goToSearchPage) => (
          <>
            <TilbakekrevingBehandlingspunktInfoPanel
              submitCallback={this.submit(submitCallback, goToDefaultPage)}
              dispatchSubmitFailed={submitFailedDispatch}
              selectedBehandlingspunkt={selectedBehandlingspunkt}
            />
            <FatterTilbakekrevingVedtakStatusModal closeEvent={goToSearchPage} showModal={showFatterVedtakModal} />
          </>
        )}
      />
    );
  }
}

BehandlingsprosessTilbakekrevingIndex.propTypes = {
  behandlingUuid: PropTypes.string.isRequired,
  aksjonspunkter: PropTypes.arrayOf(aksjonspunktPropType).isRequired,
  aksjonspunkterOpenStatus: PropTypes.shape(),
  behandlingIdentifier: PropTypes.instanceOf(BehandlingIdentifier).isRequired,
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
  selectedBehandlingspunkt: PropTypes.string,
  dispatchSubmitFailed: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  behandlingUuid: behandlingSelectors.getBehandlingUuid(state),
  fagsakYtelseType: getFagsakYtelseType(state),
  isSelectedBehandlingHenlagt: behandlingSelectors.getBehandlingHenlagt(state),
  behandlingIdentifier: getBehandlingIdentifier(state),
  behandlingVersjon: behandlingSelectors.getBehandlingVersjon(state),
  behandlingspunkter: behandlingspunktTilbakekrevingSelectors.getBehandlingspunkter(state),
  selectedBehandlingspunkt: behandlingspunktTilbakekrevingSelectors.getSelectedBehandlingspunkt(state),
  resolveProsessAksjonspunkterSuccess: getResolveProsessAksjonspunkterSuccess(state),
  behandlingStatus: behandlingSelectors.getBehandlingStatus(state),
  behandlingsresultat: behandlingSelectors.getBehandlingsresultat(state),
  behandlingType: behandlingSelectors.getBehandlingType(state),
  aksjonspunkter: behandlingSelectors.getAksjonspunkter(state),
  behandlingspunkterStatus: behandlingspunktTilbakekrevingSelectors.getBehandlingspunkterStatus(state),
  behandlingspunkterTitleCodes: behandlingspunktTilbakekrevingSelectors.getBehandlingspunkterTitleCodes(state),
  aksjonspunkterOpenStatus: behandlingspunktTilbakekrevingSelectors.getAksjonspunkterOpenStatus(state),
  location: state.router.location,
});

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    dispatchSubmitFailed,
  }, dispatch),
});

const TrackRouteParamBehandlingsprosessIndex = trackRouteParam({
  paramName: 'punkt',
  paramPropType: PropTypes.string,
  storeParam: setSelectedBehandlingspunktNavn,
  getParamFromStore: getSelectedBehandlingspunktNavn,
  isQueryParam: true,
})(connect(mapStateToProps, mapDispatchToProps)(BehandlingsprosessTilbakekrevingIndex));

export default TrackRouteParamBehandlingsprosessIndex;

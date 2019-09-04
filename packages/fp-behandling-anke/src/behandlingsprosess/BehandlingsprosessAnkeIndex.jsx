import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { aksjonspunktPropType, kodeverkObjektPropType } from '@fpsak-frontend/prop-types';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { BehandlingIdentifier, trackRouteParam } from '@fpsak-frontend/fp-felles';
import { CommonBehandlingsprosessIndex } from '@fpsak-frontend/fp-behandling-felles';

import { getBehandlingIdentifier, getFagsakYtelseType } from 'behandlingAnke/src/duckBehandlingAnke';
import behandlingSelectors from '../selectors/ankeBehandlingSelectors';
import behandlingspunktAnkeSelectors from './selectors/behandlingsprosessAnkeSelectors';
import {
  getSelectedBehandlingspunktNavn, resolveAnkeTemp, saveAnke, setSelectedBehandlingspunktNavn,
  fetchPreviewAnkeBrev, getResolveProsessAksjonspunkterSuccess, resetBehandlingspunkter, resolveProsessAksjonspunkter,
} from './duckBpAnke';

import AnkeBehandlingModal from './components/AnkeBehandlingModal';
import BehandlingspunktAnkeInfoPanel from './components/BehandlingspunktAnkeInfoPanel';

/**
 * BehandlingsprosessAnkeIndex
 *
 * Har ansvar for behandlingsprosessdelen av hovedvinduet når behandlingstypen er Anke.
 */
export class BehandlingsprosessAnkeIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModalAnkeBehandling: false,
    };
  }

  saveAnkeText = (aksjonspunktModel, shouldReopenAp) => {
    const { behandlingIdentifier, saveAnke: saveTempAnke, resolveAnkeTemp: resolveAnke } = this.props;
    const data = {
      behandlingId: behandlingIdentifier.behandlingId,
      ...aksjonspunktModel,
    };
    if (shouldReopenAp) {
      resolveAnke(behandlingIdentifier, data);
    } else {
      saveTempAnke(data);
    }
  }

  submit = (submitCallback, goToDefaultPage) => (aksjonspunktModels) => {
    const skalTilMedunderskriver = aksjonspunktModels
      .some((apValue) => apValue.kode === aksjonspunktCodes.FORESLA_VEDTAK);
    const skalFerdigstilles = aksjonspunktModels
      .some((apValue) => apValue.kode === aksjonspunktCodes.VEDTAK_UTEN_TOTRINNSKONTROLL);
    const shouldUpdateInfo = !skalTilMedunderskriver;

    const afterAksjonspunktSubmit = () => {
      if (skalTilMedunderskriver || skalFerdigstilles) {
        this.setState((state) => ({ ...state, showModalAnkeBehandling: true }));
      } else {
        goToDefaultPage();
      }
    };

    return submitCallback(aksjonspunktModels, afterAksjonspunktSubmit, shouldUpdateInfo);
  }

  render = () => {
    const {
      selectedBehandlingspunkt, aksjonspunkter, aksjonspunkterOpenStatus, behandlingIdentifier, behandlingspunkter,
      resolveProsessAksjonspunkterSuccess, behandlingspunkterStatus, behandlingspunkterTitleCodes, behandlingsresultat,
      behandlingStatus, behandlingType, behandlingVersjon, fagsakYtelseType, fetchPreviewBrev, isSelectedBehandlingHenlagt,
      location,
    } = this.props;
    const { showModalAnkeBehandling } = this.state;

    return (
      <CommonBehandlingsprosessIndex
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
        fetchPreviewBrev={fetchPreviewBrev}
        isSelectedBehandlingHenlagt={isSelectedBehandlingHenlagt}
        location={location}
        resetBehandlingspunkter={resetBehandlingspunkter}
        resolveProsessAksjonspunkter={resolveProsessAksjonspunkter}
        resolveProsessAksjonspunkterSuccess={resolveProsessAksjonspunkterSuccess}
        doNotUseFatterVedtakModal
        render={(previewCallback, submitCallback, goToDefaultPage, goToSearchPage) => (
          <>
            <BehandlingspunktAnkeInfoPanel
              previewCallback={previewCallback}
              previewCallbackAnke={previewCallback}
              saveTempAnke={this.saveAnkeText}
              submitCallback={this.submit(submitCallback, goToDefaultPage)}
              selectedBehandlingspunkt={selectedBehandlingspunkt}
            />
            <AnkeBehandlingModal showModal={showModalAnkeBehandling} closeEvent={goToSearchPage} />
          </>
        )}
      />
    );
  }
}

BehandlingsprosessAnkeIndex.propTypes = {
  behandlingIdentifier: PropTypes.instanceOf(BehandlingIdentifier).isRequired,
  saveAnke: PropTypes.func.isRequired,
  resolveAnkeTemp: PropTypes.func.isRequired,
  selectedBehandlingspunkt: PropTypes.string,
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
  fetchPreviewBrev: PropTypes.func.isRequired,
  isSelectedBehandlingHenlagt: PropTypes.bool.isRequired,
  location: PropTypes.shape().isRequired,
  resolveProsessAksjonspunkterSuccess: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  behandlingIdentifier: getBehandlingIdentifier(state),
  fagsakYtelseType: getFagsakYtelseType(state),
  isSelectedBehandlingHenlagt: behandlingSelectors.getBehandlingHenlagt(state),
  behandlingVersjon: behandlingSelectors.getBehandlingVersjon(state),
  behandlingspunkter: behandlingspunktAnkeSelectors.getBehandlingspunkter(state),
  selectedBehandlingspunkt: behandlingspunktAnkeSelectors.getSelectedBehandlingspunkt(state),
  resolveProsessAksjonspunkterSuccess: getResolveProsessAksjonspunkterSuccess(state),
  behandlingStatus: behandlingSelectors.getBehandlingStatus(state),
  behandlingsresultat: behandlingSelectors.getBehandlingsresultat(state),
  behandlingType: behandlingSelectors.getBehandlingType(state),
  aksjonspunkter: behandlingSelectors.getAksjonspunkter(state),
  behandlingspunkterStatus: behandlingspunktAnkeSelectors.getBehandlingspunkterStatus(state),
  behandlingspunkterTitleCodes: behandlingspunktAnkeSelectors.getBehandlingspunkterTitleCodes(state),
  aksjonspunkterOpenStatus: behandlingspunktAnkeSelectors.getAksjonspunkterOpenStatus(state),
  location: state.router.location,
  fetchPreviewBrev: fetchPreviewAnkeBrev,
  resolveProsessAksjonspunkter,
});

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    saveAnke,
    resolveAnkeTemp,
  }, dispatch),
});

const TrackRouteParamBehandlingsprosessIndex = trackRouteParam({
  paramName: 'punkt',
  paramPropType: PropTypes.string,
  storeParam: setSelectedBehandlingspunktNavn,
  getParamFromStore: getSelectedBehandlingspunktNavn,
  isQueryParam: true,
})(connect(mapStateToProps, mapDispatchToProps)(BehandlingsprosessAnkeIndex));

export default TrackRouteParamBehandlingsprosessIndex;

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { CommonBehandlingsprosessIndex } from '@fpsak-frontend/fp-behandling-felles';
import { BehandlingIdentifier, trackRouteParam } from '@fpsak-frontend/fp-felles';
import { aksjonspunktPropType, kodeverkObjektPropType } from '@fpsak-frontend/prop-types';

import { getBehandlingIdentifier, getFagsakYtelseType } from 'behandlingInnsyn/src/duckBehandlingInnsyn';
import behandlingSelectors from '../selectors/innsynBehandlingSelectors';
import {
  fetchPreviewBrev as fetchPreview,
  getResolveProsessAksjonspunkterSuccess,
  resetBehandlingspunkter,
  resolveProsessAksjonspunkter,
  getSelectedBehandlingspunktNavn,
  setSelectedBehandlingspunktNavn,
} from './duckBpInnsyn';
import behandlingspunktInnsynSelectors from './selectors/behandlingsprosessInnsynSelectors';
import BehandlingspunktInnsynInfoPanel from './components/BehandlingspunktInnsynInfoPanel';

/**
 * BehandlingsprosessInnsynIndex
 *
 * Har ansvar for behandlingsprosessdelen av hovedvinduet når behandlingstypen er Innsyn.
 */
export class BehandlingsprosessInnsynIndex extends Component {
  submit = (submitCallback, goToDefaultPage) => (aksjonspunktModels) => {
    const afterAksjonspunktSubmit = () => {
      goToDefaultPage();
    };

    return submitCallback(aksjonspunktModels, afterAksjonspunktSubmit, true);
  };

  render = () => {
    const {
      selectedBehandlingspunkt, aksjonspunkter, aksjonspunkterOpenStatus, behandlingIdentifier, behandlingspunkter,
      resolveProsessAksjonspunkterSuccess, behandlingspunkterStatus, behandlingspunkterTitleCodes, behandlingsresultat,
      behandlingStatus, behandlingType, behandlingVersjon, fagsakYtelseType, fetchPreviewBrev, isSelectedBehandlingHenlagt,
      location, behandlingUuid,
    } = this.props;

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
        doNotUseFatterVedtakModal
        render={(previewCallback, submitCallback, goToDefaultPage) => (
          <BehandlingspunktInnsynInfoPanel
            submitCallback={this.submit(submitCallback, goToDefaultPage)}
            previewCallback={previewCallback}
            selectedBehandlingspunkt={selectedBehandlingspunkt}
          />
        )}
      />
    );
  }
}

BehandlingsprosessInnsynIndex.propTypes = {
  behandlingUuid: PropTypes.string.isRequired,
  behandlingIdentifier: PropTypes.instanceOf(BehandlingIdentifier).isRequired,
  fagsakYtelseType: kodeverkObjektPropType.isRequired,
  isSelectedBehandlingHenlagt: PropTypes.bool.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  behandlingspunkter: PropTypes.arrayOf(PropTypes.string),
  selectedBehandlingspunkt: PropTypes.string,
  resolveProsessAksjonspunkterSuccess: PropTypes.bool.isRequired,
  behandlingStatus: kodeverkObjektPropType.isRequired,
  behandlingsresultat: PropTypes.shape(),
  behandlingspunkterStatus: PropTypes.shape(),
  behandlingspunkterTitleCodes: PropTypes.shape(),
  aksjonspunkterOpenStatus: PropTypes.shape(),
  location: PropTypes.shape().isRequired,
  fetchPreviewBrev: PropTypes.func.isRequired,
  behandlingType: kodeverkObjektPropType.isRequired,
  aksjonspunkter: PropTypes.arrayOf(aksjonspunktPropType).isRequired,
};

const mapStateToProps = (state) => ({
  behandlingUuid: behandlingSelectors.getBehandlingUuid(state),
  fagsakYtelseType: getFagsakYtelseType(state),
  isSelectedBehandlingHenlagt: behandlingSelectors.getBehandlingHenlagt(state),
  behandlingIdentifier: getBehandlingIdentifier(state),
  behandlingVersjon: behandlingSelectors.getBehandlingVersjon(state),
  behandlingspunkter: behandlingspunktInnsynSelectors.getBehandlingspunkter(state),
  selectedBehandlingspunkt: behandlingspunktInnsynSelectors.getSelectedBehandlingspunkt(state),
  resolveProsessAksjonspunkterSuccess: getResolveProsessAksjonspunkterSuccess(state),
  behandlingStatus: behandlingSelectors.getBehandlingStatus(state),
  behandlingsresultat: behandlingSelectors.getBehandlingsresultat(state),
  behandlingType: behandlingSelectors.getBehandlingType(state),
  aksjonspunkter: behandlingSelectors.getAksjonspunkter(state),
  behandlingspunkterStatus: behandlingspunktInnsynSelectors.getBehandlingspunkterStatus(state),
  behandlingspunkterTitleCodes: behandlingspunktInnsynSelectors.getBehandlingspunkterTitleCodes(state),
  aksjonspunkterOpenStatus: behandlingspunktInnsynSelectors.getAksjonspunkterOpenStatus(state),
  fetchPreviewBrev: fetchPreview,
  location: state.router.location,
});

const TrackRouteParamBehandlingsprosessIndex = trackRouteParam({
  paramName: 'punkt',
  paramPropType: PropTypes.string,
  storeParam: setSelectedBehandlingspunktNavn,
  getParamFromStore: getSelectedBehandlingspunktNavn,
  isQueryParam: true,
})(connect(mapStateToProps)(BehandlingsprosessInnsynIndex));

export default TrackRouteParamBehandlingsprosessIndex;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { withBehandlingsprosessIndex } from '@fpsak-frontend/fp-behandling-felles';
import { BehandlingIdentifier } from '@fpsak-frontend/fp-felles';

import { getBehandlingIdentifier } from 'behandlingAnke/src/duckBehandlingAnke';
import {
  getSelectedBehandlingspunktNavn, resolveAnkeTemp, saveAnke, setSelectedBehandlingspunktNavn,
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

  submit = (aksjonspunktModels) => {
    const { submitCallback, goToDefaultPage } = this.props;

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
    const { previewCallback, selectedBehandlingspunkt, goToSearchPage } = this.props;
    const { showModalAnkeBehandling } = this.state;

    return (
      <>
        <BehandlingspunktAnkeInfoPanel
          previewCallback={previewCallback}
          previewCallbackAnke={previewCallback}
          saveTempAnke={this.saveAnkeText}
          submitCallback={this.submit}
          selectedBehandlingspunkt={selectedBehandlingspunkt}
        />
        <AnkeBehandlingModal showModal={showModalAnkeBehandling} closeEvent={goToSearchPage} />
      </>
    );
  }
}

BehandlingsprosessAnkeIndex.propTypes = {
  behandlingIdentifier: PropTypes.instanceOf(BehandlingIdentifier).isRequired,
  saveAnke: PropTypes.func.isRequired,
  resolveAnkeTemp: PropTypes.func.isRequired,
  previewCallback: PropTypes.func.isRequired,
  submitCallback: PropTypes.func.isRequired,
  goToDefaultPage: PropTypes.func.isRequired,
  goToSearchPage: PropTypes.func.isRequired,
  selectedBehandlingspunkt: PropTypes.string,
};

const mapStateToProps = (state) => ({
  behandlingIdentifier: getBehandlingIdentifier(state),
});

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    saveAnke,
    resolveAnkeTemp,
  }, dispatch),
});

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(BehandlingsprosessAnkeIndex);
export default withBehandlingsprosessIndex(setSelectedBehandlingspunktNavn, getSelectedBehandlingspunktNavn)(connectedComponent);

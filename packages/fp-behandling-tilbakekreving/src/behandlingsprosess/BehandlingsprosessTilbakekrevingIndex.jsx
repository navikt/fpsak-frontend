import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setSubmitFailed as dispatchSubmitFailed } from 'redux-form';

import { withBehandlingsprosessIndex } from '@fpsak-frontend/fp-behandling-felles';

import {
 setSelectedBehandlingspunktNavn, getSelectedBehandlingspunktNavn,
} from './duckBpTilbake';
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

  submit = (aksjonspunktModels) => {
    const { submitCallback, goToDefaultPage } = this.props;

    const afterAksjonspunktSubmit = () => {
      const isFatterVedtakAp = aksjonspunktModels.some(ap => ap.kode === tilbakekrevingAksjonspunktCodes.FORESLA_VEDTAK);
      if (isFatterVedtakAp) {
        this.setState(prevState => ({ ...prevState, showFatterVedtakModal: true }));
      } else {
        goToDefaultPage();
      }
    };

    return submitCallback(aksjonspunktModels, afterAksjonspunktSubmit, true);
  }

  render = () => {
    const {
      selectedBehandlingspunkt, goToSearchPage, dispatchSubmitFailed: submitFailedDispatch,
    } = this.props;
    const { showFatterVedtakModal } = this.state;

    return (
      <>
        <TilbakekrevingBehandlingspunktInfoPanel
          submitCallback={this.submit}
          dispatchSubmitFailed={submitFailedDispatch}
          selectedBehandlingspunkt={selectedBehandlingspunkt}
        />
        <FatterTilbakekrevingVedtakStatusModal closeEvent={goToSearchPage} showModal={showFatterVedtakModal} />
      </>
    );
  }
}

BehandlingsprosessTilbakekrevingIndex.propTypes = {
  submitCallback: PropTypes.func.isRequired,
  goToDefaultPage: PropTypes.func.isRequired,
  goToSearchPage: PropTypes.func.isRequired,
  selectedBehandlingspunkt: PropTypes.string,
  dispatchSubmitFailed: PropTypes.func.isRequired,
};

const mapStateToProps = () => ({
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    dispatchSubmitFailed,
  }, dispatch),
});

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(BehandlingsprosessTilbakekrevingIndex);
export default withBehandlingsprosessIndex(setSelectedBehandlingspunktNavn, getSelectedBehandlingspunktNavn)(connectedComponent);

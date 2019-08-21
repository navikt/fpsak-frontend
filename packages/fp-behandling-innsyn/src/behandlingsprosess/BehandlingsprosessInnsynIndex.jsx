import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withBehandlingsprosessIndex } from '@fpsak-frontend/fp-behandling-felles';

import { setSelectedBehandlingspunktNavn, getSelectedBehandlingspunktNavn } from './duckBpInnsyn';
import BehandlingspunktInnsynInfoPanel from './components/BehandlingspunktInnsynInfoPanel';

/**
 * BehandlingsprosessInnsynIndex
 *
 * Har ansvar for behandlingsprosessdelen av hovedvinduet når behandlingstypen er Innsyn.
 */
export class BehandlingsprosessInnsynIndex extends Component {
  submit = (aksjonspunktModels) => {
    const { submitCallback, goToDefaultPage } = this.props;

    const afterAksjonspunktSubmit = () => {
      goToDefaultPage();
    };

    return submitCallback(aksjonspunktModels, afterAksjonspunktSubmit, true);
  }

  render = () => {
    const { previewCallback, selectedBehandlingspunkt } = this.props;

    return (
      <BehandlingspunktInnsynInfoPanel
        submitCallback={this.submit}
        previewCallback={previewCallback}
        selectedBehandlingspunkt={selectedBehandlingspunkt}
      />
    );
  }
}

BehandlingsprosessInnsynIndex.propTypes = {
  selectedBehandlingspunkt: PropTypes.string,
  previewCallback: PropTypes.func.isRequired,
  submitCallback: PropTypes.func.isRequired,
  goToDefaultPage: PropTypes.func.isRequired,
};

export default withBehandlingsprosessIndex(setSelectedBehandlingspunktNavn, getSelectedBehandlingspunktNavn)(BehandlingsprosessInnsynIndex);

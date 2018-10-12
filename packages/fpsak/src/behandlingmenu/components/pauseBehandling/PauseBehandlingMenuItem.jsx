import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import BehandlingIdentifier from 'behandling/BehandlingIdentifier';
import SettBehandlingPaVentForm from 'behandling/components/SettBehandlingPaVentForm';
import MenuButton from '../MenuButton';

/**
 * PauseBehandlingMenuItem
 *
 * Presentasjonskomponent. Viser menyinnslag for å sette behandling på vent.
 * Håndterer også visning av modal.
 */
export class PauseBehandlingMenuItem extends Component {
  constructor() {
    super();

    this.submit = this.submit.bind(this);
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);

    this.state = {
      showModal: false,
    };
  }

  submit(formValues) {
    const { setBehandlingOnHold, behandlingIdentifier, behandlingVersjon } = this.props;
    const values = {
      behandlingVersjon,
      behandlingId: behandlingIdentifier.behandlingId,
      frist: formValues.frist,
      ventearsak: formValues.ventearsak,
    };
    setBehandlingOnHold(values, behandlingIdentifier);

    this.hideModal();
  }

  showModal() {
    const { toggleBehandlingsmeny } = this.props;
    this.setState({ showModal: true });
    toggleBehandlingsmeny();
  }

  hideModal() {
    this.setState({ showModal: false });
  }

  render() {
    const { settBehandlingPaVentEnabled, behandlingIdentifier } = this.props;
    const { showModal } = this.state;

    if (!behandlingIdentifier) {
      return null;
    }

    return (
      <div>
        <MenuButton onClick={this.showModal} disabled={!settBehandlingPaVentEnabled}>
          <FormattedMessage id="Behandlingsmeny.BehandlingOnHold" />
        </MenuButton>
        {showModal
          && (
          <SettBehandlingPaVentForm
            showModal={showModal}
            onSubmit={this.submit}
            cancelEvent={this.hideModal}
            hasManualPaVent
          />
          )
        }
      </div>
    );
  }
}

PauseBehandlingMenuItem.propTypes = {
  behandlingIdentifier: PropTypes.instanceOf(BehandlingIdentifier),
  behandlingVersjon: PropTypes.number,
  toggleBehandlingsmeny: PropTypes.func.isRequired,
  setBehandlingOnHold: PropTypes.func.isRequired,
  settBehandlingPaVentEnabled: PropTypes.bool,
};

PauseBehandlingMenuItem.defaultProps = {
  settBehandlingPaVentEnabled: false,
  behandlingIdentifier: undefined,
  behandlingVersjon: undefined,
};

export default PauseBehandlingMenuItem;

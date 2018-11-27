import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import BehandlingIdentifier from 'behandling/BehandlingIdentifier';
import OkAvbrytModal from 'sharedComponents/OkAvbrytModal';
import MenuButton from '../MenuButton';

/**
 * OpenBehandlingForChangesMenuItem
 *
 * Presentasjonskomponent. Viser menyinnslag for å åpne behandling for endringer.
 * Håndterer også visning av modal.
 */
class OpenBehandlingForChangesMenuItem extends Component {
  constructor() {
    super();

    this.submit = this.submit.bind(this);
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);

    this.state = {
      showModal: false,
    };
  }

  submit() {
    const { openBehandlingForChanges, behandlingIdentifier, behandlingVersjon } = this.props;
    const params = {
      behandlingId: behandlingIdentifier.behandlingId,
      behandlingVersjon,
    };
    openBehandlingForChanges(params, behandlingIdentifier);

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
    const { behandlingIdentifier } = this.props;
    const { showModal } = this.state;

    if (!behandlingIdentifier) {
      return null;
    }

    return (
      <div>
        <MenuButton onClick={this.showModal}>
          <FormattedMessage id="Behandlingsmeny.ReopenBehandling" />
        </MenuButton>
        {showModal
          && (
          <OkAvbrytModal
            textCode="OpenBehandlingForChangesMenuItem.OpenBehandling"
            showModal={showModal}
            submit={this.submit}
            cancel={this.hideModal}
          />
          )
        }
      </div>
    );
  }
}

OpenBehandlingForChangesMenuItem.propTypes = {
  behandlingIdentifier: PropTypes.instanceOf(BehandlingIdentifier),
  behandlingVersjon: PropTypes.number,
  openBehandlingForChanges: PropTypes.func.isRequired,
  toggleBehandlingsmeny: PropTypes.func.isRequired,
};

OpenBehandlingForChangesMenuItem.defaultProps = {
  behandlingIdentifier: undefined,
  behandlingVersjon: undefined,
};

export default OpenBehandlingForChangesMenuItem;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import CreateNewBehandlingModal from './CreateNewBehandlingModal';
import MenuButton from '../MenuButton';

/**
 * CreateNewBehandlingMenuItem
 *
 * Presentasjonskomponent. Viser menyinnslag for ny 1.gangsbehandling.
 * Håndterer også visning av modal.
 */
class CreateNewBehandlingMenuItem extends Component {
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
    const { saksnummer, submitNyForstegangsBehandling, push } = this.props;
    const data = {
      saksnummer: saksnummer.toString(),
      ...formValues,
    };
    submitNyForstegangsBehandling(push, saksnummer, data);
    this.hideModal();
  }

  showModal() {
    this.setState({ showModal: true });
  }

  hideModal() {
    this.setState({ showModal: false });
  }

  render() {
    const { opprettNyForstegangsBehandlingEnabled, opprettRevurderingEnabled, ikkeVisOpprettNyBehandling } = this.props;
    const { showModal } = this.state;
    return (
      <div>
        <MenuButton onClick={this.showModal} disabled={ikkeVisOpprettNyBehandling}>
          <FormattedMessage id="Behandlingsmeny.NyForstegangsbehandling" />
        </MenuButton>
        {showModal
        && (
        <CreateNewBehandlingModal
          showModal={showModal}
          cancelEvent={this.hideModal}
          onSubmit={this.submit}
          hasEnabledCreateNewBehandling={opprettNyForstegangsBehandlingEnabled}
          hasEnabledCreateRevurdering={opprettRevurderingEnabled}
        />
        )
        }
      </div>
    );
  }
}

CreateNewBehandlingMenuItem.propTypes = {
  saksnummer: PropTypes.number.isRequired,
  push: PropTypes.func.isRequired,
  submitNyForstegangsBehandling: PropTypes.func.isRequired,
  opprettNyForstegangsBehandlingEnabled: PropTypes.bool,
  opprettRevurderingEnabled: PropTypes.bool,
  ikkeVisOpprettNyBehandling: PropTypes.bool,
};

CreateNewBehandlingMenuItem.defaultProps = {
  opprettNyForstegangsBehandlingEnabled: false,
  opprettRevurderingEnabled: false,
  ikkeVisOpprettNyBehandling: false,
};

export default CreateNewBehandlingMenuItem;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import BehandlingIdentifier from 'behandling/BehandlingIdentifier';
import ChangeBehandlendeEnhetModal from './ChangeBehandlendeEnhetModal';
import MenuButton from '../MenuButton';

/**
 * ChangeBehandlendeEnhetMenuItem
 *
 * Presentasjonskomponent. Viser menyinnslag for å endre behandlende enhet.
 * Håndterer også visning av modal.
 */
class ChangeBehandlendeEnhetMenuItem extends Component {
  constructor() {
    super();

    this.submit = this.submit.bind(this);
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.handleEnhetChange = this.handleEnhetChange.bind(this);

    this.state = {
      showModal: false,
      nyEnhet: null,
    };
  }

  submit(formValues) {
    const { behandlingIdentifier, behandlingVersjon, nyBehandlendeEnhet } = this.props;
    const { nyEnhet } = this.state;
    const values = {
      behandlingVersjon,
      behandlingId: behandlingIdentifier.behandlingId,
      enhetNavn: nyEnhet.enhetNavn,
      enhetId: nyEnhet.enhetId,
      begrunnelse: formValues.begrunnelse,
    };
    nyBehandlendeEnhet(values, behandlingIdentifier);

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

  handleEnhetChange(e) {
    const { behandlendeEnheter, behandlendeEnhetId } = this.props;
    const filtrerteBehandlendeEnheter = behandlendeEnheter
      .filter(enhet => enhet.enhetId !== behandlendeEnhetId);
    this.setState({ nyEnhet: filtrerteBehandlendeEnheter[e.target.value] });
  }

  render() {
    const {
      byttBehandlendeEnhetEnabled, behandlendeEnheter, behandlendeEnhetId, behandlendeEnhetNavn,
    } = this.props;
    const { showModal } = this.state;
    return (
      <div>
        <MenuButton onClick={this.showModal} disabled={!byttBehandlendeEnhetEnabled}>
          <FormattedMessage id="Behandlingsmeny.ByttBehandlendeEnhet" />
        </MenuButton>
        {showModal
          && (
          <ChangeBehandlendeEnhetModal
            showModal={showModal}
            cancelEvent={this.hideModal}
            behandlendeEnheter={behandlendeEnheter}
            gjeldendeBehandlendeEnhetId={behandlendeEnhetId}
            gjeldendeBehandlendeEnhetNavn={behandlendeEnhetNavn}
            onSubmit={this.submit}
            handleEnhetChange={this.handleEnhetChange}
          />
          )
        }
      </div>
    );
  }
}

ChangeBehandlendeEnhetMenuItem.propTypes = {
  behandlingIdentifier: PropTypes.instanceOf(BehandlingIdentifier),
  behandlingVersjon: PropTypes.number,
  behandlendeEnhetId: PropTypes.string,
  behandlendeEnhetNavn: PropTypes.string,
  toggleBehandlingsmeny: PropTypes.func.isRequired,
  behandlendeEnheter: PropTypes.arrayOf(PropTypes.shape({
    enhetId: PropTypes.string.isRequired,
    enhetNavn: PropTypes.string.isRequired,
  })).isRequired,
  nyBehandlendeEnhet: PropTypes.func.isRequired,
  byttBehandlendeEnhetEnabled: PropTypes.bool,
};

ChangeBehandlendeEnhetMenuItem.defaultProps = {
  behandlingIdentifier: undefined,
  behandlingVersjon: undefined,
  behandlendeEnhetId: undefined,
  behandlendeEnhetNavn: undefined,
  byttBehandlendeEnhetEnabled: false,
};

export default ChangeBehandlendeEnhetMenuItem;

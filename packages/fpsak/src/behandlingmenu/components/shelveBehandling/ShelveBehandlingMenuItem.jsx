import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { getHenleggArsaker, getBehandlingType } from 'behandling/behandlingSelectors';
import BehandlingIdentifier from 'behandling/BehandlingIdentifier';
import MenuButton from '../MenuButton';
import ShelveBehandlingModal from './ShelveBehandlingModal';
import BehandlingenShelvedModal from './BehandlingenShelvedModal';

/**
 * ShelveBehandlingMenuItem
 *
 * Presentasjonskomponent. Viser menyinnslag for henlegging av behandling.
 * Håndterer også visning av modal.
 */
class ShelveBehandlingMenuItem extends Component {
  constructor() {
    super();

    this.submit = this.submit.bind(this);
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.goToSearchPage = this.goToSearchPage.bind(this);

    this.state = {
      showModal: false,
      showBehandlingErHenlagtModal: false,
    };
  }

  submit(formValues) {
    const { behandlingIdentifier, behandlingVersjon, shelveBehandling } = this.props;
    const henleggBehandlingDto = {
      behandlingVersjon,
      behandlingId: behandlingIdentifier.behandlingId,
      årsakKode: formValues.årsakKode,
      begrunnelse: formValues.begrunnelse,
    };
    shelveBehandling(henleggBehandlingDto).then(() => {
      this.setState({ showBehandlingErHenlagtModal: true });
    });
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

  goToSearchPage() {
    const { push } = this.props;
    push('/');
  }

  render() {
    const {
      henleggArsaker, behandlingIdentifier, henleggBehandlingEnabled, previewHenleggBehandling, behandlingsType,
    } = this.props;
    const { showBehandlingErHenlagtModal, showModal } = this.state;
    return (
      <div>
        <MenuButton onClick={this.showModal} disabled={!henleggBehandlingEnabled}>
          <FormattedMessage id="Behandlingsmeny.HenleggBehandling" />
        </MenuButton>
        {showModal
          && (
          <ShelveBehandlingModal
            showModal={showModal}
            onSubmit={this.submit}
            cancelEvent={this.hideModal}
            previewHenleggBehandling={previewHenleggBehandling}
            behandlingId={behandlingIdentifier ? behandlingIdentifier.behandlingId : undefined}
            henleggArsaker={henleggArsaker}
            behandlingsType={behandlingsType}
          />
          )
        }
        {showBehandlingErHenlagtModal
          && (
          <BehandlingenShelvedModal
            showModal={showBehandlingErHenlagtModal}
            closeEvent={this.goToSearchPage}
          />
          )
        }
      </div>
    );
  }
}

ShelveBehandlingMenuItem.propTypes = {
  previewHenleggBehandling: PropTypes.func.isRequired,
  behandlingIdentifier: PropTypes.instanceOf(BehandlingIdentifier),
  behandlingVersjon: PropTypes.number,
  toggleBehandlingsmeny: PropTypes.func.isRequired,
  shelveBehandling: PropTypes.func.isRequired,
  henleggArsaker: PropTypes.arrayOf(PropTypes.shape({
    valg: PropTypes.string,
  })),
  behandlingsType: PropTypes.shape({
    kode: PropTypes.string,
    navn: PropTypes.string,
  }),
  push: PropTypes.func.isRequired,
  henleggBehandlingEnabled: PropTypes.bool,
};

ShelveBehandlingMenuItem.defaultProps = {
  behandlingIdentifier: undefined,
  behandlingVersjon: undefined,
  henleggArsaker: null,
  behandlingsType: null,
  henleggBehandlingEnabled: false,
};

const mapStateToProps = state => ({
  henleggArsaker: getHenleggArsaker(state),
  behandlingsType: getBehandlingType(state),
});

export default connect(mapStateToProps)(ShelveBehandlingMenuItem);

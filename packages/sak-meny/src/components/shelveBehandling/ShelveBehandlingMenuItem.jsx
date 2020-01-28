import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';
import { BehandlingIdentifier } from '@fpsak-frontend/fp-felles';

import MenuButton from '../MenuButton';
import ShelveBehandlingModal from './ShelveBehandlingModal';
import BehandlingenShelvedModal from './BehandlingenShelvedModal';
import MenyKodeverk from '../../MenyKodeverk';

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
    const {
      behandlingIdentifier, behandlingVersjon, shelveBehandling,
    } = this.props;
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
      behandlingIdentifier, henleggBehandlingEnabled, previewHenleggBehandling, ytelseType, behandlingType,
      behandlingUuid, menyKodeverk,
    } = this.props;
    const { showBehandlingErHenlagtModal, showModal } = this.state;

    return (
      <div>
        <MenuButton onMouseDown={this.showModal} disabled={!henleggBehandlingEnabled}>
          <FormattedMessage id="Behandlingsmeny.HenleggBehandling" />
        </MenuButton>
        {showModal && (
          <ShelveBehandlingModal
            showModal={showModal}
            onSubmit={this.submit}
            cancelEvent={this.hideModal}
            previewHenleggBehandling={previewHenleggBehandling}
            behandlingId={behandlingIdentifier ? behandlingIdentifier.behandlingId : undefined}
            ytelseType={ytelseType}
            behandlingType={behandlingType}
            behandlingUuid={behandlingUuid}
            menyKodeverk={menyKodeverk}
          />
        )}
        {showBehandlingErHenlagtModal && (
          <BehandlingenShelvedModal
            showModal={showBehandlingErHenlagtModal}
            closeEvent={this.goToSearchPage}
          />
        )}
      </div>
    );
  }
}

ShelveBehandlingMenuItem.propTypes = {
  previewHenleggBehandling: PropTypes.func.isRequired,
  behandlingIdentifier: PropTypes.instanceOf(BehandlingIdentifier).isRequired,
  menyKodeverk: PropTypes.instanceOf(MenyKodeverk).isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  toggleBehandlingsmeny: PropTypes.func.isRequired,
  shelveBehandling: PropTypes.func.isRequired,
  push: PropTypes.func.isRequired,
  ytelseType: kodeverkObjektPropType.isRequired,
  behandlingType: kodeverkObjektPropType.isRequired,
  henleggBehandlingEnabled: PropTypes.bool.isRequired,
  behandlingUuid: PropTypes.string,
};

ShelveBehandlingMenuItem.defaultProps = {
  behandlingUuid: undefined,
};

export default ShelveBehandlingMenuItem;

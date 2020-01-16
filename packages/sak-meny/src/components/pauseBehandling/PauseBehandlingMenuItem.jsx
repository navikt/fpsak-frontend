import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { BehandlingIdentifier, SettBehandlingPaVentForm } from '@fpsak-frontend/fp-felles';

import MenuButton from '../MenuButton';
import MenyKodeverk from '../../MenyKodeverk';

/**
 * PauseBehandlingMenuItem
 *
 * Presentasjonskomponent. Viser menyinnslag for å sette behandling på vent.
 * Håndterer også visning av modal.
 */
class PauseBehandlingMenuItem extends Component {
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
    const {
      setBehandlingOnHold, behandlingIdentifier, behandlingVersjon, behandlingType, erPapirsoknad,
    } = this.props;
    const values = {
      behandlingVersjon,
      behandlingId: behandlingIdentifier.behandlingId,
      frist: formValues.frist,
      ventearsak: formValues.ventearsak,
    };
    setBehandlingOnHold(values, behandlingIdentifier, behandlingType, erPapirsoknad);

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
    const { settBehandlingPaVentEnabled, behandlingIdentifier, menyKodeverk } = this.props;
    const { showModal } = this.state;

    if (!behandlingIdentifier) {
      return null;
    }

    const ventearsaker = menyKodeverk.getKodeverkForValgtBehandling(kodeverkTyper.VENT_AARSAK);

    return (
      <div>
        <MenuButton onMouseDown={this.showModal} disabled={!settBehandlingPaVentEnabled}>
          <FormattedMessage id="Behandlingsmeny.BehandlingOnHold" />
        </MenuButton>
        {showModal && (
          <SettBehandlingPaVentForm
            showModal={showModal}
            onSubmit={this.submit}
            cancelEvent={this.hideModal}
            hasManualPaVent
            ventearsaker={ventearsaker}
          />
        )}
      </div>
    );
  }
}

PauseBehandlingMenuItem.propTypes = {
  behandlingIdentifier: PropTypes.instanceOf(BehandlingIdentifier).isRequired,
  menyKodeverk: PropTypes.instanceOf(MenyKodeverk).isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  toggleBehandlingsmeny: PropTypes.func.isRequired,
  setBehandlingOnHold: PropTypes.func.isRequired,
  settBehandlingPaVentEnabled: PropTypes.bool.isRequired,
  behandlingType: PropTypes.shape().isRequired,
  erPapirsoknad: PropTypes.bool.isRequired,
};

export default PauseBehandlingMenuItem;

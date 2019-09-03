import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { BehandlingIdentifier, SettBehandlingPaVentForm } from '@fpsak-frontend/fp-felles';

import { getBehandlingType } from '../../../behandling/duck';
import { getFpTilbakeKodeverk, getKodeverk } from '../../../kodeverk/duck';
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
    const { settBehandlingPaVentEnabled, behandlingIdentifier, ventearsaker } = this.props;
    const { showModal } = this.state;

    if (!behandlingIdentifier) {
      return null;
    }

    return (
      <div>
        <MenuButton onMouseDown={this.showModal} disabled={!settBehandlingPaVentEnabled}>
          <FormattedMessage id="Behandlingsmeny.BehandlingOnHold" />
        </MenuButton>
        {showModal
          && (
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
  behandlingIdentifier: PropTypes.instanceOf(BehandlingIdentifier),
  behandlingVersjon: PropTypes.number,
  toggleBehandlingsmeny: PropTypes.func.isRequired,
  setBehandlingOnHold: PropTypes.func.isRequired,
  settBehandlingPaVentEnabled: PropTypes.bool,
  ventearsaker: PropTypes.arrayOf(PropTypes.shape({
    kode: PropTypes.string,
    navn: PropTypes.string,
  })),
};

PauseBehandlingMenuItem.defaultProps = {
  settBehandlingPaVentEnabled: false,
  behandlingIdentifier: undefined,
  behandlingVersjon: undefined,
  ventearsaker: [],
};

const mapStateToPropsFactory = (initialState) => {
  const ventearsakerFpsak = getKodeverk(kodeverkTyper.VENTEARSAK)(initialState);
  const ventearsakerFptilbake = getFpTilbakeKodeverk(kodeverkTyper.VENTEARSAK)(initialState);
  return (state) => {
    const behandlingType = getBehandlingType(state);
    const behandlingTypeKode = behandlingType ? behandlingType.kode : undefined;
    return {
      ventearsaker: BehandlingType.TILBAKEKREVING === behandlingTypeKode ? ventearsakerFptilbake : ventearsakerFpsak,
    };
  };
};

export default connect(mapStateToPropsFactory)(PauseBehandlingMenuItem);

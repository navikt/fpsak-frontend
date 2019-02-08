import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Column, Row } from 'nav-frontend-grid';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Normaltekst } from 'nav-frontend-typografi';

import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import { Modal, Image } from '@fpsak-frontend/shared-components';

import { getFagsakYtelseType } from 'behandlingKlage/src/duckKlage';
import { getResolveProsessAksjonspunkterSuccess } from 'behandlingKlage/src/behandlingsprosess/duckBpKlage';
import { getResolveFaktaAksjonspunkterSuccess } from 'behandlingKlage/src/fakta/duckFaktaKlage';
import {
  getBehandlingsresultat,
  getBehandlingStatus,
} from 'behandlingKlage/src/selectors/klageBehandlingSelectors';

import innvilgetImageUrl from '@fpsak-frontend/assets/images/innvilget_valgt.svg';

import styles from './iverksetterVedtakStatusModal.less';

/**
 * IverksetterVedtakStatusModal
 *
 * Presentasjonskomponent. Denne modalen vises etter en vilkarsvurdering der behandlingsstatusen
 * er satt til Iverksetter vedtak. Ved å trykke på knapp blir den NAV-ansatte tatt tilbake til sokesiden.
 */
class IverksetterVedtakStatusModal extends Component {
  constructor() {
    super();
    this.showModal = false;
  }

  render() {
    const {
      intl, closeEvent, modalTextId, behandlingsresultat, behandlingStatusKode,
      resolveProsessAksjonspunkterSuccess, resolveFaktaAksjonspunkterSuccess,
    } = this.props;
    const rejected = behandlingsresultat
      && behandlingsresultat.type.kode === behandlingResultatType.AVSLATT;

    if (!this.showModal && behandlingStatusKode === behandlingStatus.IVERKSETTER_VEDTAK) {
      this.showModal = resolveProsessAksjonspunkterSuccess || resolveFaktaAksjonspunkterSuccess;
    }

    return (
      <Modal
        className={styles.modal}
        isOpen={this.showModal}
        closeButton={false}
        contentLabel={intl.formatMessage({ id: 'IverksetterVedtakStatusModal.ModalDescription' })}
        onRequestClose={closeEvent}
      >
        <Row>
          <Column xs="1">
            <Image
              className={styles.image}
              altCode={rejected ? 'IverksetterVedtakStatusModal.Avslatt' : 'IverksetterVedtakStatusModal.Innvilget'}
              src={innvilgetImageUrl}
            />
            <div className={styles.divider} />
          </Column>
          <Column xs="9">
            <Normaltekst>
              <FormattedMessage id={modalTextId} />
            </Normaltekst>
            <Normaltekst>
              <FormattedMessage id="IverksetterVedtakStatusModal.GoToSearchPage" />
            </Normaltekst>
          </Column>
          <Column xs="2">
            <Hovedknapp
              mini
              className={styles.button}
              onClick={closeEvent}
              autoFocus
            >
              {intl.formatMessage({ id: 'IverksetterVedtakStatusModal.Ok' })}
            </Hovedknapp>
          </Column>

        </Row>
      </Modal>
    );
  }
}

IverksetterVedtakStatusModal.propTypes = {
  intl: intlShape.isRequired,
  closeEvent: PropTypes.func.isRequired,
  resolveProsessAksjonspunkterSuccess: PropTypes.bool.isRequired,
  resolveFaktaAksjonspunkterSuccess: PropTypes.bool.isRequired,
  behandlingStatusKode: PropTypes.string.isRequired,
  behandlingsresultat: PropTypes.shape(),
  modalTextId: PropTypes.string.isRequired,
};

IverksetterVedtakStatusModal.defaultProps = {
  behandlingsresultat: undefined,
};

const getModalTextId = createSelector(
  [getFagsakYtelseType, getBehandlingsresultat],
  (ytelseType, behandlingsresultat) => {
    if (!(behandlingsresultat
      && behandlingsresultat.type.kode === behandlingResultatType.AVSLATT)) {
      return 'IverksetterVedtakStatusModal.InnvilgetOgIverksatt';
    }
    return ytelseType.kode === fagsakYtelseType.ENGANGSSTONAD
      ? 'IverksetterVedtakStatusModal.AvslattOgIverksattES' : 'IverksetterVedtakStatusModal.AvslattOgIverksattFP';
  },
);

const mapStateToProps = state => ({
  behandlingsresultat: getBehandlingsresultat(state),
  behandlingStatusKode: getBehandlingStatus(state).kode,
  resolveProsessAksjonspunkterSuccess: getResolveProsessAksjonspunkterSuccess(state),
  resolveFaktaAksjonspunkterSuccess: getResolveFaktaAksjonspunkterSuccess(state),
  modalTextId: getModalTextId(state),

});

export default connect(mapStateToProps)(injectIntl(IverksetterVedtakStatusModal));

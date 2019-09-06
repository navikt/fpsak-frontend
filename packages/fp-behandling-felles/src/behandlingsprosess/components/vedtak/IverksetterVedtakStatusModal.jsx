import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Normaltekst } from 'nav-frontend-typografi';
import Modal from 'nav-frontend-modal';

import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import FagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import { Image } from '@fpsak-frontend/shared-components';
import innvilgetImageUrl from '@fpsak-frontend/assets/images/innvilget_valgt.svg';

import styles from './iverksetterVedtakStatusModal.less';

const getModalTextId = (ytelseType, behandlingsresultat, behandlingType) => {
  if (!(behandlingsresultat
      && behandlingsresultat.type.kode === behandlingResultatType.AVSLATT)) {
    return behandlingType.kode === BehandlingType.TILBAKEKREVING
      ? 'IverksetterVedtakStatusModal.InnvilgetOgIverksatt'
      : 'IverksetterVedtakStatusModal.InnvilgetOgIverksattAutomatisk';
  }
  return ytelseType.kode === FagsakYtelseType.ENGANGSSTONAD
    ? 'IverksetterVedtakStatusModal.AvslattOgIverksattES' : 'IverksetterVedtakStatusModal.AvslattOgIverksattFP';
};


/**
 * IverksetterVedtakStatusModal
 *
 * Presentasjonskomponent. Denne modalen vises etter en vilkarsvurdering der behandlingsstatusen
 * er satt til Iverksetter vedtak. Ved å trykke på knapp blir den NAV-ansatte tatt tilbake til sokesiden.
 */
class IverksetterVedtakStatusModal extends Component {
  constructor(props) {
    super(props);
    this.showModal = false;
  }

  render() {
    const {
      intl, closeEvent, behandlingsresultat, behandlingStatusKode, behandlingType,
      resolveProsessAksjonspunkterSuccess, resolveFaktaAksjonspunkterSuccess, fagsakYtelseType,
    } = this.props;
    const modalTextId = getModalTextId(fagsakYtelseType, behandlingsresultat, behandlingType);

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
        shouldCloseOnOverlayClick={false}
        ariaHideApp={false}
        style={{ overlay: { zIndex: 3000 } }}
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
  intl: PropTypes.shape().isRequired,
  closeEvent: PropTypes.func.isRequired,
  resolveProsessAksjonspunkterSuccess: PropTypes.bool.isRequired,
  resolveFaktaAksjonspunkterSuccess: PropTypes.bool.isRequired,
  behandlingStatusKode: PropTypes.string.isRequired,
  behandlingsresultat: PropTypes.shape(),
  behandlingType: PropTypes.shape().isRequired,
  fagsakYtelseType: PropTypes.shape().isRequired,
};

IverksetterVedtakStatusModal.defaultProps = {
  behandlingsresultat: undefined,
};

export default injectIntl(IverksetterVedtakStatusModal);

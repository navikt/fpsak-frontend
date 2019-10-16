import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import Modal from 'nav-frontend-modal';

import { Image } from '@fpsak-frontend/shared-components';
import innvilgetImageUrl from '@fpsak-frontend/assets/images/innvilget_valgt.svg';

import styles from './behandlingenShelvedModal.less';

/**
 * BehandlingenShelvedModal
 *
 * Presentasjonskomponent. Denne modalen vises etter en vilkarsvurdering der behandlingsstatusen
 * er satt til Iverksetter vedtak. Ved å trykke på knapp blir saksbehandler tatt tilbake til sokesiden.
 */
const BehandlingenShelvedModal = ({
  showModal,
  closeEvent,
  intl,
}) => (
  <Modal
    className={styles.modal}
    isOpen={showModal}
    closeButton={false}
    contentLabel={intl.formatMessage({ id: 'BehandlingenShelvedModal.ModalDescription' })}
    onRequestClose={closeEvent}
    shouldCloseOnOverlayClick={false}
    ariaHideApp={false}
  >
    <Row>
      <Column xs="1">
        <Image className={styles.image} alt={intl.formatMessage({ id: 'BehandlingenShelvedModal.Henlagt' })} src={innvilgetImageUrl} />
        <div className={styles.divider} />
      </Column>
      <Column xs="9">
        <Element><FormattedMessage id="BehandlingenShelvedModal.BehandlingenErHenlagt" /></Element>
        <Normaltekst><FormattedMessage id="BehandlingenShelvedModal.RutetTilForsiden" /></Normaltekst>
      </Column>
      <Column xs="2">
        <Hovedknapp
          mini
          className={styles.button}
          onClick={closeEvent}
          autoFocus
        >
          {intl.formatMessage({ id: 'BehandlingenShelvedModal.Ok' })}
        </Hovedknapp>
      </Column>
    </Row>
  </Modal>
);

BehandlingenShelvedModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  closeEvent: PropTypes.func.isRequired,
  intl: PropTypes.shape().isRequired,
};

export default injectIntl(BehandlingenShelvedModal);

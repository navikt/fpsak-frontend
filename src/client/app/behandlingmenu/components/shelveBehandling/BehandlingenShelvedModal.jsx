import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import { Row, Column } from 'nav-frontend-grid';
import Modal from 'sharedComponents/Modal';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Normaltekst, Element } from 'nav-frontend-typografi';

import Image from 'sharedComponents/Image';

import innvilgetImageUrl from 'images/innvilget_valgt.svg';

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
  >
    <Row>
      <Column xs="1">
        <Image className={styles.image} altCode="BehandlingenShelvedModal.Henlagt" src={innvilgetImageUrl} />
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
  intl: intlShape.isRequired,
};

export default injectIntl(BehandlingenShelvedModal);

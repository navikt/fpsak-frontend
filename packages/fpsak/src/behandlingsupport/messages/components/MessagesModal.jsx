import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'sharedComponents/Modal';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Container, Row, Column } from 'nav-frontend-grid';
import { Element } from 'nav-frontend-typografi';

import Image from 'sharedComponents/Image';

import innvilgetImageUrl from 'images/innvilget_valgt.svg';
import styles from './MessagesModal.less';
/**
 * MessagesModal
 *
 * Presentasjonskomponent. Denne modalen vises etter at et brev har blitt bestilt.
 * Ved å trykke på knapp blir fritekst-feltet tømt.
 */
const MessagesModal = ({
  showModal,
  closeEvent,
  intl,
}) => (
  <Modal
    className={styles.modal}
    isOpen={showModal}
    closeButton={false}
    contentLabel={intl.formatMessage({ id: 'MessagesModal.description' })}
    onRequestClose={closeEvent}
  >
    <Container className={styles.container}>
      <Row>
        <Column xs="1">
          <Image className={styles.image} altCode="MessagesModal.description" src={innvilgetImageUrl} />
          <div className={styles.divider} />
        </Column>
        <Column xs="9">
          <Element className={styles.text}>
            <FormattedMessage id="MessagesModal.text" />
          </Element>
        </Column>
        <Column xs="2">
          <Hovedknapp
            className={styles.button}
            mini
            onClick={closeEvent}
            autoFocus
          >
            {intl.formatMessage({ id: 'MessagesModal.OK' })}
          </Hovedknapp>
        </Column>
      </Row>
    </Container>
  </Modal>
);

MessagesModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  closeEvent: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
};

export default injectIntl(MessagesModal);

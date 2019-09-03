import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Column, Row } from 'nav-frontend-grid';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { FormattedMessage } from 'react-intl';
import { Element } from 'nav-frontend-typografi';
import Modal from 'nav-frontend-modal';

import styles from './dataFetchPendingModal.less';

// Skal ikke være mulig å lukke modal
const doNothing = () => undefined;

// Vent to sekund med å vise melding
const MESSAGE_DELAY_MILLIS = 2000;

/**
 * DataFetchPendingModal
 *
 * Presentasjonskomponent. Denne modalen vises når det går mer enn to sekund å polle etter serverdata.
 */
export class DataFetchPendingModal extends Component {
  constructor(props) {
    super(props);
    this.enableMessage = this.enableMessage.bind(this);

    this.state = {
      displayMessage: false,
    };

    this.timer = setTimeout(this.enableMessage, MESSAGE_DELAY_MILLIS);
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  enableMessage() {
    this.setState({ displayMessage: true });
  }

  render() {
    const { displayMessage } = this.state;
    if (!displayMessage) {
      return null;
    }

    const { pendingMessage } = this.props;

    return (
      <Modal
        className={styles.modal}
        isOpen
        closeButton={false}
        contentLabel={pendingMessage}
        onRequestClose={doNothing}
        shouldCloseOnOverlayClick={false}
        ariaHideApp={false}
      >
        <Row>
          <Column xs="2">
            <NavFrontendSpinner type="L" />
            <div className={styles.divider} />
          </Column>
          <Column xs="10">
            <Element className={styles.modalText}>
              <FormattedMessage id="DataFetchPendingModal.LosningenJobberMedBehandlingen" />
            </Element>
          </Column>
        </Row>
      </Modal>
    );
  }
}

DataFetchPendingModal.propTypes = {
  pendingMessage: PropTypes.string.isRequired,
};

export default DataFetchPendingModal;

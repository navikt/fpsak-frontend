import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Column } from 'nav-frontend-grid';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { Element } from 'nav-frontend-typografi';

import Modal from 'sharedComponents/Modal';

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

    const { pendingMessages } = this.props;

    return (
      <Modal
        className={styles.modal}
        isOpen
        closeButton={false}
        contentLabel={pendingMessages[0]}
        onRequestClose={doNothing}
      >
        <Row>
          <Column xs="2">
            <NavFrontendSpinner type="L" />
            <div className={styles.divider} />
          </Column>
          <Column xs="10">
            {pendingMessages.map(message => (
              <Row key={message} className={styles.messageRow}>
                <Element>
                  {message}
                </Element>
              </Row>
            ))}
          </Column>
        </Row>
      </Modal>
    );
  }
}

DataFetchPendingModal.propTypes = {
  pendingMessages: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default DataFetchPendingModal;

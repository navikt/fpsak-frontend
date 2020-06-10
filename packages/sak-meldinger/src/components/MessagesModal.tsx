import React, { FunctionComponent } from 'react';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Column, Container, Row } from 'nav-frontend-grid';
import { Element } from 'nav-frontend-typografi';
import Modal from 'nav-frontend-modal';

import { Image } from '@fpsak-frontend/shared-components';
import innvilgetImageUrl from '@fpsak-frontend/assets/images/innvilget_valgt.svg';

import styles from './MessagesModal.less';

interface OwnProps {
  showModal: boolean;
  closeEvent: () => void;
}

/**
 * MessagesModal
 *
 * Presentasjonskomponent. Denne modalen vises etter at et brev har blitt bestilt.
 * Ved å trykke på knapp blir fritekst-feltet tømt.
 */
const MessagesModal: FunctionComponent<OwnProps & WrappedComponentProps> = ({
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
    shouldCloseOnOverlayClick={false}
  >
    <Container className={styles.container}>
      <Row>
        <Column xs="1">
          <Image
            className={styles.image}
            alt={intl.formatMessage({ id: 'MessagesModal.description' })}
            src={innvilgetImageUrl}
          />
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

export default injectIntl(MessagesModal);

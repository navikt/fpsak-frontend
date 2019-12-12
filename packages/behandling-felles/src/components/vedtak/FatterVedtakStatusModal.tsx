import React, { FunctionComponent } from 'react';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Normaltekst } from 'nav-frontend-typografi';
import Modal from 'nav-frontend-modal';

import { Image } from '@fpsak-frontend/shared-components';
import innvilgetImageUrl from '@fpsak-frontend/assets/images/innvilget_valgt.svg';

import styles from './fatterVedtakStatusModal.less';

interface OwnProps {
  visModal?: boolean;
  lukkModal: () => void;
  tekstkode: string;
}

/**
 * FatterVedtakStatusModal
 *
 * Presentasjonskomponent. Denne modalen viser en lightbox etter at en saksbehandler har sendt et forslag på vedtak til beslutter
 * ved totrinnskontroll. Ved å trykke på knapp blir saksbehandler tatt tilbake til søkesiden.
 */
const FatterVedtakStatusModal: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  intl,
  visModal = false,
  lukkModal,
  tekstkode,
}) => (
  <Modal
    className={styles.modal}
    isOpen={visModal}
    closeButton={false}
    contentLabel={intl.formatMessage({ id: tekstkode })}
    onRequestClose={lukkModal}
    shouldCloseOnOverlayClick={false}
  >
    <Row className="">
      <Column xs="1">
        <Image
          className={styles.image}
          alt={intl.formatMessage({ id: tekstkode })}
          src={innvilgetImageUrl}
        />
        <div className={styles.divider} />
      </Column>
      <Column xs="9">
        <Normaltekst>
          <FormattedMessage id={tekstkode} />
        </Normaltekst>
        <Normaltekst><FormattedMessage id="FatterVedtakStatusModal.GoToSearchPage" /></Normaltekst>
      </Column>
      <Column xs="2">
        <Hovedknapp
          mini
          className={styles.button}
          onClick={lukkModal}
          autoFocus
        >
          {intl.formatMessage({ id: 'FatterVedtakStatusModal.Ok' })}
        </Hovedknapp>
      </Column>
    </Row>
  </Modal>
);

export default injectIntl(FatterVedtakStatusModal);

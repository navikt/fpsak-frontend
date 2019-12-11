import React, { FunctionComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Normaltekst } from 'nav-frontend-typografi';
import Modal from 'nav-frontend-modal';

import { Image } from '@fpsak-frontend/shared-components';
import innvilgetImageUrl from '@fpsak-frontend/assets/images/innvilget_valgt.svg';

import styles from './fatterVedtakStatusModal.less';

interface OwnProps {
  intl: {
    formatMessage: (o: {}) => string;
  };
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
const FatterVedtakStatusModal: FunctionComponent<OwnProps> = ({
  intl,
  visModal,
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
    <Row>
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

FatterVedtakStatusModal.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
  visModal: PropTypes.bool,
  lukkModal: PropTypes.func.isRequired,
  tekstkode: PropTypes.string.isRequired,
};

FatterVedtakStatusModal.defaultProps = {
  visModal: false,
};

export default injectIntl(FatterVedtakStatusModal);

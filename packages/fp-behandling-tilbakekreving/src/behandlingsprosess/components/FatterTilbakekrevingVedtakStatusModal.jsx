import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import { Row, Column } from 'nav-frontend-grid';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Normaltekst } from 'nav-frontend-typografi';
import Modal from 'nav-frontend-modal';

import innvilgetImageUrl from '@fpsak-frontend/assets/images/innvilget_valgt.svg';
import { Image } from '@fpsak-frontend/shared-components';

import styles from './fatterTilbakekrevingVedtakStatusModal.less';

/**
 * FatterTilbakekrevingVedtakStatusModal
 *
 * Presentasjonskomponent. Denne modalen viser en lightbox etter at en saksbehandler har sendt et forslag på vedtak til beslutter
 * ved totrinnskontroll. Ved å trykke på knapp blir saksbehandler tatt tilbake til søkesiden.
 */
const FatterTilbakekrevingVedtakStatusModal = ({
  intl,
  showModal,
  closeEvent,
}) => (
  <Modal
    className={styles.modal}
    isOpen={showModal}
    closeButton={false}
    contentLabel={intl.formatMessage({ id: 'FatterTilbakekrevingVedtakStatusModal.Sendt' })}
    onRequestClose={closeEvent}
    shouldCloseOnOverlayClick={false}
    ariaHideApp={false}
    style={{ overlay: { zIndex: 3000 } }}
  >
    <Row>
      <Column xs="1">
        <Image className={styles.image} altCode="FatterTilbakekrevingVedtakStatusModal.Sendt" src={innvilgetImageUrl} />
        <div className={styles.divider} />
      </Column>
      <Column xs="9">
        <Normaltekst>
          <FormattedMessage id="FatterTilbakekrevingVedtakStatusModal.Sendt" />
        </Normaltekst>
        <Normaltekst><FormattedMessage id="FatterTilbakekrevingVedtakStatusModal.GoToSearchPage" /></Normaltekst>
      </Column>
      <Column xs="2">
        <Hovedknapp
          mini
          className={styles.button}
          onClick={closeEvent}
          autoFocus
        >
          {intl.formatMessage({ id: 'FatterTilbakekrevingVedtakStatusModal.Ok' })}
        </Hovedknapp>
      </Column>
    </Row>
  </Modal>
);

FatterTilbakekrevingVedtakStatusModal.propTypes = {
  intl: intlShape.isRequired,
  closeEvent: PropTypes.func.isRequired,
  showModal: PropTypes.bool.isRequired,
};

export default injectIntl(FatterTilbakekrevingVedtakStatusModal);

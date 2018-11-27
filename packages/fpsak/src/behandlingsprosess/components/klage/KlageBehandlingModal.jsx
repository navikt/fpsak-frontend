import React from 'react';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Column, Row } from 'nav-frontend-grid';
import Modal from 'sharedComponents/Modal';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Normaltekst } from 'nav-frontend-typografi';

import innvilgetImageUrl from 'images/innvilget_valgt.svg';
import Image from 'sharedComponents/Image';

import styles from './klageBehandlingModal.less';

/**
 * KlageVurderingModal
 *
 * Presentasjonskomponent. Denne komponenten vises ved en klagevurdering hvor saksbehandler
 * i aksjonspunkt '' velger at ytelsesvedtaket skal stadfestes. Ved å trykke på knapp blir saksbehandler
 * tatt tilbake til sokesiden.
 */
const KlageVurderingModal = ({
  showModal,
  closeEvent,
  intl,
}) => (
  <Modal
    className={styles.modal}
    isOpen={showModal}
    contentLabel={intl.formatMessage({ id: 'KlageVurderingModal.ModalDescription' })}
    onRequestClose={closeEvent}
    closeButton={false}
  >
    <Row>
      <Column xs="1">
        <Image className={styles.image} src={innvilgetImageUrl} />
        <div className={styles.divider} />
      </Column>
      <Column xs="9">
        <Normaltekst><FormattedMessage id="KlageVurderingModal.VedtakOversendt" /></Normaltekst>
        <Normaltekst><FormattedMessage id="KlageVurderingModal.GoToSearchPage" /></Normaltekst>
      </Column>
      <Column xs="2">
        <Hovedknapp
          mini
          className={styles.button}
          onClick={closeEvent}
          autoFocus
        >
          {intl.formatMessage({ id: 'KlageVurderingModal.Ok' })}
        </Hovedknapp>
      </Column>
    </Row>
  </Modal>
);


KlageVurderingModal.propTypes = {
  showModal: PropTypes.bool,
  closeEvent: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
};

KlageVurderingModal.defaultProps = {
  showModal: false,
};

export default injectIntl(KlageVurderingModal);

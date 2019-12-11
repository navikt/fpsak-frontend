import React, { FunctionComponent } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Column, Row } from 'nav-frontend-grid';
import Modal from 'nav-frontend-modal';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Normaltekst } from 'nav-frontend-typografi';

import { Image } from '@fpsak-frontend/shared-components';
import innvilgetImageUrl from '@fpsak-frontend/assets/images/innvilget_valgt.svg';

import styles from './ankeBehandlingModal.less';

interface OwnProps {
  intl: {
    formatMessage: (o: {}) => string;
  };
  visModal?: boolean;
  lukkModal: () => void;
}

/**
 * AnkeVurderingModal
 *
 * Presentasjonskomponent. Denne komponenten vises ved en ankevurdering hvor saksbehandler
 * i aksjonspunkt '' velger at ytelsesvedtaket skal stadfestes. Ved å trykke på knapp blir saksbehandler
 * tatt tilbake til sokesiden.
 */
const AnkeVurderingModal: FunctionComponent<OwnProps> = ({
  visModal,
  lukkModal,
  intl,
}) => (
  <Modal
    className={styles.modal}
    isOpen={visModal}
    contentLabel={intl.formatMessage({ id: 'AnkeVurderingModal.ModalDescription' })}
    onRequestClose={lukkModal}
    closeButton={false}
    shouldCloseOnOverlayClick={false}
  >
    <Row>
      <Column xs="1">
        <Image className={styles.image} src={innvilgetImageUrl} />
        <div className={styles.divider} />
      </Column>
      <Column xs="9">
        <Normaltekst><FormattedMessage id="AnkeVurderingModal.VedtakOversendt" /></Normaltekst>
        <Normaltekst><FormattedMessage id="AnkeVurderingModal.GoToSearchPage" /></Normaltekst>
      </Column>
      <Column xs="2">
        <Hovedknapp
          mini
          className={styles.button}
          onClick={lukkModal}
          autoFocus
        >
          {intl.formatMessage({ id: 'AnkeVurderingModal.Ok' })}
        </Hovedknapp>
      </Column>
    </Row>
  </Modal>
);


AnkeVurderingModal.propTypes = {
  visModal: PropTypes.bool,
  lukkModal: PropTypes.func.isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
};

AnkeVurderingModal.defaultProps = {
  visModal: false,
};

export default injectIntl(AnkeVurderingModal);

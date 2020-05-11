import React, { FunctionComponent } from 'react';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import Modal from 'nav-frontend-modal';

import { Image } from '@fpsak-frontend/shared-components';
import innvilgetImageUrl from '@fpsak-frontend/assets/images/innvilget_valgt.svg';

import styles from './henlagtBehandlingModal.less';

interface OwnProps {
  showModal: boolean;
  closeEvent: () => void;
}

/**
 * HenlagtBehandlingModal
 *
 * Presentasjonskomponent. Denne modalen vises etter en vilkarsvurdering der behandlingsstatusen
 * er satt til Iverksetter vedtak. Ved å trykke på knapp blir saksbehandler tatt tilbake til sokesiden.
 */
const HenlagtBehandlingModal: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  intl,
  showModal,
  closeEvent,
}) => (
  <Modal
    className={styles.modal}
    isOpen={showModal}
    closeButton={false}
    contentLabel={intl.formatMessage({ id: 'HenlagtBehandlingModal.ModalDescription' })}
    onRequestClose={closeEvent}
    shouldCloseOnOverlayClick={false}
  >
    <Row>
      <Column xs="1">
        <Image className={styles.image} alt={intl.formatMessage({ id: 'HenlagtBehandlingModal.Henlagt' })} src={innvilgetImageUrl} />
        <div className={styles.divider} />
      </Column>
      <Column xs="9">
        <Element><FormattedMessage id="HenlagtBehandlingModal.BehandlingenErHenlagt" /></Element>
        <Normaltekst><FormattedMessage id="HenlagtBehandlingModal.RutetTilForsiden" /></Normaltekst>
      </Column>
      <Column xs="2">
        <Hovedknapp
          mini
          className={styles.button}
          onClick={closeEvent}
          autoFocus
        >
          {intl.formatMessage({ id: 'HenlagtBehandlingModal.Ok' })}
        </Hovedknapp>
      </Column>
    </Row>
  </Modal>
);

export default injectIntl(HenlagtBehandlingModal);

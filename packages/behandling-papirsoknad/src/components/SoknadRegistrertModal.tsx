import React, { FunctionComponent } from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { Link } from 'react-router-dom';
import Modal from 'nav-frontend-modal';
import { Hovedknapp } from 'nav-frontend-knapper';
import { AlertStripeSuksess } from 'nav-frontend-alertstriper';

import styles from './soknadRegistrertModal.less';

interface OwnProps {
  isOpen?: boolean;
}

/**
 * SoknadRegistrertModal
 *
 * Presentasjonskomponent. Informasjonsmodal som vises til saksbehandler når en papirsøknad har blitt registrert.
 */
export const SoknadRegistrertModal: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  isOpen = false,
  intl,
}) => (
  <Modal
    className={styles.modalStyle}
    isOpen={isOpen}
    contentLabel={intl.formatMessage({ id: 'SoknadRegistrertModal.ContentLabel' })}
    closeButton={false}
    onRequestClose={() => null}
    shouldCloseOnOverlayClick={false}
  >
    <AlertStripeSuksess className={styles.alertStyle}>
      <div className={styles.left}>
        <p className={styles.reduceMargin}>{intl.formatMessage({ id: 'SoknadRegistrertModal.InfoTextOne' })}</p>
        <p className={styles.reduceMargin}>{intl.formatMessage({ id: 'SoknadRegistrertModal.InfoTextTwo' })}</p>
      </div>
      <div className={styles.right}>
        <Link to="/">
          <Hovedknapp mini>{intl.formatMessage({ id: 'SoknadRegistrertModal.OkButtonText' })}</Hovedknapp>
        </Link>
      </div>
    </AlertStripeSuksess>
  </Modal>
);

export default injectIntl(SoknadRegistrertModal);

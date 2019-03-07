import React from 'react';
import { intlShape, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import Modal from 'nav-frontend-modal';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Link } from 'react-router-dom';
import { AlertStripeSuksess } from 'nav-frontend-alertstriper';

import styles from './soknadRegistrertModal.less';

/**
 * SoknadRegistrertModal
 *
 * Presentasjonskomponent. Informasjonsmodal som vises til saksbehandler når en papirsøknad har blitt registrert.
 */
export const SoknadRegistrertModal = ({
  isOpen,
  intl,
}) => (
  <Modal
    className={styles.modalStyle}
    isOpen={isOpen}
    contentLabel={intl.formatMessage({ id: 'SoknadRegistrertModal.ContentLabel' })}
    closeButton={false}
    onRequestClose={() => null}
    shouldCloseOnOverlayClick={false}
    ariaHideApp={false}
    style={{ overlay: { zIndex: 3000 } }}
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

SoknadRegistrertModal.propTypes = {
  isOpen: PropTypes.bool,
  intl: intlShape.isRequired,
};

SoknadRegistrertModal.defaultProps = {
  isOpen: false,
};

export default injectIntl(SoknadRegistrertModal);

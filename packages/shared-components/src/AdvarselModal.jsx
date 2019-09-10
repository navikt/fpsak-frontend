import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';
import Modal from 'nav-frontend-modal';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';

import advarselImageUrl from '@fpsak-frontend/assets/images/advarsel.svg';

import Image from './Image';

import styles from './advarselModal.less';

/**
 * AdvarselModal
 *
 * Presentasjonskomponent. Modal med advarselikon og som viser en valgfri tekst i tillegg til knappen OK.
 */
const AdvarselModal = ({
  textCode,
  headerTextCode,
  showModal,
  submit,
  intl,
}) => (
  <Modal
    className={styles.modal}
    isOpen={showModal}
    closeButton={false}
    contentLabel={intl.formatMessage({ id: textCode })}
    onRequestClose={submit}
    shouldCloseOnOverlayClick={false}
    ariaHideApp={false}
  >
    <Row>
      <Column xs="1">
        <Image className={styles.image} altCode={textCode} src={advarselImageUrl} />
        <div className={styles.divider} />
      </Column>
      <Column xs="8" className={styles.text}>
        {headerTextCode && <Undertittel><FormattedMessage id={headerTextCode} /></Undertittel>}
        <Normaltekst><FormattedMessage id={textCode} /></Normaltekst>
      </Column>
      <Column xs="2">
        <Hovedknapp
          className={styles.submitButton}
          mini
          htmlType="submit"
          onClick={submit}
          autoFocus
        >
          {intl.formatMessage({ id: 'AdvarselModal.Ok' })}
        </Hovedknapp>
      </Column>
    </Row>
  </Modal>
);

AdvarselModal.propTypes = {
  intl: PropTypes.shape().isRequired,
  textCode: PropTypes.string.isRequired,
  headerTextCode: PropTypes.string,
  showModal: PropTypes.bool.isRequired,
  submit: PropTypes.func.isRequired,
};

AdvarselModal.defaultProps = {
  headerTextCode: undefined,
};

export default injectIntl(AdvarselModal);

import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import { Row, Column } from 'nav-frontend-grid';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Normaltekst } from 'nav-frontend-typografi';

import Image from 'sharedComponents/Image';
import Modal from 'sharedComponents/Modal';

import innvilgetImageUrl from 'images/sharedComponents/innvilget_valgt.svg';

import styles from './okAvbrytModal.less';

/**
 * OkAvbrytModal
 *
 * Presentasjonskomponent. Modal som viser en valgfri tekst i tillegg til knappene OK og Avbryt.
 */
const OkAvbrytModal = ({
  textCode,
  showModal,
  cancel,
  submit,
  intl,
}) => (
  <Modal
    className={styles.modal}
    isOpen={showModal}
    closeButton={false}
    contentLabel={intl.formatMessage({ id: textCode })}
    onRequestClose={cancel}
  >
    <Row>
      <Column xs="1">
        <Image className={styles.image} altCode={textCode} src={innvilgetImageUrl} />
        <div className={styles.divider} />
      </Column>
      <Column xs="9" className={styles.text}>
        <Normaltekst><FormattedMessage id={textCode} /></Normaltekst>
      </Column>
    </Row>
    <Row>
      <Column xs="3" />
      <Column xs="9">
        <Hovedknapp
          className={styles.submitButton}
          mini
          htmlType="submit"
          onClick={submit}
          autoFocus
        >
          {intl.formatMessage({ id: 'OkAvbrytModal.Ok' })}
        </Hovedknapp>
        <Knapp
          className={styles.cancelButton}
          mini
          htmlType="reset"
          onClick={cancel}
        >
          {intl.formatMessage({ id: 'OkAvbrytModal.Avbryt' })}
        </Knapp>
      </Column>
    </Row>
  </Modal>
);

OkAvbrytModal.propTypes = {
  intl: intlShape.isRequired,
  textCode: PropTypes.string.isRequired,
  showModal: PropTypes.bool.isRequired,
  submit: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
};


export default injectIntl(OkAvbrytModal);

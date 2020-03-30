import React, { FunctionComponent } from 'react';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';
import Modal from 'nav-frontend-modal';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Normaltekst } from 'nav-frontend-typografi';
import innvilgetImageUrl from '@fpsak-frontend/assets/images/innvilget_valgt.svg';
import Image from './Image';


import styles from './okAvbrytModal.less';

interface OwnProps {
  textCode: string;
  showModal: boolean;
  submit: () => void;
  cancel: () => void;
}

/**
 * OkAvbrytModal
 *
 * Presentasjonskomponent. Modal som viser en valgfri tekst i tillegg til knappene OK og Avbryt.
 */
const OkAvbrytModal: FunctionComponent<OwnProps & WrappedComponentProps> = ({
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
    shouldCloseOnOverlayClick={false}
  >
    <Row>
      <Column xs="1">
        <Image className={styles.image} alt={intl.formatMessage({ id: textCode })} src={innvilgetImageUrl} />
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

export default injectIntl(OkAvbrytModal);

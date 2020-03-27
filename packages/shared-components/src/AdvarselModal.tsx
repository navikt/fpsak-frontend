import React, { FunctionComponent } from 'react';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';
import Modal from 'nav-frontend-modal';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';

import advarselImageUrl from '@fpsak-frontend/assets/images/advarsel.svg';

import Image from './Image';

import styles from './advarselModal.less';

interface OwnProps {
  textCode: string;
  headerTextCode?: string;
  showModal: boolean;
  submit: () => void;
}

/**
 * AdvarselModal
 *
 * Presentasjonskomponent. Modal med advarselikon og som viser en valgfri tekst i tillegg til knappen OK.
 */
const AdvarselModal: FunctionComponent<OwnProps & WrappedComponentProps> = ({
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
  >
    <Row>
      <Column xs="1">
        <Image className={styles.image} alt={intl.formatMessage({ id: textCode })} src={advarselImageUrl} />
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

export default injectIntl(AdvarselModal);

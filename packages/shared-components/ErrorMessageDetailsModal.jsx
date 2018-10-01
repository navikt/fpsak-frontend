import React from 'react';
import PropTypes from 'prop-types';
import {
  injectIntl,
  intlShape,
  FormattedMessage,
} from 'react-intl';
import { Row, Column } from 'nav-frontend-grid';
import { Knapp } from 'nav-frontend-knapper';
import {
  Normaltekst,
  Undertekst,
  Undertittel,
} from 'nav-frontend-typografi';

import infoImageUrl from '@fpsak-frontend/images/behandle.svg';
import Image from './Image';
import Modal from './Modal';
import ElementWrapper from './ElementWrapper';
import VerticalSpacer from './VerticalSpacer';

import styles from './errorMessageDetailsModal.less';

const capitalizeFirstLetters = key => key.charAt(0).toUpperCase() + key.substr(1);

/**
 * ErrorMessageDetailsModal
 *
 * Presentasjonskomponent. Modal som viser en feildetaljer.
 */
const ErrorMessageDetailsModal = ({
  intl,
  showModal,
  closeModalFn,
  errorDetails,
}) => (
  <Modal
    className={styles.modal}
    isOpen={showModal}
    closeButton={false}
    contentLabel={intl.formatMessage({ id: 'ErrorMessageDetailsModal.ErrorDetails' })}
    onRequestClose={closeModalFn}
  >
    <Row>
      <Column xs="1">
        <Image className={styles.image} src={infoImageUrl} />
        <div className={styles.divider} />
      </Column>
      <Column xs="10" className={styles.text}>
        <Undertittel><FormattedMessage id="ErrorMessageDetailsModal.ErrorDetails" /></Undertittel>
      </Column>
    </Row>
    <VerticalSpacer sixteenPx />
    <Row>
      <Column xs="1" />
      <Column xs="11">
        {Object.keys(errorDetails).map(edKey => (
          <ElementWrapper key={edKey}>
            <Undertekst>{`${capitalizeFirstLetters(edKey)}:`}</Undertekst>
            <div className={styles.detail}>
              <Normaltekst>{errorDetails[edKey]}</Normaltekst>
            </div>
            <VerticalSpacer eightPx />
          </ElementWrapper>
        ))}
      </Column>
    </Row>
    <Row>
      <Column xs="12">
        <Knapp
          className={styles.cancelButton}
          mini
          htmlType="reset"
          onClick={closeModalFn}
        >
          <FormattedMessage id="ErrorMessageDetailsModal.Close" />
        </Knapp>
      </Column>
    </Row>
  </Modal>
);

ErrorMessageDetailsModal.propTypes = {
  intl: intlShape.isRequired,
  showModal: PropTypes.bool.isRequired,
  closeModalFn: PropTypes.func.isRequired,
  errorDetails: PropTypes.shape().isRequired,
};

export default injectIntl(ErrorMessageDetailsModal);

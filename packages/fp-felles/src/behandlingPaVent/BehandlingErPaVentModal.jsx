import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';
import { Hovedknapp } from 'nav-frontend-knapper';
import Modal from 'nav-frontend-modal';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import moment from 'moment';

import innvilgetImageUrl from '@fpsak-frontend/assets/images/innvilget_valgt.svg';
import { DDMMYYYY_DATE_FORMAT } from '@fpsak-frontend/utils';
import { Image } from '@fpsak-frontend/shared-components';

import SettBehandlingPaVentForm from './SettBehandlingPaVentForm';

import styles from './behandlingErPaVentModal.less';

/**
 * BehandlingErPaVentModal
 *
 * Presentasjonskomponent. Denne modalen vises når man går inn på en behandling som er satt på vent.
 */
export const BehandlingErPaVentModal = ({
  showModal,
  closeEvent,
  intl,
  behandlingId,
  fristBehandlingPaaVent,
  venteArsakKode,
  handleOnHoldSubmit,
  hasManualPaVent,
  ventearsaker,
}) => {
  if (behandlingId) {
    return (
      <SettBehandlingPaVentForm
        onSubmit={handleOnHoldSubmit}
        cancelEvent={closeEvent}
        showModal={showModal}
        frist={fristBehandlingPaaVent}
        ventearsak={venteArsakKode}
        comment={<Normaltekst>{intl.formatMessage({ id: 'BehandlingErPaVentModal.EndreFrist' })}</Normaltekst>}
        isUpdateOnHold
        hasManualPaVent={hasManualPaVent}
        ventearsaker={ventearsaker}
      />
    );
  }
  return (
    <Modal
      className={styles.modal}
      isOpen={showModal}
      closeButton={false}
      contentLabel={intl.formatMessage({ id: 'BehandlingErPaVentModal.ModalDescription' })}
      onRequestClose={closeEvent}
      readOnly
      shouldCloseOnOverlayClick={false}
      ariaHideApp={false}
    >
      <Row>
        <Column xs="1">
          <Image className={styles.image} alt={intl.formatMessage({ id: 'BehandlingErPaVentModal.PaVent' })} src={innvilgetImageUrl} />
          <div className={styles.divider} />
        </Column>
        <Column xs="9">
          <Element className={styles.text}>
            <FormattedMessage
              id="BehandlingErPaVentModal.SattPaVent"
              values={{ frist: behandlingId ? moment(new Date(fristBehandlingPaaVent)).format(DDMMYYYY_DATE_FORMAT) : '' }}
            />
          </Element>
        </Column>
        <Column xs="2">
          <Hovedknapp
            mini
            className={styles.button}
            onClick={closeEvent}
            autoFocus
          >
            {intl.formatMessage({ id: 'BehandlingErPaVentModal.Ok' })}
          </Hovedknapp>
        </Column>
      </Row>
    </Modal>
  );
};

BehandlingErPaVentModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  closeEvent: PropTypes.func.isRequired,
  handleOnHoldSubmit: PropTypes.func.isRequired,
  intl: PropTypes.shape().isRequired,
  behandlingId: PropTypes.number,
  fristBehandlingPaaVent: PropTypes.string,
  venteArsakKode: PropTypes.string,
  hasManualPaVent: PropTypes.bool.isRequired,
  ventearsaker: PropTypes.arrayOf(PropTypes.shape({
    kode: PropTypes.string,
    navn: PropTypes.string,
  })).isRequired,
};

BehandlingErPaVentModal.defaultProps = {
  behandlingId: undefined,
  fristBehandlingPaaVent: undefined,
  venteArsakKode: undefined,
};

export default injectIntl(BehandlingErPaVentModal);


import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import { Row, Column } from 'nav-frontend-grid';
import { Normaltekst } from 'nav-frontend-typografi';
import { Hovedknapp } from 'nav-frontend-knapper';

import { getDateAndTime } from 'utils/dateUtils';
import Modal from 'sharedComponents/Modal';
import Image from 'sharedComponents/Image';
import oppgavePropType from 'saksbehandler/oppgavePropType';
import { Oppgave } from 'saksbehandler/oppgaveTsType';

import innvilgetImageUrl from 'images/sharedComponents/innvilget_valgt.svg';

import styles from './oppgaveReservasjonForlengetModal.less';

interface TsProps {
  intl: any;
  oppgave: Oppgave;
  showModal: boolean;
  closeModal: (event: Event) => void;
}

/**
 * OppgaveReservasjonForlengetModal.
 */
export const OppgaveReservasjonForlengetModal = ({
  intl,
  oppgave,
  showModal,
  closeModal,
}: TsProps) => (
  <Modal
    className={styles.modal}
    isOpen={showModal}
    closeButton={false}
    contentLabel={intl.formatMessage({ id: 'OppgaveReservasjonForlengetModal.Reservert' })}
    onRequestClose={closeModal}
  >
    <Row>
      <Column xs="1">
        <Image
          className={styles.image}
          altCode="OppgaveReservasjonForlengetModal.Reservert"
          src={innvilgetImageUrl}
        />
        <div className={styles.divider} />
      </Column>
      <Column xs="9">
        <Normaltekst>
          <FormattedMessage id="OppgaveReservasjonForlengetModal.Reservert" />
        </Normaltekst>
        <Normaltekst>
          <FormattedMessage id="OppgaveReservasjonForlengetModal.Til" values={getDateAndTime(oppgave.status.reservertTilTidspunkt)} />
        </Normaltekst>
      </Column>
      <Column xs="2">
        <Hovedknapp
          mini
          className={styles.button}
          onClick={closeModal}
          autoFocus
        >
          {intl.formatMessage({ id: 'OppgaveReservasjonForlengetModal.Ok' })}
        </Hovedknapp>
      </Column>

    </Row>
  </Modal>
);

OppgaveReservasjonForlengetModal.propTypes = {
  intl: intlShape.isRequired,
  oppgave: oppgavePropType.isRequired,
  showModal: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
};

export default injectIntl(OppgaveReservasjonForlengetModal);

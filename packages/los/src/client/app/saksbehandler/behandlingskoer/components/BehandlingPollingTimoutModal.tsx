
import React from 'react';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import { Row, Column } from 'nav-frontend-grid';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Normaltekst } from 'nav-frontend-typografi';

import Image from 'sharedComponents/Image';
import Modal from 'sharedComponents/Modal';

import advarselImageUrl from 'images/advarsel.svg';

import styles from './behandlingPollingTimoutModal.less';

type TsProps = Readonly<{
  intl: any;
}>

/**
 * BehandlingPollingTimoutModal
 *
 * Presentasjonskomponent. Modal som vises når en har pollet etter behandlinger et gitt antall ganger (uten oppdateringer)
 */
const BehandlingPollingTimoutModal = ({
  intl,
}: TsProps) => (
  <Modal
    className={styles.modal}
    isOpen
    closeButton={false}
    contentLabel={intl.formatMessage({ id: 'BehandlingPollingTimoutModal.TimeoutMelding' })}
    onRequestClose={() => window.location.reload()}
  >
    <Row>
      <Column xs="1">
        <Image className={styles.image} altCode="BehandlingPollingTimoutModal.TimeoutMelding" src={advarselImageUrl} />
        <div className={styles.divider} />
      </Column>
      <Column xs="9" className={styles.text}>
        <Normaltekst><FormattedMessage id="BehandlingPollingTimoutModal.TimeoutMelding" /></Normaltekst>
      </Column>
    </Row>
    <Row>
      <Column xs="7" />
      <Column xs="5">
        <Hovedknapp
          className={styles.submitButton}
          mini
          htmlType="button"
          onClick={() => window.location.reload()}
          autoFocus
        >
          {intl.formatMessage({ id: 'BehandlingPollingTimoutModal.Oppfrisk' })}
        </Hovedknapp>
      </Column>
    </Row>
  </Modal>
);

BehandlingPollingTimoutModal.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(BehandlingPollingTimoutModal);

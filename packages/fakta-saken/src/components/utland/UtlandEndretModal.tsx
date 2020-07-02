import React, { FunctionComponent } from 'react';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Normaltekst } from 'nav-frontend-typografi';
import Modal from 'nav-frontend-modal';

import innvilgetImageUrl from '@fpsak-frontend/assets/images/innvilget_valgt.svg';
import {
  FlexColumn, FlexContainer, FlexRow, Image, VerticalSpacer,
} from '@fpsak-frontend/shared-components';

import styles from './utlandEndretModal.less';

interface OwnProps {
  visModal: boolean;
  lagreOgLukk: (data?: any) => void;
}

const UtlandEndretModal: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  intl,
  visModal,
  lagreOgLukk,
}) => (
  <Modal
    className={styles.modal}
    isOpen={visModal}
    contentLabel={intl.formatMessage({ id: 'UtlandEndretModal.UtlandetEndret' })}
    onRequestClose={lagreOgLukk}
    closeButton={false}
    shouldCloseOnOverlayClick={false}
  >
    <FlexContainer wrap>
      <FlexRow>
        <FlexColumn className={styles.iconContainer}>
          <Image className={styles.icon} src={innvilgetImageUrl} alt={intl.formatMessage({ id: 'UtlandEndretModal.Ok' })} />
        </FlexColumn>
        <FlexColumn className={styles.fullWidth}>
          <Normaltekst className={styles.modalLabel}>
            <FormattedMessage id="UtlandEndretModal.UtlandEndret" />
          </Normaltekst>
        </FlexColumn>
        <FlexColumn className={styles.right}>
          <VerticalSpacer sixteenPx />
          <Hovedknapp
            mini
            className={styles.button}
            onClick={lagreOgLukk}
          >
            <FormattedMessage id="UtlandEndretModal.Ok" />
          </Hovedknapp>
        </FlexColumn>
      </FlexRow>
    </FlexContainer>
  </Modal>
);

export default injectIntl(UtlandEndretModal);

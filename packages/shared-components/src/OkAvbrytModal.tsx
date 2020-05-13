import React, { FunctionComponent } from 'react';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import Modal from 'nav-frontend-modal';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Normaltekst } from 'nav-frontend-typografi';

import FlexColumn from './flexGrid/FlexColumn';
import FlexContainer from './flexGrid/FlexContainer';
import FlexRow from './flexGrid/FlexRow';
import VerticalSpacer from './VerticalSpacer';

import styles from './okAvbrytModal.less';

interface OwnProps {
  textCode: string;
  okButtonTextCode?: string;
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
  okButtonTextCode = 'OkAvbrytModal.Ok',
  showModal,
  cancel,
  submit,
  intl,
}) => (
  <Modal
    className={styles.modal}
    isOpen={showModal}
    closeButton
    contentLabel={intl.formatMessage({ id: textCode })}
    onRequestClose={cancel}
    shouldCloseOnOverlayClick={false}
  >
    <Normaltekst><FormattedMessage id={textCode} /></Normaltekst>
    <VerticalSpacer fourtyPx />
    <FlexContainer>
      <FlexRow>
        <FlexColumn>
          <Hovedknapp
            mini
            htmlType="submit"
            onClick={submit}
            autoFocus
          >
            {intl.formatMessage({ id: okButtonTextCode })}
          </Hovedknapp>
        </FlexColumn>
        <FlexColumn>
          <Knapp
            mini
            htmlType="reset"
            onClick={cancel}
          >
            {intl.formatMessage({ id: 'OkAvbrytModal.Avbryt' })}
          </Knapp>
        </FlexColumn>
      </FlexRow>
    </FlexContainer>
  </Modal>
);

export default injectIntl(OkAvbrytModal);

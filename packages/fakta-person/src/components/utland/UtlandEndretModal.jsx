import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Normaltekst } from 'nav-frontend-typografi';
import Modal from 'nav-frontend-modal';

import innvilgetImageUrl from '@fpsak-frontend/assets/images/innvilget_valgt.svg';
import { behandlingForm } from '@fpsak-frontend/fp-felles';
import {
  FlexColumn, FlexContainer, FlexRow, Image, VerticalSpacer,
} from '@fpsak-frontend/shared-components';

import styles from './utlandEndretModal.less';

export const UtlandEndretModalImpl = ({
  showModal,
  closeEvent,
  intl,
  ...formProps
}) => (
  <Modal
    className={styles.modal}
    isOpen={showModal}
    contentLabel="Utland endret"
    onRequestClose={closeEvent}
    closeButton={false}
    shouldCloseOnOverlayClick={false}
    ariaHideApp={false}
  >
    <FlexContainer wrap>
      <FlexRow>
        <FlexColumn className={styles.iconContainer}>
          <Image className={styles.icon} src={innvilgetImageUrl} alt={intl.formatMessage({ id: 'UtlandEndretModal.Ok' })} />
        </FlexColumn>
        <FlexColumn className={styles.fullWidth}>
          <Normaltekst className={styles.modalLabel}>
            <FormattedMessage
              id="PersonInfoPanel.UtlandEndret"
            />
          </Normaltekst>
        </FlexColumn>
        <FlexColumn className={styles.right}>
          <VerticalSpacer sixteenPx />
          <Hovedknapp
            mini
            className={styles.button}
            onClick={formProps.handleSubmit}
          >
            {intl.formatMessage({ id: 'UtlandEndretModal.Ok' })}
          </Hovedknapp>
        </FlexColumn>
      </FlexRow>
    </FlexContainer>
  </Modal>
);

UtlandEndretModalImpl.propTypes = {
  showModal: PropTypes.bool,
  closeEvent: PropTypes.func.isRequired,
  intl: PropTypes.shape().isRequired,
};

UtlandEndretModalImpl.defaultProps = {
  showModal: false,
};

const mapStateToPropsFactory = (initialState, ownProps) => {
  const onSubmit = (values) => ownProps.closeEvent(values);
  return () => ({
    onSubmit,
  });
};

export const UtlandEndretModal = connect(mapStateToPropsFactory)(behandlingForm({
  enableReinitialize: true,
})(injectIntl(UtlandEndretModalImpl)));

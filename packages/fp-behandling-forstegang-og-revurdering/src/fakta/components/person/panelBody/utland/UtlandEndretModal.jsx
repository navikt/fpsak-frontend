import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import PropTypes from 'prop-types';

import { Hovedknapp } from 'nav-frontend-knapper';
import { Normaltekst } from 'nav-frontend-typografi';
import { behandlingFormForstegangOgRevurdering } from 'behandlingForstegangOgRevurdering/src/behandlingFormForstegangOgRevurdering';
import Modal from 'nav-frontend-modal';
import innvilgetImageUrl from '@fpsak-frontend/assets/images/innvilget_valgt.svg';
import {
  FlexColumn, FlexRow, FlexContainer, VerticalSpacer, Image,
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
          <Image className={styles.icon} src={innvilgetImageUrl} altCode="UttakInfoPanel.Ok" />
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
            {intl.formatMessage({ id: 'UttakInfoPanel.Ok' })}
          </Hovedknapp>
        </FlexColumn>
      </FlexRow>
    </FlexContainer>
  </Modal>
);

UtlandEndretModalImpl.propTypes = {
  showModal: PropTypes.bool,
  closeEvent: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
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

export const UtlandEndretModal = connect(mapStateToPropsFactory)(behandlingFormForstegangOgRevurdering({
  enableReinitialize: true,
})(injectIntl(UtlandEndretModalImpl)));

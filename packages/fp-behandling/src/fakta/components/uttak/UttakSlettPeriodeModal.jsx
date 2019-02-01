import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import PropTypes from 'prop-types';
import moment from 'moment';
import { TextAreaField } from '@fpsak-frontend/form';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Normaltekst } from 'nav-frontend-typografi';
import { behandlingForm } from 'behandlingFpsak/src/behandlingForm';
import Modal from 'nav-frontend-modal';
import {
  minLength, maxLength, required, hasValidText, DDMMYYYY_DATE_FORMAT,
} from '@fpsak-frontend/utils';
import innvilgetImageUrl from '@fpsak-frontend/assets/images/innvilget_valgt.svg';
import {
  FlexColumn, FlexRow, FlexContainer, VerticalSpacer, Image,
} from '@fpsak-frontend/shared-components';
import styles from './uttakSlettPeriodeModal.less';

const minLength3 = minLength(3);
const maxLength2000 = maxLength(2000);

export const UttakSlettPeriodeModalImpl = ({
  showModal,
  closeEvent,
  cancelEvent,
  intl,
  periode,
  ...formProps
}) => {
  const fom = moment(periode.fom).format(DDMMYYYY_DATE_FORMAT);
  const tom = moment(periode.tom).format(DDMMYYYY_DATE_FORMAT);
  const uttakPeriodeType = periode.uttakPeriodeType !== undefined ? periode.uttakPeriodeType.navn : null;
  return (
    <Modal
      className={styles.modal}
      isOpen={showModal}
      contentLabel="Perioden slettes"
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
                id="UttakInfoPanel.PeriodenSlettes"
                values={{ fom, tom, uttakPeriodeType }}
              />
            </Normaltekst>
            <FlexRow>
              <FlexColumn className={styles.fullWidth}>
                <VerticalSpacer sixteenPx />
                <TextAreaField
                  name="begrunnelse"
                  textareaClass={styles.textAreaStyle}
                  label={{ id: 'UttakInfoPanel.BegrunnEndringen' }}
                  validate={[required, minLength3, maxLength2000, hasValidText]}
                  maxLength={2000}
                  autoFocus
                />
              </FlexColumn>
            </FlexRow>
          </FlexColumn>
        </FlexRow>

        <FlexRow>
          <FlexColumn className={styles.right}>
            <VerticalSpacer eightPx />
            <Hovedknapp
              mini
              className={styles.button}
              onClick={formProps.handleSubmit}
              disabled={formProps.pristine}
            >
              {intl.formatMessage({ id: 'UttakInfoPanel.Ok' })}
            </Hovedknapp>
            <Knapp
              mini
              onClick={() => {
                cancelEvent();
                formProps.destroy();
              }}
            >
              {intl.formatMessage({ id: 'UttakInfoPanel.Avbryt' })}
            </Knapp>
          </FlexColumn>
        </FlexRow>
      </FlexContainer>
    </Modal>
  );
};

UttakSlettPeriodeModalImpl.propTypes = {
  showModal: PropTypes.bool,
  closeEvent: PropTypes.func.isRequired,
  cancelEvent: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
  periode: PropTypes.shape().isRequired,
};

UttakSlettPeriodeModalImpl.defaultProps = {
  showModal: false,
};

const mapToStateToProps = (state, ownProps) => {
  const formName = `slettPeriodeForm-${ownProps.periode.id}`;
  return {
    form: formName,
    onSubmit: values => ownProps.closeEvent(values),
  };
};

const UttakSlettPeriodeModal = connect(mapToStateToProps)(behandlingForm({
  enableReinitialize: true,
})(injectIntl(UttakSlettPeriodeModalImpl)));

export default UttakSlettPeriodeModal;

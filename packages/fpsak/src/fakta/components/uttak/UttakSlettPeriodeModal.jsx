import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import PropTypes from 'prop-types';
import FlexColumn from 'sharedComponents/flexGrid/FlexColumn';
import FlexRow from 'sharedComponents/flexGrid/FlexRow';
import FlexContainer from 'sharedComponents/flexGrid/FlexContainer';
import Modal from 'sharedComponents/Modal';
import moment from 'moment';
import { DDMMYYYY_DATE_FORMAT } from 'utils/formats';
import { TextAreaField } from 'form/Fields';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Normaltekst } from 'nav-frontend-typografi';
import {
  minLength, maxLength, required, hasValidText,
} from 'utils/validation/validators';
import { behandlingForm } from 'behandling/behandlingForm';
import innvilgetImageUrl from 'images/innvilget_valgt.svg';
import Image from 'sharedComponents/Image';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
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

import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Normaltekst } from 'nav-frontend-typografi';
import Modal from 'nav-frontend-modal';

import { TextAreaField } from '@fpsak-frontend/form';
import {
  DDMMYYYY_DATE_FORMAT, hasValidText, maxLength, minLength, required,
} from '@fpsak-frontend/utils';
import innvilgetImageUrl from '@fpsak-frontend/assets/images/innvilget_valgt.svg';
import {
  FlexColumn, FlexContainer, FlexRow, Image, VerticalSpacer,
} from '@fpsak-frontend/shared-components';
import { injectKodeverk } from '@fpsak-frontend/fp-felles';

import { behandlingFormForstegangOgRevurdering } from 'behandlingForstegangOgRevurdering/src/behandlingFormForstegangOgRevurdering';
import { getAlleKodeverk } from 'behandlingForstegangOgRevurdering/src/duckBehandlingForstegangOgRev';

import styles from './uttakSlettPeriodeModal.less';

const minLength3 = minLength(3);
const maxLength2000 = maxLength(2000);

export const UttakSlettPeriodeModalImpl = ({
  showModal,
  closeEvent,
  cancelEvent,
  intl,
  periode,
  getKodeverknavn,
  ...formProps
}) => {
  const fom = moment(periode.fom).format(DDMMYYYY_DATE_FORMAT);
  const tom = moment(periode.tom).format(DDMMYYYY_DATE_FORMAT);
  const uttakPeriodeType = periode.uttakPeriodeType !== undefined ? getKodeverknavn(periode.uttakPeriodeType) : null;
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
  intl: PropTypes.shape().isRequired,
  periode: PropTypes.shape().isRequired,
  getKodeverknavn: PropTypes.func.isRequired,
};

UttakSlettPeriodeModalImpl.defaultProps = {
  showModal: false,
};

const mapStateToPropsFactory = (initialState, ownProps) => {
  const onSubmit = (values) => ownProps.closeEvent(values);

  return () => {
    const formName = `slettPeriodeForm-${ownProps.periode.id}`;
    return {
      form: formName,
      onSubmit,
    };
  };
};

const UttakSlettPeriodeModal = connect(mapStateToPropsFactory)(behandlingFormForstegangOgRevurdering({
  enableReinitialize: true,
})(injectIntl(UttakSlettPeriodeModalImpl)));

export default injectKodeverk(getAlleKodeverk)(UttakSlettPeriodeModal);

import React from 'react';
import { Element, Normaltekst, Undertekst } from 'nav-frontend-typografi';
import { FormattedMessage, injectIntl } from 'react-intl';
import Modal from 'nav-frontend-modal';
import {
  calcDaysAndWeeks, dateAfterOrEqual, dateBeforeOrEqual, DDMMYYYY_DATE_FORMAT, hasValidDate, ISO_DATE_FORMAT, required,
} from '@fpsak-frontend/utils';
import { FlexColumn, FlexContainer, FlexRow } from '@fpsak-frontend/shared-components';
import { behandlingFormValueSelector, behandlingForm } from '@fpsak-frontend/fp-felles';
import { DatepickerField } from '@fpsak-frontend/form';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import PropTypes from 'prop-types';
import { uttaksresultatAktivitetPropType } from '@fpsak-frontend/prop-types';
import { formPropTypes } from 'redux-form';
import { connect } from 'react-redux';
import moment from 'moment/moment';

import styles from './delOppPeriodeModal.less';

export const DelOppPeriodeModalImpl = ({
  periodeData,
  showModal,
  cancelEvent,
  førstePeriodeTom,
  intl,
  ...formProps
}) => {
  const numberOfDaysAndWeeks = calcDaysAndWeeks(periodeData.fom, førstePeriodeTom, ISO_DATE_FORMAT);
  return (
    <Modal
      isOpen={showModal}
      contentLabel={intl.formatMessage({ id: 'DelOppPeriodeModalImpl.ModalDescription' })}
      onRequestClose={cancelEvent}
      closeButton={false}
      className={styles.modal}
      shouldCloseOnOverlayClick={false}
      ariaHideApp={false}
    >
      <FlexContainer fluid wrap>
        <FlexRow wrap>
          <FlexColumn>
            <Element className={styles.marginTop}>
              <FormattedMessage id="DelOppPeriodeModalImpl.DelOppPerioden" />
            </Element>
          </FlexColumn>
        </FlexRow>
        <FlexRow wrap className={styles.marginTop}>
          <FlexColumn>
            <Undertekst><FormattedMessage id="DelOppPeriodeModalImpl.Periode" /></Undertekst>
            <Normaltekst>
              {`${moment(periodeData.fom.toString()).format(DDMMYYYY_DATE_FORMAT)} - ${moment(periodeData.tom.toString()).format(DDMMYYYY_DATE_FORMAT)}`}
            </Normaltekst>
          </FlexColumn>
        </FlexRow>
        <FlexRow wrap className={styles.marginTop}>
          <FlexColumn>
            <Undertekst><FormattedMessage id="DelOppPeriodeModalImpl.AngiTomDato" /></Undertekst>
            <FlexRow alignItemsToBaseline>
              <FlexColumn>
                <DatepickerField
                  name="ForstePeriodeTomDato"
                  className={styles.datePicker}
                  validate={[required, hasValidDate]}
                  initialMonth={new Date(periodeData.fom)}
                  numberOfMonths={2}
                  disabledDays={{ before: moment(periodeData.fom).toDate(), after: moment(periodeData.tom).toDate() }}
                />
              </FlexColumn>
              {førstePeriodeTom && (
                <FlexColumn>
                  <FormattedMessage
                    id={numberOfDaysAndWeeks.id.toString()}
                    values={{
                      weeks: numberOfDaysAndWeeks.weeks.toString(),
                      days: numberOfDaysAndWeeks.days.toString(),
                    }}
                  />

                </FlexColumn>
              )}
            </FlexRow>
          </FlexColumn>
        </FlexRow>
        <FlexRow wrap className={styles.marginTop}>
          <FlexColumn>
            <Hovedknapp
              mini
              htmlType="button"
              className={styles.button}
              onClick={formProps.handleSubmit}
              disabled={formProps.pristine}
            >
              <FormattedMessage id="DelOppPeriodeModalImpl.Ok" />
            </Hovedknapp>
            <Knapp
              htmlType="button"
              mini
              onClick={cancelEvent}
              className={styles.cancelButton}
            >
              <FormattedMessage id="DelOppPeriodeModalImpl.Avbryt" />
            </Knapp>
          </FlexColumn>
        </FlexRow>
      </FlexContainer>
    </Modal>
  );
};

DelOppPeriodeModalImpl.propTypes = {
  periodeData: uttaksresultatAktivitetPropType.isRequired,
  cancelEvent: PropTypes.func.isRequired,
  showModal: PropTypes.bool.isRequired,
  intl: PropTypes.shape().isRequired,
  ...formPropTypes,
};

const validateForm = (value, periodeData) => {
  if (value.ForstePeriodeTomDato
    && (dateAfterOrEqual(value.ForstePeriodeTomDato)(moment(periodeData.tom.toString()).subtract(1, 'day'))
      || dateBeforeOrEqual(value.ForstePeriodeTomDato)(periodeData.fom))) {
    return {
      ForstePeriodeTomDato: [{ id: 'DelOppPeriodeModalImpl.DatoUtenforPeriode' }],
    };
  }
  return null;
};

const transformValues = (values, periodeData) => {
  const addDay = moment(values.ForstePeriodeTomDato).add(1, 'days');
  const forstePeriode = {
    fom: periodeData.fom,
    tom: values.ForstePeriodeTomDato,
  };
  const andrePeriode = {
    fom: moment(addDay.toString()).format('YYYY-MM-DD'),
    tom: periodeData.tom,
  };
  return {
    periodeId: periodeData.id,
    trekkdager: periodeData.trekkdager,
    hovedsoker: periodeData.hovedsoker,
    gradertProsentandelArbeid: periodeData.gradertAktivitet ? periodeData.gradertAktivitet.prosentArbeid : null,
    gradertTrekkdager: periodeData.gradertAktivitet ? periodeData.gradertAktivitet.trekkdager : null,
    forstePeriode,
    andrePeriode,
  };
};

const mapStateToPropsFactory = (_initialState, ownProps) => {
  const { behandlingId, behandlingVersjon } = ownProps;
  const validate = (values) => validateForm(values, ownProps.periodeData);
  const onSubmit = (values) => ownProps.splitPeriod(transformValues(values, ownProps.periodeData));
  return (state) => ({
    førstePeriodeTom: behandlingFormValueSelector('DelOppPeriode', behandlingId, behandlingVersjon)(state, 'ForstePeriodeTomDato'),
    validate,
    onSubmit,
  });
};

const DelOppPeriodeModal = connect(mapStateToPropsFactory)(behandlingForm({
  form: 'DelOppPeriode',
})(DelOppPeriodeModalImpl));

export default injectIntl(DelOppPeriodeModal);

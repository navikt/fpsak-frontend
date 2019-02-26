import React from 'react';
import { Element, Normaltekst, Undertekst } from 'nav-frontend-typografi';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import {
  DDMMYYYY_DATE_FORMAT, hasValidDate, required, dateAfterOrEqual, dateBeforeOrEqual,
} from '@fpsak-frontend/utils';

import { DatepickerField } from '@fpsak-frontend/form';
import Modal from 'nav-frontend-modal';
import { Column, Row } from 'nav-frontend-grid';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import PropTypes from 'prop-types';
import { formPropTypes } from 'redux-form';
import { connect } from 'react-redux';
import moment from 'moment/moment';
import { uttaksresultatAktivitetPropType } from '@fpsak-frontend/prop-types';
import { behandlingForm } from '../../../../behandlingForm';
import styles from './delOppPeriodeModal.less';

export const DelOppPeriodeModalImpl = ({
  periodeData,
  showModal,
  cancelEvent,
  intl,
  ...formProps
}) => (
  <Modal
    isOpen={showModal}
    contentLabel={intl.formatMessage({ id: 'DelOppPeriodeModalImpl.ModalDescription' })}
    onRequestClose={cancelEvent}
    closeButton={false}
    className={styles.modal}
    shouldCloseOnOverlayClick={false}
    ariaHideApp={false}
  >
    <Element className={styles.marginTop}>
      <FormattedMessage id="DelOppPeriodeModalImpl.DelOppPerioden" />
    </Element>
    <div className={styles.marginTop}>
      <Undertekst><FormattedMessage id="DelOppPeriodeModalImpl.Periode" /></Undertekst>
      <Normaltekst>
        {moment(periodeData.fom.toString()).format(DDMMYYYY_DATE_FORMAT)}
        {' '}
-
        {moment(periodeData.tom.toString()).format(DDMMYYYY_DATE_FORMAT)}
      </Normaltekst>
    </div>
    <div className={styles.marginTop}>
      <Undertekst><FormattedMessage id="DelOppPeriodeModalImpl.AngiTomDato" /></Undertekst>
      <DatepickerField
        name="ForstePeriodeTomDato"
        className={styles.datePicker}
        validate={[required, hasValidDate]}
      />
    </div>
    <Row className={styles.marginTop}>
      <Column>
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
      </Column>
    </Row>
  </Modal>
);

DelOppPeriodeModalImpl.propTypes = {
  periodeData: uttaksresultatAktivitetPropType.isRequired,
  cancelEvent: PropTypes.func.isRequired,
  showModal: PropTypes.bool.isRequired,
  intl: intlShape.isRequired,
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
    hovedsoker: periodeData.hovedsoker,
    dagligUtbetalinger: periodeData.dagligUtbetalinger.sort((a, b) => moment(a.dag) - moment(b.dag)),
    feilutbetaling: periodeData.feilutbetaling,
    forstePeriode,
    andrePeriode,
  };
};

const mapStateToProps = (state, ownProps) => ({
  validate: values => validateForm(values, ownProps.periodeData),
  onSubmit: values => ownProps.splitPeriod(transformValues(values, ownProps.periodeData)),
});

const DelOppPeriodeModal = connect(mapStateToProps)(behandlingForm({
  form: 'DelOppPeriode',
})(DelOppPeriodeModalImpl));

export default injectIntl(DelOppPeriodeModal);

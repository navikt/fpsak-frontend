import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { formValueSelector, reduxForm } from 'redux-form';
import moment from 'moment';

import SettBehandlingPaVentModal from './SettBehandlingPaVentModal';

const initFrist = () => {
  const date = moment().toDate();
  date.setDate(date.getDate() + 28);
  return date.toISOString().substr(0, 10);
};

/**
 * SettBehandlingPaVentForm
 *
 * Presentasjonskomponent. Denne formen gjenbruker settBehandlingPaVentModal. Bruk denne komponenten som en wrapper for
 * settBehandlingPaVentModal hvis du ikke har noen ytre form.
 */
export const SettBehandlingPaVentFormImpl = ({
  handleSubmit,
  cancelEvent,
  showModal,
  frist,
  originalFrist,
  ventearsak,
  originalVentearsak,
  comment,
  isUpdateOnHold,
  hasManualPaVent,
}) => {
  const venteArsakHasChanged = !(originalVentearsak === ventearsak || (!ventearsak && !originalVentearsak));
  const fristHasChanged = !(originalFrist === frist || (!frist && !originalFrist));
  const showAvbryt = !(isUpdateOnHold && originalFrist === frist && !venteArsakHasChanged);
  return (
    <form>
      <SettBehandlingPaVentModal
        showModal={showModal}
        frist={frist}
        showAvbryt={showAvbryt}
        cancelEvent={cancelEvent}
        handleSubmit={handleSubmit}
        comment={comment}
        isUpdateOnHold={isUpdateOnHold}
        venteArsakHasChanged={venteArsakHasChanged}
        fristHasChanged={fristHasChanged}
        hasManualPaVent={hasManualPaVent}
      />
    </form>
  );
};
SettBehandlingPaVentFormImpl.propTypes = {
  showModal: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  cancelEvent: PropTypes.func.isRequired,
  ventearsak: PropTypes.string,
  originalVentearsak: PropTypes.string,
  frist: PropTypes.string,
  originalFrist: PropTypes.string,
  isUpdateOnHold: PropTypes.bool,
  comment: PropTypes.element,
  hasManualPaVent: PropTypes.bool.isRequired,
};

SettBehandlingPaVentFormImpl.defaultProps = {
  frist: null,
  originalFrist: null,
  ventearsak: null,
  originalVentearsak: null,
  comment: null,
  isUpdateOnHold: false,
};

const buildInitialValues = initialProps => ({
  ventearsak: initialProps.ventearsak,
  frist: initialProps.frist || !initialProps.hasManualPaVent ? initialProps.frist : initFrist(),
});

const mapStateToProps = (state, initialProps) => ({
  frist: formValueSelector('settBehandlingModalForm')(state, 'frist'),
  originalFrist: initialProps.frist,
  originalVentearsak: initialProps.ventearsak,
  ventearsak: formValueSelector('settBehandlingModalForm')(state, 'ventearsak'),
  initialValues: buildInitialValues(initialProps),
});

export default connect(mapStateToProps)(reduxForm({
  form: 'settBehandlingModalForm',
  enableReinitialize: true,
})(SettBehandlingPaVentFormImpl));

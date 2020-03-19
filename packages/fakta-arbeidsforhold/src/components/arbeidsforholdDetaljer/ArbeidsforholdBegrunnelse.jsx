import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  minLength, maxLength, required, hasValidText,
} from '@fpsak-frontend/utils';
import { TextAreaField, behandlingFormValueSelector, isBehandlingFormDirty } from '@fpsak-frontend/form';

import BehandlingFormFieldCleaner from '../../util/BehandlingFormFieldCleaner';
import aktivtArbeidsforholdHandling from '../../kodeverk/aktivtArbeidsforholdHandling';

/**
 * ArbeidsforholdBegrunnelse er ansvarlig for å vise begrunnelsesfeltet.
 */
export const ArbeidsforholdBegrunnelse = ({
  readOnly,
  formName,
  isDirty,
  harBegrunnelse,
  skalAvslaaYtelse,
  behandlingId,
  behandlingVersjon,
}) => (
  <>
    <BehandlingFormFieldCleaner formName={formName} fieldNames={['begrunnelse']} behandlingId={behandlingId} behandlingVersjon={behandlingVersjon}>
      { (isDirty || harBegrunnelse) && !skalAvslaaYtelse && (
        <TextAreaField
          name="begrunnelse"
          label={{ id: 'PersonArbeidsforholdDetailForm.Begrunnelse' }}
          validate={[required, minLength(3), maxLength(400), hasValidText]}
          maxLength={400}
          readOnly={readOnly}
        />
      )}
    </BehandlingFormFieldCleaner>
  </>
);

ArbeidsforholdBegrunnelse.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  formName: PropTypes.string.isRequired,
  isDirty: PropTypes.bool.isRequired,
  harBegrunnelse: PropTypes.bool.isRequired,
  skalAvslaaYtelse: PropTypes.bool.isRequired,
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
};

const mapStateToProps = (state, initialProps) => {
  const { formName, behandlingId, behandlingVersjon } = initialProps;
  const aktivtArbeidsforholdHandlingValue = behandlingFormValueSelector(formName, behandlingId, behandlingVersjon)(state, 'aktivtArbeidsforholdHandlingField');
  return {
    isDirty: isBehandlingFormDirty(formName, behandlingId, behandlingVersjon)(state),
    harBegrunnelse: !!behandlingFormValueSelector(formName, behandlingId, behandlingVersjon)(state, 'begrunnelse'),
    skalAvslaaYtelse: aktivtArbeidsforholdHandlingValue === aktivtArbeidsforholdHandling.AVSLA_YTELSE,
  };
};

export default connect(mapStateToProps)(ArbeidsforholdBegrunnelse);

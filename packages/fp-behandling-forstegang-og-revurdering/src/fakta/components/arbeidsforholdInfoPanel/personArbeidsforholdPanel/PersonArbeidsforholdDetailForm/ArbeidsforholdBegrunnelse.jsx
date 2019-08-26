import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import aktivtArbeidsforholdHandling from '@fpsak-frontend/kodeverk/src/aktivtArbeidsforholdHandling';
import {
  behandlingFormValueSelector,
  isBehandlingFormDirty,
} from 'behandlingForstegangOgRevurdering/src/behandlingFormForstegangOgRevurdering';
import {
 minLength, maxLength, required, hasValidText,
} from '@fpsak-frontend/utils';
import TextAreaField from '@fpsak-frontend/form/src/TextAreaField';
import BehandlingFormFieldCleaner from 'behandlingForstegangOgRevurdering/src/components/BehandlingFormFieldCleaner';

/**
 * ArbeidsforholdBegrunnelse er ansvarlig for å vise begrunnelsesfeltet.
 */
export const ArbeidsforholdBegrunnelse = ({
  readOnly,
  formName,
  isDirty,
  harBegrunnelse,
  skalAvslaaYtelse,
}) => (
  <React.Fragment>
    <BehandlingFormFieldCleaner formName={formName} fieldNames={['begrunnelse']}>
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
  </React.Fragment>
);

ArbeidsforholdBegrunnelse.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  formName: PropTypes.string.isRequired,
  isDirty: PropTypes.bool.isRequired,
  harBegrunnelse: PropTypes.bool.isRequired,
  skalAvslaaYtelse: PropTypes.bool.isRequired,
};

const mapStateToProps = (state, initialProps) => {
  const aktivtArbeidsforholdHandlingValue = behandlingFormValueSelector(initialProps.formName)(state, 'aktivtArbeidsforholdHandlingField');
  return {
    isDirty: isBehandlingFormDirty(initialProps.formName)(state),
    harBegrunnelse: !!behandlingFormValueSelector(initialProps.formName)(state, 'begrunnelse'),
    skalAvslaaYtelse: aktivtArbeidsforholdHandlingValue === aktivtArbeidsforholdHandling.AVSLA_YTELSE,
  };
};

export default connect(mapStateToProps)(ArbeidsforholdBegrunnelse);

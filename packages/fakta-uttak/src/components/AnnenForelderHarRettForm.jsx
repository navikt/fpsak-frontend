import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { createSelector } from 'reselect';
import {
  hasValidText, maxLength, minLength, required,
} from '@fpsak-frontend/utils';
import { AksjonspunktHelpTextTemp, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { RadioGroupField, RadioOption, TextAreaField } from '@fpsak-frontend/form';
import { aksjonspunktPropType } from '@fpsak-frontend/prop-types';
import { behandlingForm, FaktaSubmitButton } from '@fpsak-frontend/fp-felles';

import styles from './annenForelderHarRettForm.less';

const minLength3 = minLength(3);
const maxLength4000 = maxLength(4000);

export const AnnenForelderHarRettForm = ({
  hasOpenAksjonspunkter,
  hasOpenUttakAksjonspunkter,
  aksjonspunkter,
  behandlingId,
  behandlingVersjon,
  readOnly,
  ...formProps
}) => (
  <div className={hasOpenAksjonspunkter || !hasOpenUttakAksjonspunkter ? styles.solvedAksjonspunkt : styles.inactiveAksjonspunkt}>
    <form onSubmit={formProps.handleSubmit}>
      {!readOnly && (
      <AksjonspunktHelpTextTemp isAksjonspunktOpen={hasOpenAksjonspunkter}>
        {aksjonspunkter.map((ap) => (
          <FormattedMessage
            key={`UttakInfoPanel.Aksjonspunkt.${ap.definisjon.kode}`}
            id={`UttakInfoPanel.Aksjonspunkt.${ap.definisjon.kode}`}
          />
        ))}
      </AksjonspunktHelpTextTemp>
      )}
      <VerticalSpacer twentyPx />
      <div className={styles.fauxColumn}>
        <RadioGroupField name="annenForelderHarRett" validate={[required]} readOnly={readOnly} isEdited={!hasOpenAksjonspunkter}>
          <RadioOption value label={{ id: 'UttakInfoPanel.AnnenForelderHarRett' }} />
          <RadioOption value={false} label={{ id: 'UttakInfoPanel.AnnenForelderHarIkkeRett' }} />
        </RadioGroupField>

        <div className={styles.textAreaStyle}>
          <TextAreaField
            name="begrunnelse"
            readOnly={readOnly}
            label={{ id: 'UttakInfoPanel.BegrunnEndringene' }}
            validate={[required, minLength3, maxLength4000, hasValidText]}
            maxLength={4000}
          />
        </div>
        <FaktaSubmitButton
          formName={formProps.form}
          isSubmittable={!readOnly}
          isReadOnly={readOnly}
          hasOpenAksjonspunkter={hasOpenAksjonspunkter}
          behandlingId={behandlingId}
          behandlingVersjon={behandlingVersjon}
        />
      </div>
      {formProps.error
          && (
            <span>
              {formProps.error}
            </span>
          )}
    </form>
  </div>
);


const transformValues = (values, aksjonspunkter) => aksjonspunkter.map((ap) => ({
  kode: ap.definisjon.kode,
  begrunnelse: values.begrunnelse,
  annenforelderHarRett: values.annenForelderHarRett,
}));

const buildInitialValues = createSelector([(props) => props.ytelsefordeling], (ytelseFordeling) => {
  const annenForelderHarRett = ytelseFordeling && ytelseFordeling.annenforelderHarRettDto;
  if (ytelseFordeling) {
    return ({
      annenForelderHarRett: annenForelderHarRett ? annenForelderHarRett.annenforelderHarRett : undefined,
      begrunnelse: annenForelderHarRett ? annenForelderHarRett.begrunnelse : undefined,
    });
  }

  return undefined;
});

const mapStateToPropsFactory = (_initialState, initialProps) => {
  const onSubmit = (values) => initialProps.submitCallback(transformValues(values, initialProps.aksjonspunkter));

  return (_state, props) => ({
    initialValues: buildInitialValues(props),
    onSubmit,
  });
};

AnnenForelderHarRettForm.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  hasOpenAksjonspunkter: PropTypes.bool.isRequired,
  hasOpenUttakAksjonspunkter: PropTypes.bool.isRequired,
  aksjonspunkter: PropTypes.arrayOf(aksjonspunktPropType.isRequired).isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  behandlingId: PropTypes.number.isRequired,
};

export default connect(mapStateToPropsFactory)(behandlingForm({
  form: 'AnnenForelderHarRettForm',
  enableReinitialize: true,
})(AnnenForelderHarRettForm));

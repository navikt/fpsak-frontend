import React from 'react';
import PropTypes from 'prop-types';
import { FieldArray, FormSection } from 'redux-form';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Fieldset } from 'nav-frontend-skjema';
import { Undertekst } from 'nav-frontend-typografi';

import { ArrowBox, BorderBox, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { required } from '@fpsak-frontend/utils';
import { RadioGroupField, RadioOption } from '@fpsak-frontend/form';

import FrilansPerioderFieldArray from './FrilansPerioderFieldArray';
import FrilansOppdragForFamiliePanel from './FrilansOppdragForFamiliePanel';

export const FRILANS_FORM_NAME_PREFIX = 'frilans';

/**
 * FrilansPanel
 *
 * Presentasjonskomponent.
 */
const FrilansPanelImpl = ({
  intl,
  readOnly,
  formName,
}) => (
  <FormSection name={FRILANS_FORM_NAME_PREFIX}>
    <BorderBox>
      <Fieldset legend={intl.formatMessage({ id: 'Registrering.Frilans.Title' })}>
        <Undertekst><FormattedMessage id="Registrering.Frilans.HarFrilansvirksomhet" /></Undertekst>
        <VerticalSpacer eightPx />
        <RadioGroupField
          name="harSokerPeriodeMedFrilans"
          validate={[required]}
          direction="vertical"
          readOnly={readOnly}
        >
          <RadioOption label={intl.formatMessage({ id: 'Registrering.Frilans.No' })} value={false} />
          <RadioOption label={intl.formatMessage({ id: 'Registrering.Frilans.Yes' })} value>
            <ArrowBox>
              <Undertekst><FormattedMessage id="Registrering.Frilans.OppgiPeriode" /></Undertekst>
              <VerticalSpacer eightPx />
              <FieldArray name="perioder" component={FrilansPerioderFieldArray} readOnly={readOnly} />
              <VerticalSpacer space={4} />
              <RadioGroupField
                name="erNyoppstartetFrilanser"
                readOnly={readOnly}
                label={<FormattedMessage id="Registrering.Frilans.ErNyoppstartedFrilanser" />}
              >
                <RadioOption label={intl.formatMessage({ id: 'Registrering.Frilans.Yes' })} value />
                <RadioOption label={intl.formatMessage({ id: 'Registrering.Frilans.No' })} value={false} />
              </RadioGroupField>
              <VerticalSpacer space={4} />
              <RadioGroupField
                name="harInntektFraFosterhjem"
                readOnly={readOnly}
                label={<FormattedMessage id="Registrering.Frilans.HarInntektFraForsterhjem" />}
              >
                <RadioOption label={intl.formatMessage({ id: 'Registrering.Frilans.Yes' })} value />
                <RadioOption label={intl.formatMessage({ id: 'Registrering.Frilans.No' })} value={false} />
              </RadioGroupField>
              <FrilansOppdragForFamiliePanel readOnly={readOnly} formName={formName} namePrefix={FRILANS_FORM_NAME_PREFIX} />
            </ArrowBox>
          </RadioOption>
        </RadioGroupField>
      </Fieldset>
    </BorderBox>
  </FormSection>
);

FrilansPanelImpl.propTypes = {
  intl: PropTypes.shape().isRequired,
  readOnly: PropTypes.bool.isRequired,
  formName: PropTypes.string.isRequired,
};

const FrilansPanel = injectIntl(FrilansPanelImpl);

FrilansPanel.buildInitialValues = () => ({
  [FRILANS_FORM_NAME_PREFIX]: {
    ...FrilansOppdragForFamiliePanel.buildInitialValues(),
    perioder: [{
      periodeFom: '',
      periodeTom: '',
    }],
  },
});

FrilansPanel.validate = (values) => {
  if (!values[FRILANS_FORM_NAME_PREFIX]) {
    return null;
  }
  const errors = {
    [FRILANS_FORM_NAME_PREFIX]: {
      ...FrilansOppdragForFamiliePanel.validate(values[FRILANS_FORM_NAME_PREFIX]),
      perioder: FrilansPerioderFieldArray.validate(values[FRILANS_FORM_NAME_PREFIX].perioder),
    },
  };
  return errors;
};

export default FrilansPanel;

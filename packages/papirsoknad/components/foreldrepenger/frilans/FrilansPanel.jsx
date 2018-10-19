import React from 'react';
import PropTypes from 'prop-types';
import { FormSection, FieldArray } from 'redux-form';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import { Fieldset } from 'nav-frontend-skjema';
import { Normaltekst, Undertekst } from 'nav-frontend-typografi';

import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import ArrowBox from 'sharedComponents/ArrowBox';
import BorderBox from 'sharedComponents/BorderBox';
import { required } from 'utils/validation/validators';
import { RadioGroupField, RadioOption } from 'form/Fields';
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
        <Normaltekst><FormattedMessage id="Registrering.Frilans.HarFrilansvirksomhet" /></Normaltekst>
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
  intl: intlShape.isRequired,
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
  const errors = {
    [FRILANS_FORM_NAME_PREFIX]: {
      ...FrilansOppdragForFamiliePanel.validate(values[FRILANS_FORM_NAME_PREFIX]),
      perioder: FrilansPerioderFieldArray.validate(values[FRILANS_FORM_NAME_PREFIX].perioder),
    },
  };
  return errors;
};

export default FrilansPanel;

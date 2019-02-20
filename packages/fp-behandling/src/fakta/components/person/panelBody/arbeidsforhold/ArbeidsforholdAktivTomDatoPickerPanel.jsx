import React from 'react';
import PropTypes from 'prop-types';
import { ArrowBox } from '@fpsak-frontend/shared-components';
import { dateAfterOrEqual, hasValidDate, required } from '@fpsak-frontend/utils';
import DatepickerField from '@fpsak-frontend/form/src/DatepickerField';
import { FormattedMessage } from 'react-intl';

const customErrorMessage = fomDato => ([{ id: 'PersonArbeidsforholdDetailForm.DateNotAfterOrEqual' }, { fomDato }]);

const ArbeidsforholdAktivTomDatoPickerPanel = ({ readOnly, fomDato }) => (
  <ArrowBox alignOffset={0}>
    <DatepickerField
      name="overstyrtTom"
      label={<FormattedMessage id="PersonArbeidsforholdDetailForm.ArbeidsforholdetAktivTomDato" />}
      validate={[required, hasValidDate, dateAfterOrEqual(fomDato, customErrorMessage)]}
      readOnly={readOnly}
    />
  </ArrowBox>
);

ArbeidsforholdAktivTomDatoPickerPanel.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  fomDato: PropTypes.string.isRequired,
};

export default ArbeidsforholdAktivTomDatoPickerPanel;

import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { RadioGroupField, RadioOption } from 'form/Fields';

import { required } from 'utils/validation/validators';
import { Fieldset } from 'nav-frontend-skjema';
import BorderBox from 'sharedComponents/BorderBox';
import styles from './dekningsgradPanel.less';

/**
 *
 *
 * Presentasjonskomponent. Komponenten vises som del av skjermbildet for registrering av papirsøknad dersom søknad gjelder foreldrepenger.
 */
export const DekningsgradPanel = ({
  intl,
  readOnly,
}) => (
  <BorderBox>
    <Fieldset className={styles.fullWidth} legend={intl.formatMessage({ id: 'Registrering.Dekningsgrad.Title' })}>
      <RadioGroupField name="dekningsgrad" readOnly={readOnly} validate={[required]}>
        <RadioOption label={intl.formatMessage({ id: 'Registrering.Dekningsgrad.prosent.80' })} value="80_PROSENT" />
        <RadioOption label={intl.formatMessage({ id: 'Registrering.Dekningsgrad.prosent.100' })} value="100_PROSENT" />
      </RadioGroupField>
    </Fieldset>
  </BorderBox>
);

DekningsgradPanel.propTypes = {
  intl: intlShape.isRequired,
  readOnly: PropTypes.bool.isRequired,
};

export default injectIntl(DekningsgradPanel);

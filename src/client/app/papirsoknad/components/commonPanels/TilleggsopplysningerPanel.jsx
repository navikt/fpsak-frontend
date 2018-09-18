import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { Fieldset } from 'nav-frontend-skjema';

import BorderBox from 'sharedComponents/BorderBox';
import { TextAreaField } from 'form/Fields';
import { maxLength as maxLengthValidator, hasValidText } from 'utils/validation/validators';

import styles from './tilleggsopplysningerPanel.less';

const maxLength = 1500;
const validate = [maxLengthValidator(maxLength), hasValidText];

/**
 * s
 *
 * Presentasjonskomponent. Komponenten vises som del av skjermbildet for registrering av papirsøknad dersom søknad gjelder engangsstønad.
 * Komponenten har inputfelter og må derfor rendres som etterkommer av komponent dekorert med reduxForm.
 */
export const TilleggsopplysningerPanel = ({
  readOnly,
  intl,
}) => (
  <BorderBox>
    <div className={styles.flexContainer}>
      <Fieldset legend={intl.formatMessage({ id: 'Registrering.SokerensTilleggsopplysninger' })}>
        <TextAreaField
          name="tilleggsopplysninger"
          label=""
          textareaClass={styles.textAreaSettings}
          maxLength={maxLength}
          validate={validate}
          readOnly={readOnly}
        />
      </Fieldset>
    </div>
  </BorderBox>
);

TilleggsopplysningerPanel.propTypes = {
  intl: intlShape.isRequired,
  readOnly: PropTypes.bool.isRequired,
};

export default injectIntl(TilleggsopplysningerPanel);

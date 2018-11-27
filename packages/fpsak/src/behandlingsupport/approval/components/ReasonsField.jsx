import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage, intlShape } from 'react-intl';
import { Undertekst } from 'nav-frontend-typografi';

import { NavFieldGroup, CheckboxField, TextAreaField } from 'form/Fields';
import {
  required, minLength, maxLength, hasValidText,
} from 'utils/validation/validators';

import styles from './ReasonsField.less';

const minLength3 = minLength(3);
const maxLength2000 = maxLength(2000);

/*
 * ReasonsField
 *
 * Presentasjonskomponent. Holds the form of reasons the manager sends his thoughts back to the saksbehandler
 *
 * Eksempel:
 * ```html
 * <ReasonsField fieldName={fieldName} showOnlyBegrunnelse={showBegrunnelse} />
 * ```
 */
const ReasonsField = ({ fieldName, showOnlyBegrunnelse, intl }) => (
  <div>
    <div className={styles.arrowBox}>
      {!showOnlyBegrunnelse
        && (
        <div className={styles.flexContainer}>
          <div className={styles.fullColumn}>
            <Undertekst className="blokk-xs"><FormattedMessage id="InfoPanel.Arsak" /></Undertekst>
          </div>
          <NavFieldGroup className={styles.fullWidth} errorMessageName={`${fieldName}.missingArsakError`}>
            <div className={styles.flexContainer}>
              <div className={styles.halfColumn}>
                <CheckboxField
                  name={`${fieldName}.feilFakta`}
                  label={intl.formatMessage({ id: 'InfoPanel.FeilFakta' })}
                />
                <CheckboxField
                  name={`${fieldName}.feilRegel`}
                  label={intl.formatMessage({ id: 'InfoPanel.FeilRegelForstaelse' })}
                />
              </div>
              <div className={styles.halfColumn}>
                <CheckboxField
                  name={`${fieldName}.feilLov`}
                  label={intl.formatMessage({ id: 'InfoPanel.FeilLovanvendelse' })}
                />
                <CheckboxField
                  name={`${fieldName}.annet`}
                  label={intl.formatMessage({ id: 'InfoPanel.Annet' })}
                />
              </div>
            </div>
          </NavFieldGroup>
        </div>
        )
      }
      <TextAreaField
        name={`${fieldName}.besluttersBegrunnelse`}
        label={intl.formatMessage({ id: 'InfoPanel.Begrunnelse' })}
        validate={[required, minLength3, maxLength2000, hasValidText]}
      />
    </div>
  </div>
);

ReasonsField.propTypes = {
  fieldName: PropTypes.string.isRequired,
  showOnlyBegrunnelse: PropTypes.bool.isRequired,
  intl: intlShape.isRequired,
};


export default injectIntl(ReasonsField);

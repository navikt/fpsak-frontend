import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage, intlShape } from 'react-intl';
import { Undertekst } from 'nav-frontend-typografi';
import {
  ArrowBox, FlexContainer, FlexColumn, FlexRow,
} from '@fpsak-frontend/shared-components';
import { NavFieldGroup, CheckboxField, TextAreaField } from '@fpsak-frontend/form';
import {
  required, minLength, maxLength, hasValidText,
} from '@fpsak-frontend/utils';

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
  <React.Fragment>
    <ArrowBox alignOffset={110}>
      {!showOnlyBegrunnelse
        && (
        <FlexContainer fluid wrap>
          <FlexRow>
            <FlexColumn>
              <Undertekst className="blokk-xs"><FormattedMessage id="InfoPanel.Arsak" /></Undertekst>
            </FlexColumn>
          </FlexRow>
          <FlexRow>
            <NavFieldGroup className={styles.fullWidth} errorMessageName={`${fieldName}.missingArsakError`}>
              <FlexRow>
                <FlexColumn className={styles.halfColumn}>
                  <CheckboxField
                    name={`${fieldName}.feilFakta`}
                    label={intl.formatMessage({ id: 'InfoPanel.FeilFakta' })}
                  />
                  <CheckboxField
                    name={`${fieldName}.feilRegel`}
                    label={intl.formatMessage({ id: 'InfoPanel.FeilRegelForstaelse' })}
                  />
                </FlexColumn>
                <FlexColumn className={styles.halfColumn}>
                  <CheckboxField
                    name={`${fieldName}.feilLov`}
                    label={intl.formatMessage({ id: 'InfoPanel.FeilLovanvendelse' })}
                  />
                  <CheckboxField
                    name={`${fieldName}.annet`}
                    label={intl.formatMessage({ id: 'InfoPanel.Annet' })}
                  />
                </FlexColumn>
              </FlexRow>
            </NavFieldGroup>
          </FlexRow>
        </FlexContainer>
        )
      }
      <TextAreaField
        name={`${fieldName}.besluttersBegrunnelse`}
        label={intl.formatMessage({ id: 'InfoPanel.Begrunnelse' })}
        validate={[required, minLength3, maxLength2000, hasValidText]}
      />

    </ArrowBox>
  </React.Fragment>
);

ReasonsField.propTypes = {
  fieldName: PropTypes.string.isRequired,
  showOnlyBegrunnelse: PropTypes.bool.isRequired,
  intl: intlShape.isRequired,
};


export default injectIntl(ReasonsField);

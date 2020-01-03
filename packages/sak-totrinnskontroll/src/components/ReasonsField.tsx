import React from 'react';
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';
import { Undertekst } from 'nav-frontend-typografi';

import {
  ArrowBox, FlexColumn, FlexContainer, FlexRow,
} from '@fpsak-frontend/shared-components';
import { CheckboxField, NavFieldGroup, TextAreaField } from '@fpsak-frontend/form';
import {
  hasValidText, maxLength, minLength, required,
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
const ReasonsField = ({
  fieldName, godkjentHosKA, showOnlyBegrunnelse, intl,
}: ReasonsFieldProps) => (
  <>
    <ArrowBox alignOffset={godkjentHosKA ? 1 : 110}>
      {!showOnlyBegrunnelse && (
        <FlexContainer fluid wrap>
          <FlexRow>
            <FlexColumn>
              <Undertekst className="blokk-xs">
                <FormattedMessage id="ReasonsField.Arsak" />
              </Undertekst>
            </FlexColumn>
          </FlexRow>
          <FlexRow>
            <NavFieldGroup className={styles.fullWidth} errorMessageName={`${fieldName}.missingArsakError`}>
              <FlexRow>
                <FlexColumn className={styles.halfColumn}>
                  <CheckboxField
                    name={`${fieldName}.feilFakta`}
                    label={intl.formatMessage({ id: 'ReasonsField.FeilFakta' })}
                  />
                  <CheckboxField
                    name={`${fieldName}.feilRegel`}
                    label={intl.formatMessage({ id: 'ReasonsField.FeilRegelForstaelse' })}
                  />
                </FlexColumn>
                <FlexColumn className={styles.halfColumn}>
                  <CheckboxField
                    name={`${fieldName}.feilLov`}
                    label={intl.formatMessage({ id: 'ReasonsField.FeilLovanvendelse' })}
                  />
                  <CheckboxField name={`${fieldName}.annet`} label={intl.formatMessage({ id: 'ReasonsField.Annet' })} />
                </FlexColumn>
              </FlexRow>
            </NavFieldGroup>
          </FlexRow>
        </FlexContainer>
      )}
      <TextAreaField
        name={`${fieldName}.besluttersBegrunnelse`}
        label={intl.formatMessage({ id: 'ReasonsField.Begrunnelse' })}
        validate={[required, minLength3, maxLength2000, hasValidText]}
      />
    </ArrowBox>
  </>
);

interface ReasonsFieldProps {
  fieldName: string;
  showOnlyBegrunnelse: boolean;
  godkjentHosKA: boolean;
  intl: IntlShape;
}

export default injectIntl(ReasonsField);

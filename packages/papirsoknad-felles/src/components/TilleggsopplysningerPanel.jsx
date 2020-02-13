import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { SkjemaGruppe } from 'nav-frontend-skjema';

import {
  BorderBox, FlexColumn, FlexContainer, FlexRow,
} from '@fpsak-frontend/shared-components';
import { RadioGroupField, RadioOption, TextAreaField } from '@fpsak-frontend/form';
import { hasValidText, maxLength as maxLengthValidator, required } from '@fpsak-frontend/utils';

import styles from './tilleggsopplysningerPanel.less';

const maxLength = 1500;
const validate = [maxLengthValidator(maxLength), hasValidText];

const sprakvalg = {
  BOKMAL: 'NB',
  NYNORSK: 'NN',
  ENGELSK: 'EN',
};

/**
 * Presentasjonskomponent. Komponenten vises som del av skjermbildet for registrering av papirsøknad dersom søknad gjelder engangsstønad.
 * Komponenten har inputfelter og må derfor rendres som etterkommer av komponent dekorert med reduxForm.
 */

export const TilleggsopplysningerPanel = ({
  readOnly,
  intl,
}) => (
  <BorderBox>
    <FlexContainer>
      <FlexRow>
        <FlexColumn className={styles.halfWidth}>
          <SkjemaGruppe legend={intl.formatMessage({ id: 'Registrering.SokerensTilleggsopplysninger' })}>
            <TextAreaField
              name="tilleggsopplysninger"
              label=""
              maxLength={maxLength}
              validate={validate}
              readOnly={readOnly}
            />
          </SkjemaGruppe>
        </FlexColumn>
        <FlexColumn>
          <SkjemaGruppe legend={intl.formatMessage({ id: 'Registrering.Sprak' })}>
            <RadioGroupField
              name="språkkode"
              direction="vertical"
              readOnly={readOnly}
              validate={required}
            >
              <RadioOption
                label={intl.formatMessage({ id: 'Registrering.Sprak.Bokmal' })}
                value={sprakvalg.BOKMAL}
              />
              <RadioOption
                label={intl.formatMessage({ id: 'Registrering.Sprak.Nynorsk' })}
                value={sprakvalg.NYNORSK}
              />
              <RadioOption
                label={intl.formatMessage({ id: 'Registrering.Sprak.Engelsk' })}
                value={sprakvalg.ENGELSK}
              />
            </RadioGroupField>
          </SkjemaGruppe>
        </FlexColumn>
      </FlexRow>
    </FlexContainer>
  </BorderBox>
);

TilleggsopplysningerPanel.propTypes = {
  intl: PropTypes.shape().isRequired,
  readOnly: PropTypes.bool.isRequired,
};

export default injectIntl(TilleggsopplysningerPanel);

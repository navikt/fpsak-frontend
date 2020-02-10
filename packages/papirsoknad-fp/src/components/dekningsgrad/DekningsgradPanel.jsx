import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { SkjemaGruppe } from 'nav-frontend-skjema';

import { RadioGroupField, RadioOption } from '@fpsak-frontend/form';
import { required } from '@fpsak-frontend/utils';
import { BorderBox } from '@fpsak-frontend/shared-components';

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
    <SkjemaGruppe className={styles.fullWidth} legend={intl.formatMessage({ id: 'Registrering.Dekningsgrad.Title' })}>
      <RadioGroupField name="dekningsgrad" readOnly={readOnly} validate={[required]}>
        <RadioOption label={intl.formatMessage({ id: 'Registrering.Dekningsgrad.prosent.80' })} value="80_PROSENT" />
        <RadioOption label={intl.formatMessage({ id: 'Registrering.Dekningsgrad.prosent.100' })} value="100_PROSENT" />
      </RadioGroupField>
    </SkjemaGruppe>
  </BorderBox>
);

DekningsgradPanel.propTypes = {
  intl: PropTypes.shape().isRequired,
  readOnly: PropTypes.bool.isRequired,
};

export default injectIntl(DekningsgradPanel);

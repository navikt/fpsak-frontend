import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Fieldset } from 'nav-frontend-skjema';

import { RadioGroupField, RadioOption } from '@fpsak-frontend/form';
import { BorderBox } from '@fpsak-frontend/shared-components';
import { required } from '@fpsak-frontend/utils';

/*
 * MigreringFraInfotrygdPanel
 *
 * Form som brukes for registrere om behandling er migrert fra Infotrygd.
 */
const MigreringFraInfotrygdPanel = ({
  readOnly,
  intl,
}) => (
  <BorderBox>
    <Fieldset legend={intl.formatMessage({ id: 'MigreringFraInfotrygdPanel.Migrering' })}>
      <RadioGroupField
        name="migrertFraInfotrygd"
        label={intl.formatMessage({ id: 'MigreringFraInfotrygdPanel.ErDenneSakenMigrert' })}
        validate={[required]}
        readOnly={readOnly}
      >
        <RadioOption value label={{ id: 'MigreringFraInfotrygdPanel.Ja' }} />
        <RadioOption value={false} label={{ id: 'MigreringFraInfotrygdPanel.Nei' }} />
      </RadioGroupField>
    </Fieldset>
  </BorderBox>
);

MigreringFraInfotrygdPanel.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  intl: PropTypes.shape().isRequired,
};

export default injectIntl(MigreringFraInfotrygdPanel);

import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Undertekst } from 'nav-frontend-typografi';

import { RadioGroupField, RadioOption } from '@fpsak-frontend/form';
import { required } from '@fpsak-frontend/utils';
import { ElementWrapper, VerticalSpacer } from '@fpsak-frontend/shared-components';

/**
 * AndreYtelserPanel
 *
 * Presentasjonskomponent. Komponenten vises som del av skjermbildet for registrering av papirsøknad dersom søknad gjelder foreldrepenger.
 */
export const PermisjonRettigheterPanel = ({
  intl,
  readOnly,
  sokerHarAleneomsorg,
}) => (
  <ElementWrapper>
    <Undertekst>
      {intl.formatMessage({ id: 'Registrering.Permisjon.SøkerHarAleneomsorg' })}
    </Undertekst>
    <VerticalSpacer eightPx />
    <RadioGroupField validate={[required]} readOnly={readOnly} name="sokerHarAleneomsorg">
      <RadioOption
        label={intl.formatMessage({ id: 'Registrering.Permisjon.SøkerHarAleneomsorg.Yes' })}
        value
      />
      <RadioOption
        label={intl.formatMessage({ id: 'Registrering.Permisjon.SøkerHarAleneomsorg.No' })}
        value={false}
      />
    </RadioGroupField>
    {sokerHarAleneomsorg === false && (
      <div>
        <Undertekst>
          {intl.formatMessage({ id: 'Registrering.Permisjon.HarRettPaForeldrepenger' })}
        </Undertekst>
        <VerticalSpacer eightPx />
        <RadioGroupField name="denAndreForelderenHarRettPaForeldrepenger" validate={[required]} readOnly={readOnly}>
          <RadioOption label={intl.formatMessage({ id: 'Registrering.Permisjon.HarRettPaForeldrepenger.Yes' })} value />
          <RadioOption label={intl.formatMessage({ id: 'Registrering.Permisjon.HarRettPaForeldrepenger.No' })} value={false} />
        </RadioGroupField>
      </div>
    )}
  </ElementWrapper>
);


PermisjonRettigheterPanel.propTypes = {
  intl: PropTypes.shape().isRequired,
  readOnly: PropTypes.bool.isRequired,
  sokerHarAleneomsorg: PropTypes.bool,
};

PermisjonRettigheterPanel.defaultProps = {
  sokerHarAleneomsorg: undefined,
};

export default injectIntl(PermisjonRettigheterPanel);

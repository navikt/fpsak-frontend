import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { Undertekst } from 'nav-frontend-typografi';

import { RadioGroupField, RadioOption } from 'form/Fields';
import { required } from 'utils/validation/validators';
import ElementWrapper from 'sharedComponents/ElementWrapper';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';

/**
 * AndreYtelserPanel
 *
 * Presentasjonskomponent. Komponenten vises som del av skjermbildet for registrering av papirsøknad dersom søknad gjelder foreldrepenger.
 */
export const PermisjonRettigheterPanel = ({
  intl,
  readOnly,
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
    <Undertekst>
      {intl.formatMessage({ id: 'Registrering.Permisjon.HarRettPaForeldrepenger' })}
    </Undertekst>
    <VerticalSpacer eightPx />
    <RadioGroupField name="denAndreForelderenHarRettPaForeldrepenger" validate={[required]} readOnly={readOnly}>
      <RadioOption label={intl.formatMessage({ id: 'Registrering.Permisjon.HarRettPaForeldrepenger.Yes' })} value />
      <RadioOption label={intl.formatMessage({ id: 'Registrering.Permisjon.HarRettPaForeldrepenger.No' })} value={false} />
    </RadioGroupField>
  </ElementWrapper>
);


PermisjonRettigheterPanel.propTypes = {
  intl: intlShape.isRequired,
  readOnly: PropTypes.bool.isRequired,
};

export default injectIntl(PermisjonRettigheterPanel);

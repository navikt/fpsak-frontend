import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Undertekst, Undertittel } from 'nav-frontend-typografi';

import { BorderBox, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { DatepickerField } from '@fpsak-frontend/form';
import { dateBeforeOrEqualToToday, hasValidDate, required } from '@fpsak-frontend/utils';

/**
 * MottattDatoPanel
 *
 * Presentasjonskomponent. Komponenten vises som del av skjermbildet for registrering av papirsøknad.
 * Komponenten har inputfelter og må derfor rendres som etterkommer av komponent dekorert med reduxForm.
 */
const MottattDatoPanel = ({
  readOnly,
}) => (
  <BorderBox>
    <Undertittel><FormattedMessage key="regDatoTittel" id="Registrering.Omsoknaden.MottattDato" /></Undertittel>
    <VerticalSpacer sixteenPx />
    <Undertekst>
      <FormattedMessage key="regDatoUnder" id="Registrering.Omsoknaden.MottattDato" />
    </Undertekst>
    <DatepickerField
      name="mottattDato"
      validate={[required, hasValidDate, dateBeforeOrEqualToToday]}
      readOnly={readOnly}
    />
  </BorderBox>
);

MottattDatoPanel.propTypes = {
  readOnly: PropTypes.bool.isRequired,
};

export default MottattDatoPanel;

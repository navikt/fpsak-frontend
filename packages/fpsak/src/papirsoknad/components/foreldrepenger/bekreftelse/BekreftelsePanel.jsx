import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { RadioGroupField, RadioOption } from 'form/Fields';

import { required } from 'utils/validation/validators';
import BorderBox from 'sharedComponents/BorderBox';
import { Undertittel, Undertekst } from 'nav-frontend-typografi';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import ElementWrapper from 'sharedComponents/ElementWrapper';

/**
 *
 *
 * Presentasjonskomponent. Komponenten vises som del av skjermbildet for registrering av papirsøknad dersom søknad gjelder foreldrepenger.
 */
export const BekreftelsePanel = ({
  intl,
  readOnly,
  annenForelderInformertRequired,
}) => (
  <BorderBox>
    <ElementWrapper>
      <VerticalSpacer twentyPx />
      <Undertittel>{intl.formatMessage({ id: 'Registrering.TheOtherParent.Confirmation' })}</Undertittel>
      <VerticalSpacer eightPx />
      <Undertekst>{intl.formatMessage({ id: 'Registrering.TheOtherParent.OtherParentKnowPeriods' })}</Undertekst>
      <VerticalSpacer eightPx />
      <RadioGroupField name="annenForelderInformert" readOnly={readOnly} validate={annenForelderInformertRequired ? [required] : []}>
        <RadioOption label={{ id: 'Registrering.TheOtherParent.Yes' }} value />
        <RadioOption label={{ id: 'Registrering.TheOtherParent.No' }} value={false} />
      </RadioGroupField>
    </ElementWrapper>
  </BorderBox>
);

BekreftelsePanel.propTypes = {
  intl: intlShape.isRequired,
  readOnly: PropTypes.bool.isRequired,
  annenForelderInformertRequired: PropTypes.bool,
};

BekreftelsePanel.defaultProps = {
  annenForelderInformertRequired: false,
};

export default injectIntl(BekreftelsePanel);

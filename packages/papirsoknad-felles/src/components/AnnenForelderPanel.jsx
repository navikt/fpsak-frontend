import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { FormSection, formValueSelector } from 'redux-form';
import { Fieldset } from 'nav-frontend-skjema';

import kanIkkeOppgiAnnenForelderArsaker from '@fpsak-frontend/kodeverk/src/kanIkkeOppgiAnnenForelderArsak';
import {
  CheckboxField, InputField, NavFieldGroup, RadioGroupField, RadioOption, SelectField,
} from '@fpsak-frontend/form';
import {
  hasValidFodselsnummer, hasValidFodselsnummerFormat, hasValidName, required, sammeFodselsnummerSomSokerMessage,
} from '@fpsak-frontend/utils';
import { ArrowBox, BorderBox } from '@fpsak-frontend/shared-components';
import { kodeverkPropType } from '@fpsak-frontend/prop-types';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import landkoder from '@fpsak-frontend/kodeverk/src/landkoder';

const countrySelectValues = (countryCodes) => countryCodes
  .filter(({ kode }) => kode !== landkoder.NORGE)
  .map(({ kode, navn }) => <option value={kode} key={kode}>{navn}</option>);

/*
 * AnnenForelderForm
 *
 * Form som brukes vid registrering av annen forelder.
 */
export const KanIkkeOppgiBegrunnelsePanel = ({
  readOnly,
  kanIkkeOppgiBegrunnelse,
  formatMessage,
  countryCodes,
}) => (
  <NavFieldGroup title={formatMessage({ id: 'Registrering.TheOtherParent.CannotSpecifyOtherParent.Reason.Title' })}>
    <RadioGroupField name="arsak" columns={1} readOnly={readOnly}>
      <RadioOption label={{ id: 'Registrering.TheOtherParent.CannotSpecifyOtherParent.Reason.1' }} value={kanIkkeOppgiAnnenForelderArsaker.UKJENT_FORELDER} />
      <RadioOption label={{ id: 'Registrering.TheOtherParent.CannotSpecifyOtherParent.Reason.2' }} value={kanIkkeOppgiAnnenForelderArsaker.IKKE_NORSK_FNR} />
    </RadioGroupField>
    {kanIkkeOppgiBegrunnelse.arsak === kanIkkeOppgiAnnenForelderArsaker.IKKE_NORSK_FNR
    && (
      <>
        <SelectField
          name="land"
          label={formatMessage({ id: 'Registrering.TheOtherParent.CannotSpecifyOtherParent.Land' })}
          selectValues={countrySelectValues(countryCodes)}
          bredde="l"
          readOnly={readOnly}
        />
        <InputField
          name="utenlandskFoedselsnummer"
          label={formatMessage({ id: 'Registrering.TheOtherParent.CannotSpecifyOtherParent.UtenlandsFodselsnummer' })}
          bredde="S"
          readOnly={readOnly}
        />
      </>
    )}
  </NavFieldGroup>
);

KanIkkeOppgiBegrunnelsePanel.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  kanIkkeOppgiBegrunnelse: PropTypes.shape().isRequired,
  formatMessage: PropTypes.func.isRequired,
  countryCodes: PropTypes.arrayOf(PropTypes.shape({
    kode: PropTypes.string,
    navn: PropTypes.string,
  })).isRequired,
};

export const AnnenForelderPanelImpl = ({
  readOnly,
  intl,
  countryCodes,
  kanIkkeOppgiAnnenForelder,
  kanIkkeOppgiBegrunnelse,
  permisjonRettigheterPanel,
}) => {
  const { formatMessage } = intl;
  const sortedCountriesByName = countryCodes.slice().sort((a, b) => a.navn.localeCompare(b.navn));
  return (
    <BorderBox>
      <Fieldset legend={formatMessage({ id: 'Registrering.TheOtherParent.Title' })}>
        <InputField
          name="foedselsnummer"
          label={formatMessage({ id: 'Registrering.TheOtherParent.Fodselsnummer' })}
          bredde="S"
          parse={(value) => (value ? value.replace(/\s/g, '') : value)}
          readOnly={readOnly}
          disabled={kanIkkeOppgiAnnenForelder}
        />
        <CheckboxField
          name="kanIkkeOppgiAnnenForelder"
          label={formatMessage({ id: 'Registrering.TheOtherParent.CannotSpecifyOtherParent' })}
          readOnly={readOnly}
        />
        {kanIkkeOppgiAnnenForelder === true
        && (
          <ArrowBox>
            <FormSection name="kanIkkeOppgiBegrunnelse">
              <KanIkkeOppgiBegrunnelsePanel
                kanIkkeOppgiBegrunnelse={kanIkkeOppgiBegrunnelse}
                formatMessage={formatMessage}
                countryCodes={sortedCountriesByName}
                readOnly={readOnly}
              />
            </FormSection>
          </ArrowBox>
        )}
        {permisjonRettigheterPanel}
      </Fieldset>
    </BorderBox>
  );
};

AnnenForelderPanelImpl.propTypes = {
  intl: PropTypes.shape().isRequired,
  countryCodes: kodeverkPropType.isRequired,
  kanIkkeOppgiAnnenForelder: PropTypes.bool,
  kanIkkeOppgiBegrunnelse: PropTypes.shape(),
  readOnly: PropTypes.bool,
  permisjonRettigheterPanel: PropTypes.node,
};

AnnenForelderPanelImpl.defaultProps = {
  kanIkkeOppgiAnnenForelder: null,
  kanIkkeOppgiBegrunnelse: {},
  readOnly: true,
  permisjonRettigheterPanel: undefined,
};

const mapStateToProps = (state, initialProps) => ({
  countryCodes: initialProps.alleKodeverk[kodeverkTyper.LANDKODER],
  ...formValueSelector(initialProps.form)(state, initialProps.namePrefix),
});

const AnnenForelderPanel = connect(mapStateToProps)(injectIntl(AnnenForelderPanelImpl));

AnnenForelderPanel.validate = (sokerPersonnummer, values = {}) => {
  const errors = {};
  if (values.kanIkkeOppgiAnnenForelder) {
    const begrunnelse = values.kanIkkeOppgiBegrunnelse || {};
    errors.kanIkkeOppgiBegrunnelse = {};
    errors.kanIkkeOppgiBegrunnelse.arsak = required(begrunnelse.arsak);
  } else {
    errors.fornavn = required(values.fornavn) || hasValidName(values.fornavn);
    errors.etternavn = required(values.etternavn) || hasValidName(values.etternavn);
    errors.foedselsnummer = required(values.foedselsnummer)
      || hasValidFodselsnummerFormat(values.foedselsnummer)
      || hasValidFodselsnummer(values.foedselsnummer)
      || ((values.foedselsnummer === sokerPersonnummer) ? sammeFodselsnummerSomSokerMessage() : null);
  }
  return errors;
};

export default AnnenForelderPanel;

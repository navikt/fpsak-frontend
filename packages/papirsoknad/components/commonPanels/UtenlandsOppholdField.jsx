import React from 'react';
import PropTypes from 'prop-types';
import { FieldArray } from 'redux-form';
import classnames from 'classnames/bind';
import { Row, Column } from 'nav-frontend-grid';

import PeriodFieldArray from 'sharedComponents/PeriodFieldArray';
import { SelectField, DatepickerField } from 'form/Fields';
import { required, hasValidValue, hasValidPeriodIncludingOtherErrors } from 'utils/validation/validators';
import landkoder from 'kodeverk/landkoder';
import { isRequiredMessage } from 'utils/validation/messages';

import styles from './utenlandsOppholdField.less';

const classNames = classnames.bind(styles);

const defaultUtenlandsOpphold = {
  land: '',
  periodeFom: '',
  periodeTom: '',
};

const countrySelectValues = countryCodes => countryCodes
  .filter(({ kode }) => kode !== landkoder.NORGE)
  .map(({ kode, navn }) => <option value={kode} key={kode}>{navn}</option>);

const renderUtenlandsOppholdFieldArray = ({
  readOnly,
  fields,
  meta,
  selectValues,
}) => (
  <PeriodFieldArray
    fields={fields}
    meta={meta}
    titleTextCode="Registrering.RegistreringOpphold.AngiOpphold"
    textCode="Registrering.RegistreringOpphold.Add"
    emptyPeriodTemplate={defaultUtenlandsOpphold}
    createAddButtonInsteadOfImageLink
    readOnly={readOnly}
  >
    {(oppholdElementFieldId, index, getRemoveButton) => (
      <Row key={oppholdElementFieldId}>
        <Column xs="12">
          <SelectField
            name={`${oppholdElementFieldId}.land`}
            label={{ id: 'Registrering.RegistreringOpphold.Country' }}
            selectValues={selectValues}
            readOnly={readOnly}
            bredde="xl"
          />
        </Column>
        <Column xs="12">
          <Row className={classNames({ datesRowWithRemoveButton: index > 0 })}>
            <Column xs="12" sm="6">
              <DatepickerField
                name={`${oppholdElementFieldId}.periodeFom`}
                defaultValue={null}
                label={{ id: 'Registrering.RegistreringOpphold.periodeFom' }}
                readOnly={readOnly}
              />
            </Column>
            <Column xs="12" sm="6">
              <DatepickerField
                name={`${oppholdElementFieldId}.periodeTom`}
                defaultValue={null}
                label={{ id: 'Registrering.RegistreringOpphold.periodeTom' }}
                readOnly={readOnly}
              />
            </Column>
          </Row>
          {getRemoveButton()}
        </Column>
      </Row>
    )}
  </PeriodFieldArray>
);

renderUtenlandsOppholdFieldArray.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  fields: PropTypes.shape().isRequired,
  meta: PropTypes.shape().isRequired,
  selectValues: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

/**
 * UtenlandsOppholdField
 *
 * Presentasjonskomponent. Komponenten vises som del av skjermbildet for registrering av papirsøknad dersom søknad gjelder engangsstønad.
 * Komponenten lar saksbehandler legge inn informasjon om ett eller flere utenlandsopphold fra søknaden. Komponenten eksponerer valideringsregler
 * som lar seg tilpasse om opphold skal være fram eller tilbake i tid.
 * Komponenten har inputfelter og må derfor rendres som etterkommer av komponent dekorert med reduxForm.
 */
const UtenlandsOppholdField = ({
  readOnly,
  name,
  countryCodes,
}) => (
  <FieldArray
    name={name}
    component={renderUtenlandsOppholdFieldArray}
    selectValues={countrySelectValues(countryCodes)}
    readOnly={readOnly}
  />
);

UtenlandsOppholdField.propTypes = {
  name: PropTypes.string.isRequired,
  countryCodes: PropTypes.arrayOf(PropTypes.object).isRequired,
  readOnly: PropTypes.bool,
};

UtenlandsOppholdField.defaultProps = {
  readOnly: true,
};

UtenlandsOppholdField.validate = (values, options = {}) => {
  if (!values || !values.length) {
    return { _error: isRequiredMessage() };
  }
  const otherErrors = values.map(({ land }) => {
    const landError = required(land) || hasValidValue(land)(landkoder.NORGE);
    if (landError) {
      return {
        land: landError,
      };
    }
    return null;
  });

  return hasValidPeriodIncludingOtherErrors(values, otherErrors, options);
};

export default UtenlandsOppholdField;

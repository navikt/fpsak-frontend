import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { FieldArray, formValueSelector } from 'redux-form';
import { Fieldset } from 'nav-frontend-skjema';
import { Column, Container, Row } from 'nav-frontend-grid';
import { Undertekst } from 'nav-frontend-typografi';

import fht from '@fpsak-frontend/kodeverk/src/familieHendelseType';
import { BorderBox, VerticalSpacer } from '@fpsak-frontend/shared-components';
import {
  DatepickerField, InputField, RadioGroupField, RadioOption,
} from '@fpsak-frontend/form';
import {
  dateBeforeOrEqualToToday, hasValidDate, hasValidInteger, isDatesEqual, isRequiredMessage, maxValue, minValue, required,
} from '@fpsak-frontend/utils';

import { rettighet } from '../rettigheter/RettigheterPanel';

import styles from './omsorgOgAdopsjonPanel.less';

const MIN_ANTALL_BARN = 1;
const MAX_ANTALL_BARN = 10;

const adjustNumberOfFields = ({ fields, antallBarn }) => {
  const antallBarnVerdi = parseInt(antallBarn, 10) || 0;
  if (fields.length < Math.min(antallBarnVerdi, MAX_ANTALL_BARN)) {
    fields.push(null);
  } else if (fields.length > Math.max(antallBarnVerdi, 0)) {
    fields.pop();
  }
};

/**
 * OmsorgOgAdopsjonPanel
 *
 * Presentasjonskomponent. Komponenten vises som del av skjermbildet for registrering av papirsøknad ved adopsjon og omsorgsovertakelse.
 * Komponenten har inputfelter og må derfor rendres som etterkommer av komponent dekorert med reduxForm.
 */

export class FodselsDatoFields extends Component {
  UNSAFE_componentWillMount() {
    adjustNumberOfFields(this.props);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    adjustNumberOfFields(nextProps);
  }

  shouldComponentUpdate(nextProps) {
    if (Number.isNaN(nextProps.antallBarn)) {
      return true;
    }
    return nextProps.fields.length === nextProps.antallBarn;
  }

  render() {
    const { fields, readOnly } = this.props;
    return (
      <Row>
        <Column xs="6">
          {fields.map((name, index) => (
            <DatepickerField
              key={name}
              name={name}
              readOnly={readOnly}
              label={{ id: 'Registrering.Adopsjon.FodselsdatoBarnN', args: { n: index + 1 } }}
            />
          ))}
        </Column>
      </Row>
    );
  }
}

FodselsDatoFields.propTypes = {
  fields: PropTypes.shape().isRequired,
  antallBarn: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  readOnly: PropTypes.bool,
};

FodselsDatoFields.defaultProps = {
  readOnly: true,
  antallBarn: 0,
};

export const OmsorgOgAdopsjonPanelImpl = ({
  readOnly, intl, antallBarn, familieHendelseType, isForeldrepenger,
}) => {
  const { formatMessage } = intl;
  return (
    <BorderBox>
      <Fieldset legend={formatMessage({
        id: familieHendelseType === fht.ADOPSJON ? 'Registrering.Adopsjon.Title' : 'Registrering.Adopsjon.OmsorgTitle',
      })}
      >
        <Container fluid className={styles.formContainer}>
          {isForeldrepenger && familieHendelseType === fht.ADOPSJON
          && (
          <Row>
            <Column xs="6">
              <Undertekst>
                <FormattedMessage id="Registrering.Adopsjon.GjelderEktefellesBarn" />
              </Undertekst>
              <VerticalSpacer eightPx />
              <RadioGroupField
                name="erEktefellesBarn"
                readOnly={readOnly}
                validate={required}
              >
                <RadioOption
                  label={{ id: 'Registrering.Adopsjon.Ja' }}
                  value
                />
                <RadioOption
                  label={{ id: 'Registrering.Adopsjon.Nei' }}
                  value={false}
                />
              </RadioGroupField>
            </Column>
          </Row>
          )}
          <Row>
            <Column xs="6" className={styles.inputMinimumWidth}>
              <DatepickerField
                name="omsorgsovertakelsesdato"
                label={{
                  id: familieHendelseType === fht.ADOPSJON
                    ? 'Registrering.Adopsjon.DatoForOvertakelsenStebarn' : 'Registrering.Adopsjon.DatoForOvertakelsen',
                }}
                readOnly={readOnly}
                validate={[hasValidDate]}
              />
            </Column>
          </Row>
          <Row>
            {familieHendelseType === fht.ADOPSJON
              && (
              <Column xs="3" className={styles.inputMinimumWidth}>
                <DatepickerField
                  name="ankomstdato"
                  label={{ id: 'Registrering.Adopsjon.Ankomstdato' }}
                  readOnly={readOnly}
                  validate={[hasValidDate]}
                />
              </Column>
              )}
            <Column xs="6">
              <InputField
                name="antallBarn"
                label={formatMessage({ id: 'Registrering.Adopsjon.AntallBarn' })}
                readOnly={readOnly}
                parse={(value) => {
                  const parsedValue = parseInt(value, 10);
                  return Number.isNaN(parsedValue) ? value : parsedValue;
                }}
                bredde="XS"
              />
            </Column>
          </Row>
          <FieldArray
            name="foedselsDato"
            component={FodselsDatoFields}
            readOnly={readOnly}
            antallBarn={antallBarn}
          />
        </Container>
      </Fieldset>
    </BorderBox>
  );
};

OmsorgOgAdopsjonPanelImpl.propTypes = {
  intl: PropTypes.shape().isRequired,
  antallBarn: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  familieHendelseType: PropTypes.string.isRequired,
  readOnly: PropTypes.bool,
  isForeldrepenger: PropTypes.bool.isRequired,
};

OmsorgOgAdopsjonPanelImpl.defaultProps = {
  antallBarn: undefined,
  readOnly: true,
};

const mapStateToProps = (state, ownProps) => ({
  antallBarn: formValueSelector(ownProps.form)(state, ownProps.namePrefix).antallBarn,
  isForeldrepenger: ownProps.isForeldrepengerFagsak,
});

const OmsorgOgAdopsjonPanel = connect(mapStateToProps)(injectIntl(OmsorgOgAdopsjonPanelImpl));

const validateOmsorgsovertakelsesdato = (omsorgsovertakelsesdato, rettigheter) => (rettigheter === rettighet.ANNEN_FORELDER_DOED
  || rettigheter === rettighet.OVERTA_FORELDREANSVARET_ALENE
  ? required(omsorgsovertakelsesdato) || hasValidDate(omsorgsovertakelsesdato)
  : undefined);

const validateFoedselsdato = (foedselsDato, rettigheter) => {
  if (rettigheter && rettigheter !== rettighet.IKKE_RELEVANT) {
    if (!foedselsDato || !foedselsDato.length) {
      return { _errors: isRequiredMessage() };
    }
    const foedselsDatoError = foedselsDato.map((dato) => required(dato) || hasValidDate(dato) || dateBeforeOrEqualToToday(dato));
    if (foedselsDatoError.some((error) => error !== null)) {
      return foedselsDatoError;
    }
    return undefined;
  }
  if (foedselsDato) {
    const foedselsDatoError = foedselsDato.map((dato) => hasValidDate(dato) || dateBeforeOrEqualToToday(dato));
    if (foedselsDatoError.some((error) => error !== null)) {
      return foedselsDatoError;
    }
  }
  return undefined;
};

const validateIncludingRequired = (antallBarn) => required(antallBarn)
|| hasValidInteger(antallBarn) || minValue(MIN_ANTALL_BARN)(antallBarn) || maxValue(MAX_ANTALL_BARN)(antallBarn);

const validateExcludingRequired = (antallBarn) => {
  if (!antallBarn) {
    return undefined;
  }
  return hasValidInteger(antallBarn) || minValue(MIN_ANTALL_BARN)(antallBarn) || maxValue(MAX_ANTALL_BARN)(antallBarn);
};

const validateAntallBarn = (antallBarn, rettigheter) => (rettigheter && rettigheter !== rettighet.IKKE_RELEVANT
  ? validateIncludingRequired(antallBarn) : validateExcludingRequired(antallBarn));

const validateFodselsdatoer = (foedselsDato, otherFodselsdato) => {
  const hasFodselsdato1 = foedselsDato && foedselsDato.length > 0 && foedselsDato[0];
  const hasFodseldsato2 = otherFodselsdato && otherFodselsdato.length > 0 && otherFodselsdato[0];
  if (hasFodselsdato1 && hasFodseldsato2) {
    const datesError = isDatesEqual(foedselsDato[0], otherFodselsdato[0]);
    if (datesError) {
      return [datesError];
    }
  }
  return undefined;
};

OmsorgOgAdopsjonPanel.validate = (values, rettigheter, otherFodselsdato) => {
  const errors = {};
  if (!values) {
    return errors;
  }
  const { omsorgsovertakelsesdato, antallBarn, foedselsDato } = values;

  const omsorgsovertakelsesdatoError = validateOmsorgsovertakelsesdato(omsorgsovertakelsesdato, rettigheter);
  if (omsorgsovertakelsesdatoError) {
    errors.omsorgsovertakelsesdato = omsorgsovertakelsesdatoError;
  }
  const antallBarnError = validateAntallBarn(antallBarn, rettigheter);
  if (antallBarnError) {
    errors.antallBarn = antallBarnError;
  }
  const foedselsDatoError = validateFoedselsdato(foedselsDato, rettigheter);
  if (foedselsDatoError) {
    errors.foedselsDato = foedselsDatoError;
  }

  const fodselsdatoCrossValidationError = validateFodselsdatoer(foedselsDato, otherFodselsdato);
  if (fodselsdatoCrossValidationError) {
    errors.foedselsDato = fodselsdatoCrossValidationError;
  }

  return errors;
};

OmsorgOgAdopsjonPanel.initialValues = {
  antallBarn: undefined,
};

export default OmsorgOgAdopsjonPanel;

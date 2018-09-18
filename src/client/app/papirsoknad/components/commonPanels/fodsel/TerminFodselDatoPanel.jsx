import React from 'react';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import { formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Undertekst } from 'nav-frontend-typografi';
import { Fieldset } from 'nav-frontend-skjema';

import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import {
  DatepickerField, InputField, NavFieldGroup, RadioGroupField, RadioOption,
} from 'form/Fields';
import {
  hasValidDate,
  dateBeforeOrEqual,
  dateBeforeOrEqualToToday,
  required,
  hasValidInteger,
  minValue,
  maxValue,
} from 'utils/validation/validators';
import { ISO_DATE_FORMAT } from 'utils/formats';
import BorderBox from 'sharedComponents/BorderBox';

import styles from './terminFodselDatoPanel.less';

/*
 * TerminFodselDatoPanel
 *
 * Form som brukes for registrere termin i papir soknad.
 *
 */

export const TerminFodselDatoPanelImpl = ({
  readOnly,
  intl,
  erBarnetFodt,
}) => (
  <BorderBox>
    <div className={styles.flexContainer}>
      <NavFieldGroup errorMessageName="terminEllerFoedsel">
        <Fieldset legend={intl.formatMessage({ id: 'Registrering.TerminOgFodsel' })}>
          <Undertekst><FormattedMessage id="Registrering.Termin.Fodt" /></Undertekst>
          <VerticalSpacer eightPx />
          <RadioGroupField name="erBarnetFodt" readOnly={readOnly} validate={[required]}>
            <RadioOption label={intl.formatMessage({ id: 'Registrering.Fodsel.ErFodt' })} value />
            <RadioOption label={intl.formatMessage({ id: 'Registrering.Fodsel.ErIkkeFodt' })} value={false} />
          </RadioGroupField>
          {erBarnetFodt === false
          && (
          <div className={styles.arrowLineTermin}>
            <div className={styles.row}>
              <div className={styles.col}>
                <DatepickerField
                  name="termindato"
                  label={{ id: 'Registrering.Termindato' }}
                  readOnly={readOnly}
                />
              </div>
              <div className={styles.col}>
                <InputField
                  name="antallBarnFraTerminbekreftelse"
                  label={{ id: 'Registrering.AntallBarn' }}
                  bredde="XS"
                  readOnly={readOnly}
                />
              </div>
            </div>
            <div className={styles.skjemaelement}>
              <DatepickerField
                name="terminbekreftelseDato"
                label={{ id: 'Registrering.UtstedtDato' }}
                readOnly={readOnly}
              />
            </div>
          </div>
          )
          }
          { erBarnetFodt
          && (
          <div className={styles.arrowLineFodsel}>
            <DatepickerField
              name="foedselsDato"
              label={{ id: 'Registrering.Fodselsdato' }}
              /* foedselsDato is array in DTO data model, so we transform the value to/from the store/input */
              format={valueFromStore => (valueFromStore && valueFromStore.length ? valueFromStore[0] : valueFromStore)}
              parse={valueFromInput => (valueFromInput ? [valueFromInput] : valueFromInput)}
              readOnly={readOnly}
            />
            <InputField
              name="antallBarn"
              label={{ id: 'Registrering.AntallBarn' }}
              bredde="XS"
              readOnly={readOnly}
            />
          </div>
          )
          }
        </Fieldset>
      </NavFieldGroup>
    </div>
  </BorderBox>
);

TerminFodselDatoPanelImpl.propTypes = {
  intl: intlShape.isRequired,
  readOnly: PropTypes.bool.isRequired,
  erBarnetFodt: PropTypes.bool,
};

TerminFodselDatoPanelImpl.defaultProps = {
  erBarnetFodt: undefined,
};

const mapStateToProps = (state, initialProps) => ({
  erBarnetFodt: formValueSelector(initialProps.form)(state, 'erBarnetFodt'),
});

const TerminFodselDatoPanel = injectIntl(connect(mapStateToProps)(TerminFodselDatoPanelImpl));

const getToday = () => moment().startOf('day');
const getEarliestTerminDato = () => getToday().subtract(3, 'weeks');
const getLatestTerminbekreftelseDato = (termindato) => {
  const earliestTerminDato = getEarliestTerminDato();
  const actualTermindato = termindato ? moment(termindato, ISO_DATE_FORMAT) : undefined;
  const today = getToday();
  if (actualTermindato && actualTermindato.isSameOrBefore(today)) {
    return (actualTermindato.isAfter(earliestTerminDato) ? actualTermindato : earliestTerminDato).subtract(1, 'days');
  }
  return today;
};

const validateTermin = values => ({
  termindato: required(values.termindato) || hasValidDate(values.termindato),
  terminbekreftelseDato: (
    hasValidDate(values.terminbekreftelseDato)
    || dateBeforeOrEqual(getLatestTerminbekreftelseDato(values.termindato))(values.terminbekreftelseDato)
  ),
  antallBarnFraTerminbekreftelse: (
    required(values.antallBarnFraTerminbekreftelse)
    || hasValidInteger(values.antallBarnFraTerminbekreftelse)
    || minValue(1)(values.antallBarnFraTerminbekreftelse)
    || maxValue(9)(values.antallBarnFraTerminbekreftelse)
  ),
});

const validateFodsel = values => ({
  foedselsDato: (
    required(values.foedselsDato)
    || required(values.foedselsDato[0])
    || hasValidDate(values.foedselsDato[0])
    || dateBeforeOrEqualToToday(values.foedselsDato[0])
  ),
  // since foedselsDato is array in the DTO due to adoption
  antallBarn: (
    required(values.antallBarn)
    || hasValidInteger(values.antallBarn)
    || minValue(1)(values.antallBarn)
    || maxValue(9)(values.antallBarn)
  ),
});

TerminFodselDatoPanel.validate = (values) => {
  if (values.erBarnetFodt) {
    return validateFodsel(values);
  }
  return validateTermin(values);
};

export default TerminFodselDatoPanel;

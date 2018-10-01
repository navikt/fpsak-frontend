import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getFormValues } from 'redux-form';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';
import { Undertekst } from 'nav-frontend-typografi';
import { Row, Column } from 'nav-frontend-grid';

import PeriodFieldArray from '@fpsak-frontend/shared-components/PeriodFieldArray';
import { FlexContainer, FlexColumn, FlexRow } from '@fpsak-frontend/shared-components/flexGrid';
import {
  required, hasValidDate, dateRangesNotOverlapping, dateAfterOrEqual,
} from '@fpsak-frontend/utils/validation/validators';
import { isRequiredMessage } from '@fpsak-frontend/utils/validation/messages';
import { ISO_DATE_FORMAT } from '@fpsak-frontend/utils/formats';
import { isArrayEmpty } from '@fpsak-frontend/utils';
import { getKodeverk } from '@fpsak-frontend/kodeverk/duck';
import kodeverkPropType from '@fpsak-frontend/kodeverk/kodeverkPropType';
import kodeverkTyper from '@fpsak-frontend/kodeverk/kodeverkTyper';
import uttakPeriodeType from '@fpsak-frontend/kodeverk/uttakPeriodeType';
import {
  CheckboxField, DatepickerField, SelectField,
} from '@fpsak-frontend/form';

import styles from './renderPermisjonPeriodeFieldArray.less';

export const gyldigeUttakperioder = [uttakPeriodeType.FELLESPERIODE,
  uttakPeriodeType.FEDREKVOTE,
  uttakPeriodeType.FORELDREPENGER_FOR_FODSEL,
  uttakPeriodeType.FORELDREPENGER,
  uttakPeriodeType.MODREKVOTE];

const mapPeriodeTyper = typer => typer
  .filter(({ kode }) => gyldigeUttakperioder.includes(kode))
  .map(({ kode, navn }) => <option value={kode} key={kode}>{navn}</option>);

const mapAktiviteter = aktiviteter => aktiviteter
  .map(({ kode, navn }) => <option value={kode} key={kode}>{navn}</option>);

export const periodsWithNoMorsAktivitet = [
  uttakPeriodeType.FEDREKVOTE,
  uttakPeriodeType.FORELDREPENGER_FOR_FODSEL,
  uttakPeriodeType.MODREKVOTE];

const shouldDisableSelect = (selectedPeriodeTyper, index) => {
  if (typeof selectedPeriodeTyper === 'undefined' || typeof selectedPeriodeTyper[index] === 'undefined') {
    return true;
  }

  return periodsWithNoMorsAktivitet.includes(selectedPeriodeTyper[index])
    || selectedPeriodeTyper[index] === '';
};

const getLabel = (erForsteRad, id) => (erForsteRad ? { id } : '');

/**
 *  RenderPermisjonPeriodeFieldArray
 *
 * Presentasjonskomponent: Viser inputfelter for dato for bestemmelse av perioder med permijon.
 * Komponenten må rendres som komponenten til et FieldArray.
 */
export const RenderPermisjonPeriodeFieldArray = ({
  fields,
  meta,
  periodeTyper,
  morsAktivitetTyper,
  sokerErMor,
  readOnly,
  selectedPeriodeTyper,
}) => {
  if (morsAktivitetTyper.filter(({ kode }) => kode === '-').length === 0) { morsAktivitetTyper.unshift({ kode: '-', navn: '' }); }
  return (
    <PeriodFieldArray readOnly={readOnly} fields={fields} meta={meta} emptyPeriodTemplate={{}}>
      {(periodeElementFieldId, index) => {
        const erForsteRad = (index === 0);
        return (
          <Row key={periodeElementFieldId}>
            <Column xs="12" className={index !== (fields.length - 1) ? styles.notLastRow : ''}>
              <FlexContainer>
                <FlexRow wrap>
                  <FlexColumn>
                    <SelectField
                      readOnly={readOnly}
                      name={`${periodeElementFieldId}.periodeType`}
                      bredde="l"
                      label={getLabel(erForsteRad, 'Registrering.Permisjon.periodeType')}
                      selectValues={mapPeriodeTyper(periodeTyper)}
                    />
                  </FlexColumn>
                  <FlexColumn>
                    <DatepickerField
                      readOnly={readOnly}
                      name={`${periodeElementFieldId}.periodeFom`}
                      defaultValue={null}
                      label={getLabel(erForsteRad, 'Registrering.Permisjon.periodeFom')}
                    />
                  </FlexColumn>
                  <FlexColumn>
                    <DatepickerField
                      readOnly={readOnly}
                      name={`${periodeElementFieldId}.periodeTom`}
                      defaultValue={null}
                      label={getLabel(erForsteRad, 'Registrering.Permisjon.periodeTom')}
                    />
                  </FlexColumn>
                  {!sokerErMor
                    && (
                    <FlexColumn>
                      <SelectField
                        readOnly={readOnly}
                        disabled={shouldDisableSelect(selectedPeriodeTyper, index)}
                        bredde="s"
                        name={`${periodeElementFieldId}.morsAktivitet`}
                        label={getLabel(erForsteRad, 'Registrering.Permisjon.Fellesperiode.morsAktivitet')}
                        selectValues={mapAktiviteter(morsAktivitetTyper)}
                        hideValueOnDisable
                      />
                    </FlexColumn>
                    )
                    }
                  <FlexColumn>
                    {!readOnly
                    && (
                      <Undertekst className={erForsteRad ? styles.samtidigUttakFirst : styles.samtidigUttak}>
                        <FormattedMessage id="Registrering.Permisjon.HarSamtidigUttak" />
                      </Undertekst>
                    )
                    }
                    <CheckboxField
                      readOnly={readOnly}
                      name={`${periodeElementFieldId}.harSamtidigUttak`}
                      label=" "
                    />
                  </FlexColumn>
                  <FlexColumn>
                    {!readOnly
                    && (
                      <button
                        className={erForsteRad ? styles.buttonRemoveFirst : styles.buttonRemove}
                        type="button"
                        onClick={() => {
                          fields.remove(index);
                        }}
                      />
                    )
                    }
                  </FlexColumn>
                </FlexRow>
              </FlexContainer>
            </Column>
          </Row>
        );
      }
      }
    </PeriodFieldArray>
  );
};

RenderPermisjonPeriodeFieldArray.propTypes = {
  fields: PropTypes.shape().isRequired,
  meta: PropTypes.shape().isRequired,
  readOnly: PropTypes.bool.isRequired,
  periodeTyper: kodeverkPropType.isRequired,
  morsAktivitetTyper: kodeverkPropType.isRequired,
  sokerErMor: PropTypes.bool.isRequired,
  selectedPeriodeTyper: PropTypes.arrayOf(PropTypes.string).isRequired,
};

RenderPermisjonPeriodeFieldArray.validate = (values, utsettelseOrGraderingSelected) => {
  if ((!values || !values.length) && !utsettelseOrGraderingSelected) {
    return { _error: isRequiredMessage() };
  }

  const arrayErrors = values.map(({ periodeType, periodeFom, periodeTom }) => {
    const periodeFomDate = moment(periodeFom, ISO_DATE_FORMAT);
    const periodeTomDate = moment(periodeTom, ISO_DATE_FORMAT);
    const periodeFomError = required(periodeFom) || hasValidDate(periodeFom);
    let periodeTomError = required(periodeTom) || hasValidDate(periodeTom);
    const periodeTypeError = required(periodeType);

    if (!periodeFomError) {
      periodeTomError = periodeTomError || dateAfterOrEqual(periodeFomDate)(periodeTomDate);
    }
    if ((periodeFomError || periodeTomError || periodeTypeError)) {
      return {
        periodeType: periodeTypeError,
        periodeFom: periodeFomError,
        periodeTom: periodeTomError,
      };
    }
    return null;
  });

  if (arrayErrors.some(errors => errors !== null)) {
    return arrayErrors;
  }

  if (isArrayEmpty(values)) {
    return null;
  }
  const overlapError = dateRangesNotOverlapping(values.map(({ periodeFom, periodeTom }) => [periodeFom, periodeTom]));
  if (overlapError) {
    return { _error: overlapError };
  }
  return null;
};

RenderPermisjonPeriodeFieldArray.transformValues = values => values.map((value) => {
  if (periodsWithNoMorsAktivitet.includes(value.periodeType)) {
    return {
      periodeType: value.periodeType,
      periodeFom: value.periodeFom,
      periodeTom: value.periodeTom,
      harSamtidigUttak: value.harSamtidigUttak ? value.harSamtidigUttak : false,
    };
  }
  return {
    periodeType: value.periodeType,
    periodeFom: value.periodeFom,
    periodeTom: value.periodeTom,
    morsAktivitet: value.morsAktivitet,
    harSamtidigUttak: value.harSamtidigUttak ? value.harSamtidigUttak : false,
  };
});


const mapStateToProps = (state, ownProps) => {
  const values = getFormValues(ownProps.meta.form)(state);
  const permisjonValues = values[ownProps.namePrefix];
  let selectedPeriodeTyper = [''];
  if (typeof permisjonValues[ownProps.periodePrefix] !== 'undefined') {
    selectedPeriodeTyper = permisjonValues[ownProps.periodePrefix].map(({ periodeType }) => periodeType);
  }

  return {
    selectedPeriodeTyper,
    periodeTyper: getKodeverk(kodeverkTyper.UTTAK_PERIODE_TYPE)(state),
    morsAktivitetTyper: getKodeverk(kodeverkTyper.MORS_AKTIVITET)(state),
  };
};


export default connect(mapStateToProps)(RenderPermisjonPeriodeFieldArray);

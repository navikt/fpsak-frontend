import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getFormValues } from 'redux-form';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';
import { Undertekst } from 'nav-frontend-typografi';
import { Column, Row } from 'nav-frontend-grid';
import AlertStripe from 'nav-frontend-alertstriper';

import {
  FlexColumn, FlexContainer, FlexRow, PeriodFieldArray, VerticalSpacer,
} from '@fpsak-frontend/shared-components';
import {
  dateAfterOrEqual,
  dateRangesNotOverlapping,
  hasValidDate,
  hasValidDecimal,
  isArrayEmpty,
  ISO_DATE_FORMAT,
  isRequiredMessage,
  maxValue,
  required,
} from '@fpsak-frontend/utils';
import { kodeverkPropType } from '@fpsak-frontend/prop-types';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import uttakPeriodeType from '@fpsak-frontend/kodeverk/src/uttakPeriodeType';
import {
  CheckboxField, DatepickerField, DecimalField, SelectField,
} from '@fpsak-frontend/form';

import styles from './renderPermisjonPeriodeFieldArray.less';

const maxValue100 = maxValue(100);

export const gyldigeUttakperioder = [uttakPeriodeType.FELLESPERIODE,
  uttakPeriodeType.FEDREKVOTE,
  uttakPeriodeType.FORELDREPENGER_FOR_FODSEL,
  uttakPeriodeType.FORELDREPENGER,
  uttakPeriodeType.MODREKVOTE];

const mapPeriodeTyper = (typer) => typer
  .filter(({ kode }) => gyldigeUttakperioder.includes(kode))
  .map(({ kode, navn }) => <option value={kode} key={kode}>{navn}</option>);

const mapAktiviteter = (aktiviteter) => aktiviteter
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
        const { periodeFom, harSamtidigUttak } = fields.get(index);
        const periodeFomForTidlig = periodeFom && moment(periodeFom).isBefore(moment('2019-01-01'));
        return (
          <div key={periodeElementFieldId}>
            <Row>
              <Column xs="12">
                <FlexContainer>
                  <FlexRow wrap>
                    <FlexColumn className={styles.selectFieldWidth}>
                      <SelectField
                        readOnly={readOnly}
                        name={`${periodeElementFieldId}.periodeType`}
                        bredde="m"
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
                    )}
                    <FlexColumn className={styles.smalHeader}>
                      <Undertekst className={erForsteRad ? styles.visOverskrift : styles.skjulOverskrift}>
                        <FormattedMessage id="Registrering.Permisjon.Flerbarnsdager" />
                      </Undertekst>
                      <CheckboxField
                        readOnly={readOnly}
                        name={`${periodeElementFieldId}.flerbarnsdager`}
                        label=" "
                      />
                    </FlexColumn>
                    <FlexColumn className={styles.smalHeader}>
                      <Undertekst className={erForsteRad ? styles.visOverskrift : styles.skjulOverskrift}>
                        <FormattedMessage id="Registrering.Permisjon.HarSamtidigUttak" />
                      </Undertekst>
                      <CheckboxField
                        readOnly={readOnly}
                        name={`${periodeElementFieldId}.harSamtidigUttak`}
                        label=" "
                      />
                    </FlexColumn>
                    {harSamtidigUttak
                    && (
                    <FlexColumn className={erForsteRad ? '' : styles.alignSamtidigUttak}>
                      <DecimalField
                        name={`${periodeElementFieldId}.samtidigUttaksprosent`}
                        bredde="S"
                        validate={[hasValidDecimal, maxValue100]}
                        label={{ id: 'Registrering.Permisjon.SamtidigUttaksprosent' }}
                        normalizeOnBlur={(value) => (Number.isNaN(value) ? value : parseFloat(value).toFixed(2))}
                      />
                    </FlexColumn>
                    )}
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
                    )}
                    </FlexColumn>
                  </FlexRow>
                  {periodeFomForTidlig
                  && (
                    <div>
                      <FlexRow wrap>
                        <AlertStripe type="advarsel">
                          <FormattedMessage id="Registrering.Permisjon.PeriodeFomForTidlig" />
                        </AlertStripe>
                      </FlexRow>
                      <VerticalSpacer sixteenPx />
                    </div>
                  )}
                </FlexContainer>
              </Column>
            </Row>
            <VerticalSpacer eightPx />
          </div>
        );
      }}
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

RenderPermisjonPeriodeFieldArray.validate = (values) => {
  if ((!values || !values.length)) {
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

  if (arrayErrors.some((errors) => errors !== null)) {
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

RenderPermisjonPeriodeFieldArray.transformValues = (values) => values.map((value) => {
  if (periodsWithNoMorsAktivitet.includes(value.periodeType)) {
    return {
      periodeType: value.periodeType,
      periodeFom: value.periodeFom,
      periodeTom: value.periodeTom,
      flerbarnsdager: value.flerbarnsdager ? value.flerbarnsdager : false,
      harSamtidigUttak: value.harSamtidigUttak ? value.harSamtidigUttak : false,
      samtidigUttaksprosent: value.samtidigUttaksprosent,
    };
  }
  return {
    periodeType: value.periodeType,
    periodeFom: value.periodeFom,
    periodeTom: value.periodeTom,
    morsAktivitet: value.morsAktivitet,
    flerbarnsdager: value.flerbarnsdager ? value.flerbarnsdager : false,
    harSamtidigUttak: value.harSamtidigUttak ? value.harSamtidigUttak : false,
    samtidigUttaksprosent: value.samtidigUttaksprosent,
  };
});

const mapStateToPropsFactory = (initialState, ownProps) => {
  const values = getFormValues(ownProps.meta.form)(initialState);
  const permisjonValues = values[ownProps.namePrefix];
  let selectedPeriodeTyper = [''];
  if (typeof permisjonValues[ownProps.periodePrefix] !== 'undefined') {
    selectedPeriodeTyper = permisjonValues[ownProps.periodePrefix].map(({ periodeType }) => periodeType);
  }
  const periodeTyper = ownProps.alleKodeverk[kodeverkTyper.UTTAK_PERIODE_TYPE];
  const morsAktivitetTyper = ownProps.alleKodeverk[kodeverkTyper.MORS_AKTIVITET];

  return () => ({
    selectedPeriodeTyper,
    periodeTyper,
    morsAktivitetTyper,
  });
};

export default connect(mapStateToPropsFactory)(RenderPermisjonPeriodeFieldArray);

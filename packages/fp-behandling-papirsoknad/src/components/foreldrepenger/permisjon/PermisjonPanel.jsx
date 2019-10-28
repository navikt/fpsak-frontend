import React from 'react';
import PropTypes from 'prop-types';
import { FieldArray, FormSection, formValueSelector } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import { Element, Undertittel } from 'nav-frontend-typografi';
import { connect } from 'react-redux';

import { BorderBox, VerticalSpacer } from '@fpsak-frontend/shared-components';
import SoknadData from 'papirsoknad/src/SoknadData';
import foreldreType from '@fpsak-frontend/kodeverk/src/foreldreType';
import { CheckboxField } from '@fpsak-frontend/form';
import { dateRangesNotOverlappingCrossTypes } from '@fpsak-frontend/utils';
import PermisjonUtsettelsePanel, { utsettelsePeriodeFieldArrayName } from './PermisjonUtsettelsePanel';
import PermisjonGraderingPanel, { graderingPeriodeFieldArrayName } from './PermisjonGraderingPanel';
import PermisjonOverforingAvKvoterPanel from './PermisjonOverforingAvKvoterPanel';
import RenderPermisjonPeriodeFieldArray from './RenderPermisjonPeriodeFieldArray';
import PermisjonOppholdPanel, { oppholdPeriodeFieldArrayName } from './PermisjonOppholdPanel';

import styles from './permisjonPanel.less';

export const TIDSROM_PERMISJON_FORM_NAME_PREFIX = 'tidsromPermisjon';

export const permisjonPeriodeFieldArrayName = 'permisjonsPerioder';

/**
 * PermisjonPanel
 *
 * Presentasjonskomponent: Viser permisjonspanel for mor eller far/medmor
 */
export const PermisjonPanel = ({
  soknadData,
  fulltUttak,
  form,
  readOnly,
  error,
  visFeilMelding,
}) => (
  <FormSection name={TIDSROM_PERMISJON_FORM_NAME_PREFIX}>
    <BorderBox>
      <div className={styles.flexContainer}>
        <Undertittel><FormattedMessage id="Registrering.Permisjon.Title" /></Undertittel>
        <VerticalSpacer sixteenPx />
        { visFeilMelding
          && (
          <div role="alert" aria-live="assertive">
            <div className="skjemaelement__feilmelding"><FormattedMessage id={error.permisjonsError} /></div>
          </div>
          )}
        <VerticalSpacer eightPx />
        <Element><FormattedMessage id="Registrering.Permisjon.FulltUttak" /></Element>
        <VerticalSpacer eightPx />
        <CheckboxField
          className={visFeilMelding ? styles.showErrorBackground : ''}
          readOnly={readOnly}
          name="fulltUttak"
          label={<FormattedMessage id="Registrering.Permisjon.FulltUttak" />}
        />
        { fulltUttak
          && (
            <FieldArray
              name={permisjonPeriodeFieldArrayName}
              component={RenderPermisjonPeriodeFieldArray}
              periodePrefix={permisjonPeriodeFieldArrayName}
              namePrefix={TIDSROM_PERMISJON_FORM_NAME_PREFIX}
              sokerErMor={soknadData.getForeldreType() === foreldreType.MOR}
              readOnly={readOnly}
            />
          )}
        <VerticalSpacer twentyPx />
        <PermisjonOverforingAvKvoterPanel
          visFeilMelding={visFeilMelding}
          form={form}
          readOnly={readOnly}
          soknadData={soknadData}
          namePrefix={TIDSROM_PERMISJON_FORM_NAME_PREFIX}
        />
        <VerticalSpacer twentyPx />
        <PermisjonUtsettelsePanel visFeilMelding={visFeilMelding} form={form} readOnly={readOnly} namePrefix={TIDSROM_PERMISJON_FORM_NAME_PREFIX} />
        <VerticalSpacer twentyPx />
        <PermisjonGraderingPanel visFeilMelding={visFeilMelding} form={form} readOnly={readOnly} namePrefix={TIDSROM_PERMISJON_FORM_NAME_PREFIX} />
        <VerticalSpacer twentyPx />
        <PermisjonOppholdPanel form={form} readOnly={readOnly} namePrefix={TIDSROM_PERMISJON_FORM_NAME_PREFIX} />
      </div>
    </BorderBox>
  </FormSection>
);

PermisjonPanel.propTypes = {
  soknadData: PropTypes.instanceOf(SoknadData).isRequired,
  form: PropTypes.string.isRequired,
  readOnly: PropTypes.bool.isRequired,
  fulltUttak: PropTypes.bool,
  visFeilMelding: PropTypes.bool.isRequired,
  error: PropTypes.shape(),
};

PermisjonPanel.defaultProps = {
  fulltUttak: false,
  error: {},
};


const permisjonErrors = (values) => {
  const errors = PermisjonOverforingAvKvoterPanel.validate(values);

  const permisjonPeriodeValues = values ? values[permisjonPeriodeFieldArrayName] : null;
  errors[permisjonPeriodeFieldArrayName] = RenderPermisjonPeriodeFieldArray.validate(permisjonPeriodeValues);

  if (values.skalUtsette) {
    const utsettelseperiodeValues = values ? values[utsettelsePeriodeFieldArrayName] : null;
    errors[utsettelsePeriodeFieldArrayName] = PermisjonUtsettelsePanel.validate(utsettelseperiodeValues, isEndringForeldrepenger);
  }

  if (values.skalGradere) {
    const graderingperiodeValues = values ? values[graderingPeriodeFieldArrayName] : null;
    errors[graderingPeriodeFieldArrayName] = PermisjonGraderingPanel.validate(graderingperiodeValues, isEndringForeldrepenger);
  }
  if (values.skalHaOpphold) {
    const oppholdPerioderValues = values ? values[oppholdPeriodeFieldArrayName] : null;
    errors[oppholdPeriodeFieldArrayName] = PermisjonOppholdPanel.validate(oppholdPerioderValues, isEndringForeldrepenger);
  }
  return errors;
};

const overLappingError = (values) => {
  if (values) {
    const allOverlappingErrors = [];
    const permisjonPeriodeValues = values.fulltUttak ? values[permisjonPeriodeFieldArrayName] : [];
    const utsettelseperiodeValues = values.skalUtsette ? values[utsettelsePeriodeFieldArrayName] : [];
    const graderingperiodeValues = values.skalGradere ? values[graderingPeriodeFieldArrayName] : [];
    const oppholdPerioderValues = values.skalHaOpphold ? values[oppholdPeriodeFieldArrayName] : [];
    const overforingsperiodeValue = values.skalOvertaKvote ? values.overforingsperiode : {};
    const mappedOveforingsPeriodeValue = Object.keys(overforingsperiodeValue).length ? {
      periodeFom: overforingsperiodeValue.fomDato || null,
      periodeTom: overforingsperiodeValue.tomDato || null,
    } : {};
    const errorArrayRaw = allOverlappingErrors.concat(permisjonPeriodeValues, utsettelseperiodeValues, graderingperiodeValues, oppholdPerioderValues);
    if (Object.keys(overforingsperiodeValue).length) { errorArrayRaw.push(mappedOveforingsPeriodeValue); }
    const errorArray = errorArrayRaw.filter((value) => Object.keys(value).length !== 0);
    if (errorArray.length > 0 && PermisjonPanel.validateXrossPeriodTypes(errorArray)) {
      return true;
    }
  }
  return false;
};


PermisjonPanel.validate = (values) => {
  let errors = {};
  errors[TIDSROM_PERMISJON_FORM_NAME_PREFIX] = {};
  const permisjonsError = !(values.tidsromPermisjon.skalUtsette
    || values.tidsromPermisjon.skalGradere
    || values.tidsromPermisjon.fulltUttak
    || values.tidsromPermisjon.skalOvertaKvote);
  if (permisjonsError) {
    errors = {
      _error: {
        permisjonsError: 'ValidationMessage.MinstEnPeriodeRequired',
      },
    };
  }

  const permisjonValues = values[TIDSROM_PERMISJON_FORM_NAME_PREFIX] || null;
  if (overLappingError(permisjonValues)) {
    errors = {
      _error: {
        permisjonsError: 'ValidationMessage.DateRangesOverlappingPeriodTypes',
      },
    };
  }
  errors[TIDSROM_PERMISJON_FORM_NAME_PREFIX] = permisjonErrors(permisjonValues);
  return errors;
};

// Den her checken trengs för att ikke validerings skall slå till för tidligt
PermisjonPanel.checkForFomTom = (val) => ('periodeTom' in val && val.periodeTom !== '' && 'periodeFom' in val && val.periodeFom !== '');

PermisjonPanel.validateXrossPeriodTypes = (values) => {
  if (values.every(PermisjonPanel.checkForFomTom)) {
    const overlapError = dateRangesNotOverlappingCrossTypes(values.map(({ periodeFom, periodeTom }) => [periodeFom, periodeTom]));
    if (overlapError) {
      return true;
    }
  }
  return false;
};

PermisjonPanel.transformValues = (values) => {
  const permisjonValues = values[TIDSROM_PERMISJON_FORM_NAME_PREFIX];
  const newValues = permisjonValues;
  if (values.tidsromPermisjon.fulltUttak && permisjonValues[permisjonPeriodeFieldArrayName]) {
    newValues[permisjonPeriodeFieldArrayName] = RenderPermisjonPeriodeFieldArray.transformValues(permisjonValues[permisjonPeriodeFieldArrayName]);
  }
  if (values.tidsromPermisjon.skalGradere && permisjonValues[graderingPeriodeFieldArrayName]) {
    newValues[graderingPeriodeFieldArrayName] = PermisjonGraderingPanel.transformValues(permisjonValues[graderingPeriodeFieldArrayName]);
  }
  return newValues;
};

PermisjonPanel.initialValues = {
  [TIDSROM_PERMISJON_FORM_NAME_PREFIX]: {
    ...PermisjonUtsettelsePanel.initialValues,
    ...PermisjonGraderingPanel.initialValues,
    ...PermisjonOverforingAvKvoterPanel.initialValues,
    ...PermisjonOppholdPanel.initialValues,
    [permisjonPeriodeFieldArrayName]: [{}],
    fulltUttak: false,
  },
};


const mapStateToProps = (state, ownProps) => {
  const visFeilMelding = !!(ownProps.error && ownProps.error.permisjonsError && ownProps.submitFailed);
  return {
    fulltUttak: formValueSelector(ownProps.form)(state, TIDSROM_PERMISJON_FORM_NAME_PREFIX).fulltUttak,
    visFeilMelding,
  };
};

export default connect(mapStateToProps)(PermisjonPanel);

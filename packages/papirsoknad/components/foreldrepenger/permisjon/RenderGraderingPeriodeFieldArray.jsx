import React from 'react';
import { connect } from 'react-redux';
import { getFormValues, getFormSyncErrors } from 'redux-form';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { Undertekst } from 'nav-frontend-typografi';
import { Row, Column } from 'nav-frontend-grid';

import PeriodFieldArray from '@fpsak-frontend/shared-components/PeriodFieldArray';
import { FlexContainer, FlexColumn, FlexRow } from '@fpsak-frontend/shared-components/flexGrid';
import { maxValue, hasValidDecimal } from '@fpsak-frontend/utils/validation/validators';
import {
  DatepickerField, SelectField, InputField, CheckboxField, DecimalField,
} from '@fpsak-frontend/form';
import kodeverkPropType from '@fpsak-frontend/kodeverk/kodeverkPropType';
import { gyldigeUttakperioder } from './RenderPermisjonPeriodeFieldArray';

import styles from './renderGraderingPeriodeFieldArray.less';

const defaultGraderingPeriode = {
  periodeFom: '',
  periodeTom: '',
  periodeForGradering: '',
  prosentandelArbeid: '',
  orgNr: '',
  skalGraderes: false,
};

const maxValue100 = maxValue(100);

const mapKvoter = typer => typer
  .filter(({ kode }) => gyldigeUttakperioder.includes(kode))
  .map(({ kode, navn }) => <option value={kode} key={kode}>{navn}</option>);

const fieldStyle = (fieldError, allErrors, submitFailed, errorStyle, normalStyle) => {
  if (fieldError !== null) {
    return !fieldError && allErrors && submitFailed ? errorStyle : normalStyle;
  }
  return allErrors && submitFailed ? errorStyle : normalStyle;
};

const fieldLabel = (index, labelId) => {
  if (index === 0) {
    return { id: labelId };
  }
  return '';
};

/**
 *  RenderGraderingPeriodeFieldArray
 *
 * Presentasjonskomponent: Viser inputfelter for dato for bestemmelse av graderingperiode.
 * Komponenten må rendres som komponenten til et FieldArray.
 */
export const RenderGraderingPeriodeFieldArray = ({
  fields,
  meta,
  graderingKvoter,
  intl,
  tomError,
  fomError,
  periodeForGraderingError,
  orgNrError,
  prosentandelArbeidError,
  errors,
  readOnly,
}) => (
  <PeriodFieldArray
    fields={fields}
    meta={meta}
    emptyPeriodTemplate={defaultGraderingPeriode}
    textCode="Registrering.Permisjon.Gradering.LeggTilPeriode"
    readOnly={readOnly}
  >
    {(periodeElementFieldId, index, getRemoveButton) => (
      <Row key={periodeElementFieldId}>
        <Column xs="12" className={index !== (fields.length - 1) ? styles.notLastRow : ''}>
          <FlexContainer wrap>
            <FlexRow alignItemsToFlexEnd>
              <FlexColumn>
                <div className={fieldStyle(periodeForGraderingError[index], errors[index], meta.submitFailed, styles.inputfieldMedFeil, '')}>
                  <SelectField
                    name={`${periodeElementFieldId}.periodeForGradering`}
                    bredde="s"
                    selectValues={mapKvoter(graderingKvoter)}
                    label={fieldLabel(index, 'Registrering.Permisjon.Gradering.Periode')}
                  />
                </div>
              </FlexColumn>
              <FlexColumn>
                <div className={fieldStyle(fomError[index], errors[index], meta.submitFailed, styles.datefieldMedFeil, '')}>
                  <DatepickerField
                    label={fieldLabel(index, 'Registrering.Permisjon.periodeFom')}
                    name={`${periodeElementFieldId}.periodeFom`}
                    defaultValue={null}
                  />
                </div>
              </FlexColumn>
              <FlexColumn>
                <div className={fieldStyle(tomError[index], errors[index], meta.submitFailed, styles.datefieldMedFeil, '')}>
                  <DatepickerField
                    label={fieldLabel(index, 'Registrering.Permisjon.periodeTom')}
                    name={`${periodeElementFieldId}.periodeTom`}
                    defaultValue={null}
                  />
                </div>
              </FlexColumn>
              <FlexColumn>
                {index === 0
                  && (
                  <div className={styles.prosentHeader}>
                    <Undertekst>
                      {' '}
                      <FormattedMessage id="Registrering.Permisjon.Gradering.Prosentandel" />
                    </Undertekst>
                  </div>
                  )
                  }
                <DecimalField
                  name={`${periodeElementFieldId}.prosentandelArbeid`}
                  bredde="S"
                  className={fieldStyle(prosentandelArbeidError[index], errors[index], meta.submitFailed, styles.inputfieldMedFeil, '')}
                  validate={[hasValidDecimal, maxValue100]}
                  normalizeOnBlur={value => (Number.isNaN(value) ? value : parseFloat(value).toFixed(2))}
                />
              </FlexColumn>
              <FlexColumn>
                <InputField
                  label={fieldLabel(index, 'Registrering.Permisjon.Orgnr')}
                  className={fieldStyle(orgNrError[index], errors[index], meta.submitFailed, styles.inputfieldMedFeil, '')}
                  name={`${periodeElementFieldId}.orgNr`}
                  bredde="S"
                  parse={(value) => {
                    const parsedValue = parseInt(value, 10);
                    return Number.isNaN(parsedValue) ? value : parsedValue;
                  }}
                />
              </FlexColumn>
            </FlexRow>
            <FlexRow alignItemsToFlexEnd>
              <FlexColumn>
                <SelectField
                  label={fieldLabel(index, 'Registrering.Permisjon.ErArbeidstakerLabel')}
                  name={`${periodeElementFieldId}.erArbeidstaker`}
                  bredde="m"
                  selectValues={[
                    <option value="true" key="true">{intl.formatMessage({ id: 'Registrering.Permisjon.ErArbeidstaker' })}</option>,
                    <option value="false" key="false">{intl.formatMessage({ id: 'Registrering.Permisjon.ErIkkeArbeidstaker' })}</option>,
                  ]}
                />
              </FlexColumn>
              <FlexColumn>
                {index === 0
                  && (
                  <div className={styles.graderesHeader}>
                    <Undertekst>
                      {' '}
                      <FormattedMessage id="Registrering.Permisjon.Gradering.SkalGraderes" />
                    </Undertekst>
                  </div>
                  )
                  }
                <CheckboxField
                  className={fieldStyle(null, errors[index], meta.submitFailed, styles.graderesCheckboxMedFeil, styles.graderesCheckbox)}
                  name={`${periodeElementFieldId}.skalGraderes`}
                  label=" "
                />
              </FlexColumn>
              <FlexColumn>
                <div className={styles.graderesHeader}>
                  <Undertekst><FormattedMessage id="Registrering.Permisjon.HarSamtidigUttak" /></Undertekst>
                </div>
                <CheckboxField
                  className={fieldStyle(null, errors[index], meta.submitFailed, styles.graderesCheckboxMedFeil, styles.graderesCheckbox)}
                  name={`${periodeElementFieldId}.harSamtidigUttak`}
                  label=""
                />
              </FlexColumn>
              <FlexColumn>
                {getRemoveButton(fieldStyle(null, errors[index], meta.submitFailed, styles.buttonMedFeil, styles.buttonRemove))}
              </FlexColumn>
            </FlexRow>
          </FlexContainer>
        </Column>
      </Row>
    )}
  </PeriodFieldArray>
);

RenderGraderingPeriodeFieldArray.propTypes = {
  fields: PropTypes.shape().isRequired,
  graderingKvoter: kodeverkPropType.isRequired,
  meta: PropTypes.shape().isRequired,
  intl: intlShape.isRequired,
  tomError: PropTypes.arrayOf(PropTypes.bool).isRequired,
  fomError: PropTypes.arrayOf(PropTypes.bool).isRequired,
  periodeForGraderingError: PropTypes.arrayOf(PropTypes.bool).isRequired,
  orgNrError: PropTypes.arrayOf(PropTypes.bool).isRequired,
  prosentandelArbeidError: PropTypes.arrayOf(PropTypes.bool).isRequired,
  errors: PropTypes.arrayOf(PropTypes.bool).isRequired,
  readOnly: PropTypes.bool.isRequired,
};

const fieldHasErrors = (state, ownProps) => {
  const syncErrors = getFormSyncErrors(ownProps.meta.form)(state);
  const graderingErrors = syncErrors[ownProps.namePrefix]
    ? [ownProps.namePrefix][ownProps.graderingPrefix]
    : undefined;
  if (graderingErrors === null || graderingErrors === undefined || ownProps.meta.error) {
    const values = getFormValues(ownProps.meta.form)(state)[ownProps.namePrefix][ownProps.graderingPrefix];
    return {
      tomError: values.map(() => false),
      fomError: values.map(() => false),
      periodeForGraderingError: values.map(() => false),
      prosentandelArbeidError: values.map(() => false),
      orgNrError: values.map(() => false),
      errors: values.map(() => false),
    };
  }
  const tomError = graderingErrors.map(v => v && !!v.periodeTom);
  const fomError = graderingErrors.map(v => v && !!v.periodeFom);
  const periodeForGraderingError = graderingErrors.map(v => v && !!v.periodeForGradering);
  const prosentandelArbeidError = graderingErrors.map(v => v && !!v.prosentandelArbeid);
  const orgNrError = graderingErrors.map(v => v && !!v.orgNr);
  const errors = tomError.map((value, index) => value || periodeForGraderingError[index] || fomError[index] || prosentandelArbeidError[index]);
  return {
    tomError,
    fomError,
    periodeForGraderingError,
    prosentandelArbeidError,
    orgNrError,
    errors,
  };
};

const mapStateToProps = (state, ownProps) => fieldHasErrors(state, ownProps);


export default connect(mapStateToProps)(injectIntl(RenderGraderingPeriodeFieldArray));

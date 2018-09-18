import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Row, Column } from 'nav-frontend-grid';

import PeriodFieldArray from 'sharedComponents/PeriodFieldArray';
import { FlexContainer, FlexColumn, FlexRow } from 'sharedComponents/flexGrid';
import { DatepickerField } from 'form/Fields';
import { required, hasValidDate, dateAfterOrEqual } from 'utils/validation/validators';
import { isRequiredMessage } from 'utils/validation/messages';
import { ISO_DATE_FORMAT } from 'utils/formats';

import styles from './renderAndreYtelserPerioderFieldArray.less';

/**
 *  RenderAndreYtelserPerioderFieldArray
 *
 * Presentasjonskomponent: Viser inputfelter for fra og til dato for perioder for andre ytelser
 * Komponenten må rendres som komponenten til et FieldArray.
 */
export const RenderAndreYtelserPerioderFieldArray = ({
  fields,
  meta,
  readOnly,
}) => (
  <PeriodFieldArray fields={fields} meta={meta} readOnly={readOnly}>
    {(periodeElementFieldId, index, getRemoveButton) => (
      <Row key={periodeElementFieldId}>
        <Column xs="12" className={index !== (fields.length - 1) ? styles.notLastRow : ''}>
          <FlexContainer>
            <FlexRow>
              <FlexColumn>
                <DatepickerField
                  name={`${periodeElementFieldId}.periodeFom`}
                  defaultValue={null}
                  label={index === 0 ? { id: 'Registrering.AndreYtelser.periodeFom' } : ''}
                />
              </FlexColumn>
              <FlexColumn>
                <DatepickerField
                  name={`${periodeElementFieldId}.periodeTom`}
                  defaultValue={null}
                  label={index === 0 ? { id: 'Registrering.AndreYtelser.periodeTom' } : ''}
                />
              </FlexColumn>
              <FlexColumn>
                {getRemoveButton()}
              </FlexColumn>
            </FlexRow>
          </FlexContainer>
        </Column>
      </Row>
    )}
  </PeriodFieldArray>
);


RenderAndreYtelserPerioderFieldArray.propTypes = {
  fields: PropTypes.shape().isRequired,
  meta: PropTypes.shape().isRequired,
  readOnly: PropTypes.bool.isRequired,
};

RenderAndreYtelserPerioderFieldArray.validate = (values) => {
  if (!values || !values.length) {
    return { _error: isRequiredMessage() };
  }

  const arrayErrors = values.map(({ periodeFom, periodeTom }) => {
    const periodeFomDate = moment(periodeFom, ISO_DATE_FORMAT);
    const periodeTomDate = moment(periodeTom, ISO_DATE_FORMAT);
    const periodeFomError = required(periodeFom) || hasValidDate(periodeFom);
    let periodeTomError = required(periodeTom) || hasValidDate(periodeTom);

    if (!periodeFomError && !periodeTomError) {
      periodeTomError = dateAfterOrEqual(periodeFomDate)(periodeTomDate);
    }
    if (periodeFomError || periodeTomError) {
      return {
        periodeFom: periodeFomError,
        periodeTom: periodeTomError,
      };
    }
    return null;
  });

  if (arrayErrors.some(errors => errors !== null)) {
    return arrayErrors;
  }
  return null;
};

RenderAndreYtelserPerioderFieldArray.transformValues = (values, ytelseType) => values.map(ytelsePeriode => ({
  ytelseType,
  periodeFom: ytelsePeriode.periodeFom,
  periodeTom: ytelsePeriode.periodeTom,
}));

export default RenderAndreYtelserPerioderFieldArray;

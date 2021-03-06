import React from 'react';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Column, Row } from 'nav-frontend-grid';

import { PeriodFieldArray } from '@fpsak-frontend/shared-components';
import { DatepickerField } from '@fpsak-frontend/form';
import {
  dateIsAfter,
  dateRangesNotOverlapping,
  dateRangesOverlappingMessage,
  hasValidDate,
  invalidPeriodMessage,
  isObjectEmpty,
  required,
} from '@fpsak-frontend/utils';

const showAddButton = (fields) => {
  if (fields.length > 0) {
    return (fields.get(fields.length - 1).periodeFom !== undefined && fields.get(fields.length - 1).periodeTom !== undefined);
  }
  return false;
};

const IkkeOmsorgPeriodeField = ({
  fields,
  meta,
  readOnly,
}) => (
  <div>
    <FormattedMessage id="IkkeOmsorgPeriodeField.Periode" />
    <PeriodFieldArray
      fields={fields}
      meta={meta}
      textCode="IkkeOmsorgPeriodeField.Add"
      shouldShowAddButton={!readOnly && showAddButton(fields)}
      createAddButtonInsteadOfImageLink
      readOnly={readOnly}
    >
      {(ikkeOmsorgElementFieldId, index, getRemoveButton) => (
        <Row key={ikkeOmsorgElementFieldId}>
          <Column xs="5">
            <DatepickerField
              defaultValue={null}
              name={`${ikkeOmsorgElementFieldId}.periodeFom`}
              validate={[required, hasValidDate]}
              readOnly={readOnly}
            />
          </Column>
          <Column xs="5">
            <DatepickerField
              defaultValue={null}
              name={`${ikkeOmsorgElementFieldId}.periodeTom`}
              validate={[hasValidDate]}
              readOnly={readOnly}
            />
          </Column>
          {!readOnly && (
            <Column xs="2">
              {getRemoveButton()}
            </Column>
          )}
        </Row>
      )}
    </PeriodFieldArray>
  </div>
);

IkkeOmsorgPeriodeField.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  meta: PropTypes.shape().isRequired,
  fields: PropTypes.shape().isRequired,
};

const hasValue = (values) => (values && values.length && values.length < 2 && !values[0].periodeTom);

const checkArrayErrors = (values) => values.map(({ periodeFom, periodeTom }, index) => {
  if (isObjectEmpty(periodeFom) && isObjectEmpty(periodeTom)) {
    return null;
  }
  let periodeFomError = required(periodeFom);
  if (periodeTom) {
    periodeFomError = moment(periodeFom).isSameOrBefore(moment(periodeTom).startOf('day')) ? null : invalidPeriodMessage();
  }
  let periodeTomError;
  if (values.length > index + 1) {
    periodeTomError = required(periodeTom);
  }
  if (periodeFomError || periodeTomError) {
    return {
      periodeFom: periodeFomError,
      periodeTom: periodeTomError,
    };
  }
  return null;
});

const checkOverlapError = (values) => dateRangesNotOverlapping(values.reduce((result, current) => {
  if (current.periodeTom && current.periodeFom) {
    result.push([current.periodeFom, current.periodeTom]);
  }
  return result;
}, []));

const hasValidPeriodOrOnlyStartDate = (values) => {
  if (hasValue(values)) {
    return null;
  }

  const arrayErrors = checkArrayErrors(values);

  if (arrayErrors.some((errors) => errors !== null)) {
    return arrayErrors;
  }
  if (values.length > 1) {
    let overlapError = checkOverlapError(values);

    const lastEntry = values[values.length - 1];
    if (!overlapError && lastEntry.periodeFom && !lastEntry.periodeTom) {
      const arrayWithoutLast = values.slice(0, values.length - 1);
      overlapError = arrayWithoutLast.some((date) => dateIsAfter(date.periodeFom, lastEntry.periodeFom)
        || dateIsAfter(date.periodeTom, lastEntry.periodeFom))
        ? dateRangesOverlappingMessage() : null;
    }
    if (overlapError) {
      return { _error: overlapError };
    }
  }
  return null;
};

IkkeOmsorgPeriodeField.validate = (values) => {
  const errors = {};
  if (!values) {
    return errors;
  }
  const { omsorg, ikkeOmsorgPerioder } = values;
  if (omsorg === false) {
    errors.ikkeOmsorgPerioder = hasValidPeriodOrOnlyStartDate(ikkeOmsorgPerioder);
  }
  return errors;
};

export default IkkeOmsorgPeriodeField;

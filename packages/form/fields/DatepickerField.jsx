import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import moment from 'moment';

import { ISO_DATE_FORMAT, DDMMYYYY_DATE_FORMAT, ACCEPTED_DATE_INPUT_FORMATS } from 'utils/formats';
import Datepicker from 'sharedComponents/datepicker/Datepicker';

import renderNavField from './renderNavField';
import ReadOnlyField from './ReadOnlyField';
import { labelPropType } from './Label';

const isoToDdMmYyyy = (string) => {
  const parsedDate = moment(string, ISO_DATE_FORMAT, true);
  if (parsedDate.isValid()) {
    return parsedDate.format(DDMMYYYY_DATE_FORMAT);
  }
  return string;
};

const acceptedFormatToIso = (string) => {
  const validDate = ACCEPTED_DATE_INPUT_FORMATS
    .map(format => moment(string, format, true))
    .find(parsedDate => parsedDate.isValid());
  if (validDate) {
    return validDate.format(ISO_DATE_FORMAT);
  }
  return string;
};

export const RenderDatepickerField = renderNavField(Datepicker);

const DatepickerField = ({
  name, label, readOnly, format, parse, isEdited, ...otherProps
}) => (
  <Field
    name={name}
    component={readOnly ? ReadOnlyField : RenderDatepickerField}
    label={label}
    {...otherProps}
    format={value => isoToDdMmYyyy(format(value))}
    parse={value => parse(acceptedFormatToIso(value))}
    readOnly={readOnly}
    readOnlyHideEmpty
    isEdited={isEdited}
  />
);

DatepickerField.propTypes = {
  name: PropTypes.string.isRequired,
  label: labelPropType,
  readOnly: PropTypes.bool,
  format: PropTypes.func,
  parse: PropTypes.func,
  isEdited: PropTypes.bool,
};

DatepickerField.defaultProps = {
  label: '',
  readOnly: false,
  isEdited: false,
  format: value => value,
  parse: value => value,
};

export default DatepickerField;

import React, { FunctionComponent } from 'react';
import { Field } from 'redux-form';
import moment from 'moment';

import { ACCEPTED_DATE_INPUT_FORMATS, DDMMYYYY_DATE_FORMAT, ISO_DATE_FORMAT } from '@fpsak-frontend/utils';
import { Datepicker } from '@fpsak-frontend/shared-components';

import renderNavField from './renderNavField';
import ReadOnlyField from './ReadOnlyField';
import LabelType from './LabelType';

interface DatepickerFieldProps {
  name: string;
  label?: LabelType;
  readOnly?: boolean;
  format?: (value: string) => string;
  parse?: (value: string) => string;
  isEdited?: boolean;
  validate?: (((text: any) => ({ id: string; length?: undefined }
    | { length: any; id?: undefined })[])
    | ((value: any) => { id: string }[])
    | ((text: any) => ({ id: string; text?: undefined }
    | { text: any; id?: undefined })[]))[];
}

const isoToDdMmYyyy = (string: string): string => {
  const parsedDate = moment(string, ISO_DATE_FORMAT, true);
  if (parsedDate.isValid()) {
    return parsedDate.format(DDMMYYYY_DATE_FORMAT);
  }
  return string;
};

const acceptedFormatToIso = (string: string): string => {
  const validDate = ACCEPTED_DATE_INPUT_FORMATS
    .map((format) => moment(string, format, true))
    .find((parsedDate) => parsedDate.isValid());
  if (validDate) {
    return validDate.format(ISO_DATE_FORMAT);
  }
  return string;
};

export const RenderDatepickerField = renderNavField(Datepicker);

const DatepickerField: FunctionComponent<DatepickerFieldProps> = ({
  name, label, readOnly, format, parse, isEdited, ...otherProps
}) => (
  <Field
    name={name}
    component={readOnly ? ReadOnlyField : RenderDatepickerField}
    label={label}
    {...otherProps}
    format={(value) => isoToDdMmYyyy(format(value))}
    parse={(value) => parse(acceptedFormatToIso(value))}
    readOnly={readOnly}
    readOnlyHideEmpty
    isEdited={isEdited}
  />
);

DatepickerField.defaultProps = {
  label: '',
  readOnly: false,
  isEdited: false,
  format: (value) => value,
  parse: (value) => value,
};

export default DatepickerField;

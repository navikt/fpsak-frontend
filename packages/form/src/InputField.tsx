import React, { FunctionComponent } from 'react';
import { Field } from 'redux-form';
import { Input as NavInput, InputProps as NavFrontendInputProps } from 'nav-frontend-skjema';

import LabelType from './LabelType';
import renderNavField from './renderNavField';
import ReadOnlyField, { ReadOnlyFieldProps } from './ReadOnlyField';

const renderNavInput = renderNavField(NavInput);

interface InputFieldProps {
  name: string;
  type?: string;
  label?: LabelType;
  validate?: (((text: any) => ({ id: string; length?: undefined } | { length: any; id?: undefined })[])
  | ((value: any, allValues: any, props: any) => { id: string }[])
  | ((value: any) => { id: string }[])
  | ((text: any) => ({ id: string; text?: undefined }
  | { text: any; id?: undefined })[]))[];
  readOnly?: boolean;
  isEdited?: boolean;
  renderReadOnlyValue?: (value: any) => any;
  parse?: (value: string) => string | number;
}

const InputField: FunctionComponent<InputFieldProps & (NavFrontendInputProps | ReadOnlyFieldProps)> = ({
  name, type, label, validate, readOnly, isEdited, ...otherProps
}) => (
  // @ts-ignore TODO Fiks
  <Field
    name={name}
    validate={validate}
    // @ts-ignore TODO Fiks
    component={readOnly ? ReadOnlyField : renderNavInput}
    type={type}
    label={label}
    {...otherProps}
    readOnly={readOnly}
    readOnlyHideEmpty
    isEdited={isEdited}
    autoComplete="off"
  />
);

InputField.defaultProps = {
  type: 'text',
  validate: null,
  readOnly: false,
  label: '',
  isEdited: false,
};

export default InputField;

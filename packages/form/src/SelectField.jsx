import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import CustomNavSelect from './CustomNavSelect';

import renderNavField from './renderNavField';
import { labelPropType } from './Label';
import ReadOnlyField from './ReadOnlyField';

/* eslint-disable-next-line react/prop-types */
const renderReadOnly = () => ({ input, selectValues, ...otherProps }) => {
  /* eslint-disable-next-line react/prop-types */
  const option = selectValues.map((sv) => sv.props).find((o) => o.value === input.value);
  const value = option ? option.children : undefined;
  return <ReadOnlyField input={{ value }} {...otherProps} />;
};

const renderNavSelect = renderNavField(CustomNavSelect);

const SelectField = ({
  name, label, selectValues, validate, readOnly, ...otherProps
}) => (
  <Field
    name={name}
    validate={validate}
    component={readOnly ? renderReadOnly() : renderNavSelect}
    label={label}
    selectValues={selectValues}
    disabled={!!readOnly}
    {...otherProps}
    readOnly={readOnly}
    readOnlyHideEmpty
  />
);

SelectField.propTypes = {
  name: PropTypes.string.isRequired,
  selectValues: PropTypes.arrayOf(PropTypes.object).isRequired,
  label: labelPropType.isRequired,
  validate: PropTypes.arrayOf(PropTypes.func),
  readOnly: PropTypes.bool,
  placeholder: PropTypes.string,
  hideValueOnDisable: PropTypes.bool,
};

SelectField.defaultProps = {
  validate: null,
  readOnly: false,
  placeholder: ' ',
  hideValueOnDisable: false,
};

export default SelectField;

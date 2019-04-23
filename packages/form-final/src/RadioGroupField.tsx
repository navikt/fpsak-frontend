import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import { Field } from 'react-final-form';
import { SkjemaGruppe as NavSkjemaGruppe } from 'nav-frontend-skjema';

import RadioOption from './RadioOption';
import renderNavField from './renderNavField';
import OptionGrid from './OptionGrid';

import styles from './radioGroupField.less';

const classNames = classnames.bind(styles);

const isChecked = (radioOption, actualValueStringified) => radioOption.key === actualValueStringified;

const renderRadioGroupField = renderNavField(({
  label, columns, id, name, value, onChange, bredde, readOnly, isEdited, feil, children, spaceBetween, rows, direction, DOMName,
}) => {
  const optionProps = {
    onChange,
    name: DOMName || name,
    groupDisabled: readOnly,
    className: classNames('radio'),
    actualValue: value,
  };
  const actualValueStringified = JSON.stringify(value);
  const showCheckedOnly = readOnly && value !== null && value !== undefined && value !== '';
  const options = children
    .filter(radioOption => !!radioOption)
    .map(radioOption => React.cloneElement(radioOption, { key: JSON.stringify(radioOption.props.value), ...optionProps }))
    .filter(radioOption => !showCheckedOnly || isChecked(radioOption, actualValueStringified));

  return (
    <NavSkjemaGruppe feil={readOnly ? undefined : feil} className={classNames(`input--${bredde}`, 'radioGroup', { readOnly })}>
      {label.props.input && <span className={classNames('radioGroupLabel', { readOnly })}>{label}</span>}
      <OptionGrid
        direction={direction}
        id={id}
        isEdited={readOnly && isEdited}
        options={options}
        spaceBetween={spaceBetween}
        columns={showCheckedOnly ? 1 : columns}
        rows={showCheckedOnly ? 1 : rows}
      />
    </NavSkjemaGruppe>
  );
});

export const RadioGroupField = props => (
  <Field
    component={renderRadioGroupField}
    {...props}
  />
);

const radioOptionsOnly = (options, key) => {
  const option = options[key];
  if (option) {
    const type = option.type || {};
    if (type.displayName !== RadioOption.displayName) {
      return new Error('RadioGroupField children should be of type "RadioOption"');
    }
  }
  return undefined;
};

RadioGroupField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.node,
  /**
   * columns: Antall kolonner som valgene skal fordeles på. Default er samme som antall valg.
   */
  columns: PropTypes.number,
  bredde: PropTypes.string,
  children: PropTypes.arrayOf(radioOptionsOnly).isRequired,
  spaceBetween: PropTypes.bool,
  rows: PropTypes.number,
  direction: PropTypes.string,
  DOMName: PropTypes.string,
};

RadioGroupField.defaultProps = {
  columns: 0,
  rows: 0,
  bredde: 'fullbredde',
  label: '',
  spaceBetween: false,
  direction: 'horizontal',
  DOMName: undefined,
};

export default RadioGroupField;

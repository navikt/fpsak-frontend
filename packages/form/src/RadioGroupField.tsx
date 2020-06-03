import React from 'react';
import classnames from 'classnames/bind';
import { Field } from 'redux-form';
import { SkjemaGruppe as NavSkjemaGruppe } from 'nav-frontend-skjema';

import renderNavField from './renderNavField';
import OptionGrid from './OptionGrid';
import { RadioOptionProps } from './RadioOption';

import styles from './radioGroupField.less';

type Direction = 'horizontal' | 'vertical';

interface RadioGroupFieldProps {
  name: string;
  label?: React.ReactNode;
  /**
   * columns: Antall kolonner som valgene skal fordeles på. Default er samme som antall valg.
   */
  columns?: number;
  bredde?: string;
  children?: React.ReactElement<RadioOptionProps>[];
  spaceBetween?: boolean;
  rows?: number;
  direction?: Direction;
  DOMName?: string;
  validate?: ((value: any) => { id: string }[])[] | ((value: string) => boolean | undefined)[] | ((value: string) => boolean | undefined);
  readOnly?: boolean;
  legend?: React.ReactNode;
  isEdited?: boolean;
}

const classNames = classnames.bind(styles);

const isChecked = (radioOption, actualValueStringified) => radioOption.key === actualValueStringified;

const renderRadioGroupField = renderNavField(({
  label,
  columns,
  id,
  name,
  value,
  onChange,
  bredde,
  readOnly,
  isEdited,
  feil,
  children,
  spaceBetween,
  rows,
  direction,
  DOMName,
  legend,
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
    .filter((radioOption) => !!radioOption)
    .map((radioOption) => React.cloneElement(radioOption, { key: JSON.stringify(radioOption.props.value), ...optionProps }))
    .filter((radioOption) => !showCheckedOnly || isChecked(radioOption, actualValueStringified));

  return (
    <NavSkjemaGruppe
      feil={readOnly ? undefined : feil}
      className={classNames(`input--${bredde}`, 'radioGroup', { readOnly })}
      legend={legend}
    >
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

export const RadioGroupField = (props: RadioGroupFieldProps) => (
  <Field
    component={renderRadioGroupField}
    {...props}
  />
);

RadioGroupField.defaultProps = {
  columns: 0,
  rows: 0,
  bredde: 'fullbredde',
  label: '',
  spaceBetween: false,
  direction: 'horizontal',
  legend: '',
};

export default RadioGroupField;

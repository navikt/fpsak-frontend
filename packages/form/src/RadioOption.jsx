/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { Radio as NavRadio } from 'nav-frontend-skjema';
import { Normaltekst } from 'nav-frontend-typografi';

import Label, { labelPropType } from './Label';

export const RadioOption = ({
  name,
  className,
  label,
  value,
  actualValue,
  disabled,
  groupDisabled,
  onChange,
  children,
  style,
  manualHideChildren,
}) => {
  const stringifiedValue = JSON.stringify(value);
  const actualStringifiedValue = JSON.stringify(actualValue);
  const checked = stringifiedValue === actualStringifiedValue;
  return (
    <div style={style}>
      <NavRadio
        name={name}
        className={className}
        label={<Label input={label} typographyElement={Normaltekst} />}
        value={value}
        checked={checked}
        disabled={disabled || groupDisabled}
        onChange={() => onChange(value)}
      />
      {(checked || manualHideChildren) && children
      }
    </div>
  );
};

RadioOption.propTypes = {
  name: PropTypes.string,
  label: labelPropType.isRequired,
  value: PropTypes.any.isRequired,
  actualValue: PropTypes.any,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  groupDisabled: PropTypes.bool,
  onChange: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
  style: PropTypes.shape(),
  manualHideChildren: PropTypes.bool,
};

RadioOption.defaultProps = {
  name: '',
  className: '',
  disabled: false,
  groupDisabled: false,
  actualValue: undefined,
  onChange: () => undefined,
  children: undefined,
  style: undefined,
  manualHideChildren: false,
};

RadioOption.displayName = 'RadioOption';

export default RadioOption;

import React, { ReactNode, ReactNodeArray, FunctionComponent } from 'react';
import { Radio as NavRadio } from 'nav-frontend-skjema';
import { Normaltekst } from 'nav-frontend-typografi';

import Label from './Label';
import LabelType from './LabelType';

export interface RadioOptionProps {
  name?: string;
  label: LabelType;
  value: string[] | string | number | boolean;
  actualValue?: string[] | string | number;
  className?: string;
  disabled?: boolean;
  groupDisabled?: boolean;
  onChange?: (value: string[] | string | number | boolean) => void;
  children?: ReactNode | ReactNodeArray;
  style?: any;
  manualHideChildren?: boolean;
  dataId?: string;
  wrapperClassName?: string;
}

export const RadioOption: FunctionComponent<RadioOptionProps> = ({
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
  dataId,
  wrapperClassName,
}) => {
  const stringifiedValue = JSON.stringify(value);
  const actualStringifiedValue = JSON.stringify(actualValue);
  const checked = stringifiedValue === actualStringifiedValue;
  return (
    <div style={style} className={wrapperClassName}>
      <NavRadio
        name={name}
        className={className}
        label={<Label input={label} typographyElement={Normaltekst} />}
        // @ts-ignore TODO Fjern denne. Må fjerna bruken av bolske verdiar som value
        value={value}
        checked={checked}
        disabled={disabled || groupDisabled}
        onChange={() => onChange(value)}
        data-id={dataId}
      />
      {(checked || manualHideChildren) && children}
    </div>
  );
};

RadioOption.defaultProps = {
  name: '',
  className: '',
  disabled: false,
  groupDisabled: false,
  onChange: () => undefined,
  manualHideChildren: false,
};

RadioOption.displayName = 'RadioOption';

export default RadioOption;

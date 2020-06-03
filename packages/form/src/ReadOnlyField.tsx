import React, { FunctionComponent } from 'react';
import { Normaltekst } from 'nav-frontend-typografi';

import { EditedIcon } from '@fpsak-frontend/shared-components';

import Label from './Label';
import LabelType from './LabelType';

import styles from './readOnlyField.less';

export interface ReadOnlyFieldProps {
  label?: LabelType;
  input: { value: string | number };
  isEdited?: boolean;
  type?: string;
  renderReadOnlyValue?: (value: any) => any;
  alignRightCenterOnReadOnly?: boolean;
}

const hasValue = (value: string | number) => value !== undefined && value !== null && value !== '';

export const ReadOnlyField: FunctionComponent<ReadOnlyFieldProps> = ({
  label,
  input,
  isEdited,
  type,
  alignRightCenterOnReadOnly,
}): JSX.Element => {
  if (!hasValue(input.value)) {
    return null;
  }

  return (
    <div className={styles.readOnlyContainer}>
      <Label input={label} readOnly />
      <div className={type === 'textarea' ? styles.textarea : ''}>
        <Normaltekst className={alignRightCenterOnReadOnly ? styles.readOnlyContentCenter : styles.readOnlyContent}>
          {input.value}
          {isEdited && <EditedIcon />}
        </Normaltekst>
      </div>
    </div>
  );
};

ReadOnlyField.defaultProps = {
  label: undefined,
  isEdited: false,
  type: undefined,
  alignRightCenterOnReadOnly: false,
};

export default ReadOnlyField;

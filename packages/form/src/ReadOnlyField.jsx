import React from 'react';
import PropTypes from 'prop-types';
import { Normaltekst } from 'nav-frontend-typografi';

import { EditedIcon } from '@fpsak-frontend/shared-components';
import Label, { labelPropType } from './Label';

import styles from './readOnlyField.less';

const hasValue = (value) => value !== undefined && value !== null && value !== '';

export const ReadOnlyField = ({
  label, input, isEdited, type,
}) => {
  if (!hasValue(input.value)) {
    return null;
  }

  return (
    <div className={styles.readOnlyContainer}>
      <Label input={label} readOnly />
      <div className={type === 'textarea' ? styles.textarea : ''}>
        <Normaltekst className={styles.readOnlyContent}>
          {input.value}
          {isEdited && <EditedIcon />}
        </Normaltekst>
      </div>
    </div>
  );
};

ReadOnlyField.propTypes = {
  label: labelPropType,
  input: PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
  isEdited: PropTypes.bool,
  type: PropTypes.string,
};

ReadOnlyField.defaultProps = {
  label: undefined,
  isEdited: false,
  type: undefined,
};

export default ReadOnlyField;

import React from 'react';
import PropTypes from 'prop-types';
import { Normaltekst } from 'nav-frontend-typografi';

import EditedIcon from 'sharedComponents/EditedIcon';
import Label, { labelPropType } from './Label';

import styles from './readOnlyField.less';

const hasValue = value => value !== undefined && value !== null && value !== '';

export const ReadOnlyField = ({
  label, input, isEdited,
}) => {
  if (!hasValue(input.value)) {
    return null;
  }
  return (
    <div className={styles.readOnlyContainer}>
      <Label input={label} readOnly />
      <Normaltekst className={styles.readOnlyContent}>
        {input.value}
        {isEdited && <EditedIcon />}
      </Normaltekst>
    </div>
  );
};

ReadOnlyField.propTypes = {
  label: labelPropType,
  input: PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
  isEdited: PropTypes.bool,
};

ReadOnlyField.defaultProps = {
  label: undefined,
  isEdited: false,
};

export default ReadOnlyField;

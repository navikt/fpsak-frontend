import React from 'react';
import PropTypes from 'prop-types';
import { Normaltekst, Undertekst } from 'nav-frontend-typografi';
import { FlexColumn, FlexContainer, FlexRow } from '@fpsak-frontend/shared-components';
import Label from '@fpsak-frontend/form/src/Label';
import EditedIcon from './EditedIcon';
import styles from './readOnlyField.less';

const labelPropType = PropTypes.oneOfType([
  PropTypes.node,
  PropTypes.shape({
    id: PropTypes.string.isRequired,
    args: PropTypes.shape(),
  }),
]);

const hasValue = (value) => value !== undefined && value !== null && value !== '';

export const ReadOnlyField = ({
  label, input, endrettekst,
}) => {
  if (!hasValue(input.value)) {
    return null;
  }
  return (
    <div className={styles.readOnlyContainer}>
      <Label typographyElement={Normaltekst} input={label} readOnly />
      <Normaltekst className={styles.readOnlyContent}>
        {input.value}
      </Normaltekst>
      {endrettekst && (
      <FlexContainer>
        <FlexRow>
          <FlexColumn>
            <EditedIcon />
          </FlexColumn>
          <FlexColumn className={styles.endretAvContent}>
            <Undertekst>
              {endrettekst}
            </Undertekst>
          </FlexColumn>
        </FlexRow>
      </FlexContainer>
      )}
    </div>
  );
};

ReadOnlyField.propTypes = {
  label: labelPropType,
  input: PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
  endrettekst: PropTypes.node,
};

ReadOnlyField.defaultProps = {
  label: undefined,
  endrettekst: undefined,
};

export default ReadOnlyField;

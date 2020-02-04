import React from 'react';
import PropTypes from 'prop-types';
import { Normaltekst, Undertekst } from 'nav-frontend-typografi';
import { FlexColumn, FlexContainer, FlexRow } from '@fpsak-frontend/shared-components';
import Label, { labelPropType } from '@fpsak-frontend/form/src/Label';
import EditedIcon2 from './EditedIconV2';
import styles from './readOnlyField_V2.less';

const hasValue = (value) => value !== undefined && value !== null && value !== '';

export const ReadOnlyFieldV2 = ({
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
            <EditedIcon2 />
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

ReadOnlyFieldV2.propTypes = {
  label: labelPropType,
  input: PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
  endrettekst: PropTypes.node,
};

ReadOnlyFieldV2.defaultProps = {
  label: undefined,
  endrettekst: undefined,
};

export default ReadOnlyFieldV2;

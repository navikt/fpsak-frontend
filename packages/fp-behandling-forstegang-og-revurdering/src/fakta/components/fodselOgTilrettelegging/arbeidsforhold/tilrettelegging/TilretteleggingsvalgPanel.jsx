import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
 FlexContainer, FlexColumn, FlexRow,
} from '@fpsak-frontend/shared-components';
import { DatepickerField, DecimalField } from '@fpsak-frontend/form';
import {
  required, hasValidDate, hasValidDecimal, minValue, maxValue,
} from '@fpsak-frontend/utils';

const minValue0 = minValue(0);
const maxProsentValue100 = maxValue(100);

/**
 * TilretteleggingsvalgPanel
 *
 * Svangerskapspenger
 */
export const TilretteleggingsvalgPanel = ({
  harStillingsprosent,
  textId,
  readOnly,
}) => (
  <FlexContainer>
    {textId && (
      <FlexRow>
        <FormattedMessage id={textId} />
      </FlexRow>
    )}
    <FlexRow>
      <FlexColumn>
        <DatepickerField
          name="fom"
          label={{ id: 'ArbeidsforholdCheckboxes.Arbeidsgiver.Dato' }}
          validate={[required, hasValidDate]}
          readOnly={readOnly}
        />
      </FlexColumn>
      {harStillingsprosent && (
        <FlexColumn>
          <DecimalField
            name="stillingsprosent"
            label={{ id: 'ArbeidsforholdCheckboxes.Arbeidsgiver.Stillingsprosent' }}
            validate={[required, minValue0, maxProsentValue100, hasValidDecimal]}
            readOnly={readOnly}
            bredde="XS"
            normalizeOnBlur={value => (Number.isNaN(value) ? value : parseFloat(value).toFixed(2))}
          />
        </FlexColumn>
      )}
    </FlexRow>
  </FlexContainer>
);

TilretteleggingsvalgPanel.propTypes = {
  harStillingsprosent: PropTypes.bool,
  textId: PropTypes.string,
  readOnly: PropTypes.bool.isRequired,
};

TilretteleggingsvalgPanel.defaultProps = {
  harStillingsprosent: false,
  textId: undefined,
};

export default TilretteleggingsvalgPanel;

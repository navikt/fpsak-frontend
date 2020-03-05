import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';

import { FlexColumn } from '@fpsak-frontend/shared-components';
import {
  hasValidDecimal, maxValue, minValue, required,
} from '@fpsak-frontend/utils';
import { DecimalField } from '@fpsak-frontend/form';
import { behandlingFormValueSelector } from '@fpsak-frontend/fp-felles';
import tilretteleggingType from '@fpsak-frontend/kodeverk/src/tilretteleggingType';

const maxValue100 = maxValue(100);
const minValue0 = minValue(0);

export const TilretteleggingFieldArrayStillingsprosent = ({
  intl,
  readOnly,
  tilretteleggingFieldId,
  showStillingsprosent,
}) => (
  <>
    {showStillingsprosent && (
      <FlexColumn>
        <DecimalField
          readOnly={readOnly}
          name={`${tilretteleggingFieldId}.stillingsprosent`}
          label={intl.formatMessage({ id: 'TilretteleggingFieldArray.Stillingsprosent' })}
          validate={[required, minValue0, maxValue100, hasValidDecimal]}
          normalizeOnBlur={(value) => (Number.isNaN(value) ? value : parseFloat(value).toFixed(2))}
        />
      </FlexColumn>
    )}
  </>
);

TilretteleggingFieldArrayStillingsprosent.propTypes = {
  intl: PropTypes.shape().isRequired,
  readOnly: PropTypes.bool.isRequired,
  tilretteleggingFieldId: PropTypes.string.isRequired,
  showStillingsprosent: PropTypes.bool.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  const {
    behandlingId, behandlingVersjon, index, formSectionName,
  } = ownProps;
  const tilretteleggingKode = behandlingFormValueSelector('FodselOgTilretteleggingForm', behandlingId, behandlingVersjon)(state,
    `${formSectionName}.tilretteleggingDatoer[${index}].type.kode`);
  return {
    showStillingsprosent: tilretteleggingKode === tilretteleggingType.DELVIS_TILRETTELEGGING,
  };
};


export default connect(mapStateToProps)(injectIntl(TilretteleggingFieldArrayStillingsprosent));

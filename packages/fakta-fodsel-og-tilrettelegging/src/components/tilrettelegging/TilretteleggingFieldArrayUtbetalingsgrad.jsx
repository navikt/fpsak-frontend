import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import {
  hasValidDecimal, maxValue, minValue, required,
} from '@fpsak-frontend/utils';
import { DecimalField } from '@fpsak-frontend/form';
import { behandlingFormValueSelector } from '@fpsak-frontend/fp-felles';
import tilretteleggingType from '@fpsak-frontend/kodeverk/src/tilretteleggingType';
import {
  FlexColumn, FlexContainer, FlexRow, Image,
} from '@fpsak-frontend/shared-components';
import endreImage from '@fpsak-frontend/assets/images/endre.svg';
import endretImage from '@fpsak-frontend/assets/images/endret_felt.svg';

import styles from './tilretteleggingFieldArrayUtbetalingsgrad.less';

const maxValue100 = maxValue(100);
const minValue0 = minValue(0);

export const TilretteleggingFieldArrayUtbetalingsgrad = ({
  intl,
  readOnly,
  tilretteleggingFieldId,
  showUtbetalingsgrad,
  erOverstyrer,
}) => (
  <>
    {showUtbetalingsgrad && (
      <FlexContainer>
        <FlexRow>
          <FlexColumn>
            <DecimalField
              readOnly={readOnly}
              name={`${tilretteleggingFieldId}.overstyrtUtbetalingsgrad`}
              label={intl.formatMessage({ id: 'TilretteleggingFieldArray.Utbetalingsgrad' })}
              validate={[required, minValue0, maxValue100, hasValidDecimal]}
              normalizeOnBlur={(value) => (Number.isNaN(value) ? value : parseFloat(value).toFixed(2))}
            />
          </FlexColumn>
          {erOverstyrer && (
          <FlexColumn>
            <Image
              className={styles.buttonMargin}
              src={erOverstyrer ? endreImage : endretImage}
              tabIndex="0"
            />
          </FlexColumn>
          )}
        </FlexRow>
      </FlexContainer>
    )}
  </>
);

TilretteleggingFieldArrayUtbetalingsgrad.propTypes = {
  intl: PropTypes.shape().isRequired,
  readOnly: PropTypes.bool.isRequired,
  tilretteleggingFieldId: PropTypes.string.isRequired,
  showUtbetalingsgrad: PropTypes.bool.isRequired,
  erOverstyrer: PropTypes.bool.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  const {
    behandlingId, behandlingVersjon, index, formSectionName,
  } = ownProps;
  const tilretteleggingKode = behandlingFormValueSelector('FodselOgTilretteleggingForm', behandlingId, behandlingVersjon)(state,
    `${formSectionName}.tilretteleggingDatoer[${index}].type.kode`);
  return {
    showUtbetalingsgrad: tilretteleggingKode === tilretteleggingType.DELVIS_TILRETTELEGGING
      || tilretteleggingKode === tilretteleggingType.INGEN_TILRETTELEGGING,
  };
};


export default connect(mapStateToProps)(injectIntl(TilretteleggingFieldArrayUtbetalingsgrad));

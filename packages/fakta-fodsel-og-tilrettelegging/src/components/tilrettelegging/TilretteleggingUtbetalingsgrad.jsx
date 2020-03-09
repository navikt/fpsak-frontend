import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';

import { behandlingFormValueSelector } from '@fpsak-frontend/fp-felles';
import { DecimalField } from '@fpsak-frontend/form';
import {
  FlexColumn, Image,
} from '@fpsak-frontend/shared-components';
import {
  hasValidDecimal, maxValue, minValue, required,
} from '@fpsak-frontend/utils';
import endreImage from '@fpsak-frontend/assets/images/endre.svg';
import endreDisabletImage from '@fpsak-frontend/assets/images/endre_disablet.svg';

import styles from './tilretteleggingFieldArray.less';

const maxValue100 = maxValue(100);
const minValue0 = minValue(0);

export const TilretteleggingUtbetalingsgrad = ({
  intl,
  tilretteleggingKode,
  readOnly,
  erOverstyrer,
  fieldId,
  overstyrtUtbetalingsgrad,
}) => {
  const [erIEditeringsmodus, setEditeres] = useState(false);

  useEffect(() => {
    setEditeres(false);
  }, [tilretteleggingKode]);

  const erReadOnly = readOnly || !erOverstyrer || (erOverstyrer && !erIEditeringsmodus);
  return (
    <>
      <FlexColumn>
        {!erReadOnly && (
          <DecimalField
            className={styles.textField}
            name={`${fieldId}.overstyrtUtbetalingsgrad`}
            label={intl.formatMessage({ id: 'TilretteleggingFieldArray.Utbetalingsgrad' })}
            validate={[required, minValue0, maxValue100, hasValidDecimal]}
            format={(value) => (Number.isNaN(value) ? value : parseFloat(value).toFixed(2))}
            normalizeOnBlur={(value) => (Number.isNaN(value) ? value : parseFloat(value).toFixed(2))}
          />
        )}
      </FlexColumn>
      <FlexColumn className={styles.buttonMargin}>
        {erReadOnly && (
          `${overstyrtUtbetalingsgrad} %`
        )}
        {!erReadOnly && (
          '%'
        )}
      </FlexColumn>
      {erOverstyrer && (
      <FlexColumn>
        <Image
          onClick={() => setEditeres(true)}
          onKeyDown={() => setEditeres(true)}
          className={erIEditeringsmodus ? styles.buttonMargin : styles.enabletImage}
          src={erIEditeringsmodus ? endreDisabletImage : endreImage}
          tabIndex="0"
          tooltip={intl.formatMessage({ id: 'TilretteleggingFieldArray.EndreUtbetalingsgrad' })}
        />
      </FlexColumn>
      )}
    </>
  );
};

TilretteleggingUtbetalingsgrad.propTypes = {
  intl: PropTypes.shape().isRequired,
  readOnly: PropTypes.bool.isRequired,
  erOverstyrer: PropTypes.bool.isRequired,
  overstyrtUtbetalingsgrad: PropTypes.string.isRequired,
  fieldId: PropTypes.string.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  const {
    behandlingId, behandlingVersjon, index, formSectionName,
  } = ownProps;
  return {
    overstyrtUtbetalingsgrad: behandlingFormValueSelector('FodselOgTilretteleggingForm', behandlingId, behandlingVersjon)(state,
      `${formSectionName}.tilretteleggingDatoer[${index}].overstyrtUtbetalingsgrad`),
  };
};

export default connect(mapStateToProps)(injectIntl(TilretteleggingUtbetalingsgrad));

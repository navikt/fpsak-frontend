import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

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
const minValue1 = minValue(1);

const TilretteleggingUtbetalingsgrad = ({
  intl,
  tilretteleggingKode,
  readOnly,
  erOverstyrer,
  fieldId,
}) => {
  const [erIEditeringsmodus, setEditeres] = useState(false);

  useEffect(() => {
    setEditeres(false);
  }, [tilretteleggingKode]);

  const erReadOnly = readOnly || !erOverstyrer || (erOverstyrer && !erIEditeringsmodus);
  return (
    <>
      <FlexColumn>
        <DecimalField
          className={styles.textField}
          name={`${fieldId}.overstyrtUtbetalingsgrad`}
          label={intl.formatMessage({ id: 'TilretteleggingFieldArray.Utbetalingsgrad' })}
          readOnly={erReadOnly}
          validate={[required, minValue1, maxValue100, hasValidDecimal]}
          normalizeOnBlur={(value) => (Number.isNaN(value) ? value : parseFloat(value).toFixed(2))}
          alignRightCenterOnReadOnly
        />
      </FlexColumn>
      <FlexColumn className={styles.buttonMargin}>
        %
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
  fieldId: PropTypes.string.isRequired,
  tilretteleggingKode: PropTypes.string.isRequired,
};

export default injectIntl(TilretteleggingUtbetalingsgrad);

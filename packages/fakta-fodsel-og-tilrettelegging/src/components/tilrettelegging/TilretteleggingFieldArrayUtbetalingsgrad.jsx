import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';

import {
  hasValidDecimal, maxValue, minValue, required,
} from '@fpsak-frontend/utils';
import { DecimalField } from '@fpsak-frontend/form';
import { behandlingFormValueSelector } from '@fpsak-frontend/fp-felles';
import tilretteleggingType from '@fpsak-frontend/kodeverk/src/tilretteleggingType';

import styles from './tilretteleggingFieldArrayStillingsprosent.less';

const maxValue100 = maxValue(100);
const minValue0 = minValue(0);

export const TilretteleggingFieldArrayUtbetalingsgrad = ({
  index,
  readOnly,
  tilretteleggingFieldId,
  showUtbetalingsgrad,
}) => (
  <>
    { showUtbetalingsgrad && (
      <>
        { index === 0 && (
          <Normaltekst className={styles.tilretteleggingTittel}>
            <FormattedMessage id="TilretteleggingFieldArray.Utbetalingsgrad" />
          </Normaltekst>
        )}
        <div className={styles.rightAlignText}>
          <DecimalField
            readOnly={readOnly}
            name={`${tilretteleggingFieldId}.overstyrtUtbetalingsgrad`}
            label=""
            validate={[required, minValue0, maxValue100, hasValidDecimal]}
            normalizeOnBlur={(value) => (Number.isNaN(value) ? value : parseFloat(value).toFixed(2))}
          />
        </div>
      </>
    )}
  </>
);

TilretteleggingFieldArrayUtbetalingsgrad.propTypes = {
  index: PropTypes.number.isRequired,
  readOnly: PropTypes.bool.isRequired,
  tilretteleggingFieldId: PropTypes.string.isRequired,
  showUtbetalingsgrad: PropTypes.bool.isRequired,
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


export default connect(mapStateToProps)(TilretteleggingFieldArrayUtbetalingsgrad);

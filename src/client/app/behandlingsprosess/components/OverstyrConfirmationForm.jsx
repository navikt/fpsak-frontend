import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';
import { Row, Column } from 'nav-frontend-grid';

import { isSelectedBehandlingspunktOverrideReadOnly } from 'behandlingsprosess/behandlingsprosessSelectors';
import { TextAreaField } from 'form/Fields';
import {
  minLength, maxLength, requiredIfNotPristine, hasValidText,
} from 'utils/validation/validators';
import decodeHtmlEntity from 'utils/decodeHtmlEntityUtils';

import styles from './overstyrConfirmationForm.less';

const minLength3 = minLength(3);
const maxLength1500 = maxLength(1500);

/**
 * OverstyrConfirmationForm
 *
 * Presentasjonskomponent. Lar den NAV-ansatte skrive inn en begrunnelse før overstyring av vilkår eller beregning.
 */
const OverstyrConfirmationFormImpl = ({
  intl,
  isReadOnly,
  isBeregningConfirmation,
}) => (
  <Row className={isReadOnly ? styles.margin : ''}>
    <Column xs="8">
      <TextAreaField
        name="begrunnelse"
        label={intl.formatMessage({ id: isBeregningConfirmation ? 'OverstyrConfirmationForm.Beregning' : 'OverstyrConfirmationForm.Vilkar' })}
        validate={[requiredIfNotPristine, minLength3, maxLength1500, hasValidText]}
        textareaClass={styles.explanationTextarea}
        maxLength={1500}
        readOnly={isReadOnly}
      />
    </Column>
  </Row>
);

OverstyrConfirmationFormImpl.propTypes = {
  intl: intlShape.isRequired,
  isReadOnly: PropTypes.bool.isRequired,
  isBeregningConfirmation: PropTypes.bool,
};

OverstyrConfirmationFormImpl.defaultProps = {
  isBeregningConfirmation: false,
};

const mapStateToProps = state => ({
  isReadOnly: isSelectedBehandlingspunktOverrideReadOnly(state),
});

const OverstyrConfirmationForm = connect(mapStateToProps)(injectIntl(OverstyrConfirmationFormImpl));

OverstyrConfirmationForm.buildInitialValues = aksjonspunkt => ({
  begrunnelse: decodeHtmlEntity(aksjonspunkt && aksjonspunkt.begrunnelse ? aksjonspunkt.begrunnelse : ''),
});

OverstyrConfirmationForm.transformValues = values => ({
  begrunnelse: values.begrunnelse,
});

export default OverstyrConfirmationForm;

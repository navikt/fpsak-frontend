import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';

import { TextAreaField } from 'form/Fields';
import {
  minLength, maxLength, requiredIfNotPristine, hasValidText,
} from 'utils/validation/validators';
import decodeHtmlEntity from 'utils/decodeHtmlEntityUtils';

import styles from './behandlingspunktBegrunnelseTextField.less';

const minLength3 = minLength(3);
const maxLength1500 = maxLength(1500);

const getBegrunnelseTextCode = readOnly => (readOnly
  ? 'BehandlingspunktBegrunnelseTextField.ExplanationRequiredReadOnly'
  : 'BehandlingspunktBegrunnelseTextField.ExplanationRequired');

/**
 * BehandlingspunktBegrunnelseTextField
 *
 * Presentasjonskomponent. Lar den NAV-ansatte skrive inn en begrunnelse før lagring av behandlingspunkter.
 */
const BehandlingspunktBegrunnelseTextFieldImpl = ({
  intl,
  readOnly,
  textCode,
}) => (
  <div className={styles.begrunnelseTextField}>
    <TextAreaField
      name="begrunnelse"
      label={intl.formatMessage({ id: textCode || getBegrunnelseTextCode(readOnly) })}
      validate={[requiredIfNotPristine, minLength3, maxLength1500, hasValidText]}
      textareaClass={styles.explanationTextarea}
      maxLength={1500}
      readOnly={readOnly}
    />
  </div>
);

BehandlingspunktBegrunnelseTextFieldImpl.propTypes = {
  intl: intlShape.isRequired,
  readOnly: PropTypes.bool.isRequired,
  textCode: PropTypes.string,
};

BehandlingspunktBegrunnelseTextFieldImpl.defaultProps = {
  textCode: undefined,
};

const BehandlingspunktBegrunnelseTextField = injectIntl(BehandlingspunktBegrunnelseTextFieldImpl);

const getBegrunnelse = aksjonspunkter => (aksjonspunkter.length > 0 && aksjonspunkter[0].begrunnelse
  ? aksjonspunkter[0].begrunnelse
  : '');

BehandlingspunktBegrunnelseTextField.buildInitialValues = aksjonspunkter => ({
  begrunnelse: decodeHtmlEntity(getBegrunnelse(aksjonspunkter)),
});

BehandlingspunktBegrunnelseTextField.transformValues = values => ({
  begrunnelse: values.begrunnelse,
});

export default BehandlingspunktBegrunnelseTextField;

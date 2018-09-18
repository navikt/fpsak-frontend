import React from 'react';
import PropTypes from 'prop-types';

import decodeHtmlEntity from 'utils/decodeHtmlEntityUtils';
import { TextAreaField } from 'form/Fields';
import {
  minLength, maxLength, requiredIfNotPristine, hasValidText,
} from 'utils/validation/validators';
import ElementWrapper from 'sharedComponents/ElementWrapper';

import styles from './faktaBegrunnelseTextField.less';

const minLength3 = minLength(3);
const maxLength1500 = maxLength(1500);

/**
 * FaktaBegrunnelseTextField
 */
const FaktaBegrunnelseTextField = ({
  isReadOnly,
  isSubmittable,
  isDirty,
  hasBegrunnelse,
  labelCode,
  hasVurderingText,
}) => (
  <ElementWrapper>
    {((isSubmittable && isDirty) || hasBegrunnelse)
    && (
    <div className={styles.begrunnelseTextField}>
      <TextAreaField
        name="begrunnelse"
        label={isReadOnly ? '' : { id: hasVurderingText ? 'FaktaBegrunnelseTextField.Vurdering' : labelCode }}
        validate={[requiredIfNotPristine, minLength3, maxLength1500, hasValidText]}
        textareaClass={isReadOnly ? styles.explanationTextareaReadOnly : styles.explanationTextarea}
        maxLength={1500}
        readOnly={isReadOnly}
      />
    </div>
    )
      }
  </ElementWrapper>
);

FaktaBegrunnelseTextField.propTypes = {
  isReadOnly: PropTypes.bool.isRequired,
  isSubmittable: PropTypes.bool.isRequired,
  isDirty: PropTypes.bool.isRequired,
  hasBegrunnelse: PropTypes.bool.isRequired,
  labelCode: PropTypes.string,
  hasVurderingText: PropTypes.bool,
};

FaktaBegrunnelseTextField.defaultProps = {
  labelCode: 'FaktaBegrunnelseTextField.BegrunnEndringene',
  hasVurderingText: false,
};

const getBegrunnelse = (aksjonspunkt) => {
  if (aksjonspunkt && aksjonspunkt.length > 0) {
    return aksjonspunkt[0].begrunnelse;
  }
  return aksjonspunkt ? aksjonspunkt.begrunnelse : '';
};

FaktaBegrunnelseTextField.buildInitialValues = aksjonspunkt => ({
  begrunnelse: decodeHtmlEntity(getBegrunnelse(aksjonspunkt)),
});

FaktaBegrunnelseTextField.transformValues = values => ({
  begrunnelse: values.begrunnelse,
});


export default FaktaBegrunnelseTextField;

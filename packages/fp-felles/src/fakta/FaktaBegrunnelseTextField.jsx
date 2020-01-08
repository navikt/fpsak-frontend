import React from 'react';
import PropTypes from 'prop-types';
import {
  decodeHtmlEntity, hasValidText, maxLength, minLength, required,
} from '@fpsak-frontend/utils';
import { TextAreaField } from '@fpsak-frontend/form';
import { ElementWrapper } from '@fpsak-frontend/shared-components';

import styles from './faktaBegrunnelseTextField.less';

const minLength3 = minLength(3);
const maxLength1500 = maxLength(1500);

/**
 * FaktaBegrunnelseTextField
 */
const FaktaBegrunnelseTextField = ({
  isReadOnly,
  isSubmittable,
  hasBegrunnelse,
  labelCode,
  hasVurderingText,
  name,
}) => (
  <ElementWrapper>
    {((isSubmittable) || hasBegrunnelse)
    && (
    <div className={styles.begrunnelseTextField}>
      <TextAreaField
        name={name}
        label={isReadOnly ? '' : { id: hasVurderingText ? 'FaktaBegrunnelseTextField.Vurdering' : labelCode }}
        validate={[required, minLength3, maxLength1500, hasValidText]}
        textareaClass={isReadOnly ? styles.explanationTextareaReadOnly : styles.explanationTextarea}
        maxLength={1500}
        readOnly={isReadOnly}
      />
    </div>
    )}
  </ElementWrapper>
);

FaktaBegrunnelseTextField.propTypes = {
  isReadOnly: PropTypes.bool.isRequired,
  isSubmittable: PropTypes.bool.isRequired,
  hasBegrunnelse: PropTypes.bool.isRequired,
  labelCode: PropTypes.string,
  hasVurderingText: PropTypes.bool,
  name: PropTypes.string,
};

FaktaBegrunnelseTextField.defaultProps = {
  name: 'begrunnelse',
  labelCode: 'FaktaBegrunnelseTextField.BegrunnEndringene',
  hasVurderingText: false,
};

const getBegrunnelse = (aksjonspunkt) => {
  if (aksjonspunkt && aksjonspunkt.length > 0) {
    return aksjonspunkt[0].begrunnelse;
  }
  return aksjonspunkt ? aksjonspunkt.begrunnelse : '';
};

FaktaBegrunnelseTextField.buildInitialValues = (aksjonspunkt, begrunnelseFieldName = 'begrunnelse') => ({
  [begrunnelseFieldName]: decodeHtmlEntity(getBegrunnelse(aksjonspunkt)),
});

FaktaBegrunnelseTextField.transformValues = (values, name = 'begrunnelse') => ({
  begrunnelse: values[name],
});

export default FaktaBegrunnelseTextField;

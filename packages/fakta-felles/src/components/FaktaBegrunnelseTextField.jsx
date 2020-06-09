import React from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import {
  decodeHtmlEntity, hasValidText, maxLength, minLength, required,
} from '@fpsak-frontend/utils';
import { TextAreaField } from '@fpsak-frontend/form';

import styles from './faktaBegrunnelseTextField.less';
import messages from '../../i18n/nb_NO.json';

const cache = createIntlCache();

const intl = createIntl({
  locale: 'nb-NO',
  messages,
}, cache);

const minLength3 = minLength(3);
const maxLength1500 = maxLength(1500);

/**
 * FaktaBegrunnelseTextField
 */
const FaktaBegrunnelseTextField = ({
  isReadOnly,
  isSubmittable,
  hasBegrunnelse,
  label,
  hasVurderingText,
  name,
}) => {
  const code = hasVurderingText ? 'FaktaBegrunnelseTextField.Vurdering' : 'FaktaBegrunnelseTextField.BegrunnEndringene';
  const textAreaLabel = label || { id: code };
  return (
    <RawIntlProvider value={intl}>
      {(isSubmittable || hasBegrunnelse) && (
        <div className={styles.begrunnelseTextField}>
          <TextAreaField
            name={name}
            label={isReadOnly ? '' : textAreaLabel}
            validate={[required, minLength3, maxLength1500, hasValidText]}
            textareaClass={isReadOnly ? styles.explanationTextareaReadOnly : styles.explanationTextarea}
            maxLength={1500}
            readOnly={isReadOnly}
          />
        </div>
      )}
    </RawIntlProvider>
  );
};

FaktaBegrunnelseTextField.propTypes = {
  isReadOnly: PropTypes.bool.isRequired,
  isSubmittable: PropTypes.bool.isRequired,
  hasBegrunnelse: PropTypes.bool.isRequired,
  label: PropTypes.string,
  hasVurderingText: PropTypes.bool,
  name: PropTypes.string,
};

FaktaBegrunnelseTextField.defaultProps = {
  name: 'begrunnelse',
  label: undefined,
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

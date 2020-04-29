import React, { FunctionComponent } from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';

import { TextAreaField } from '@fpsak-frontend/form';
import {
  decodeHtmlEntity, hasValidText, maxLength, minLength, requiredIfNotPristine,
} from '@fpsak-frontend/utils';

import styles from './prosessStegBegrunnelseTextField.less';

const minLength3 = minLength(3);
const maxLength1500 = maxLength(1500);

const getBegrunnelseTextCode = (readOnly) => (readOnly
  ? 'ProsessStegBegrunnelseTextField.ExplanationRequiredReadOnly'
  : 'ProsessStegBegrunnelseTextField.ExplanationRequired');

interface OwnProps {
  readOnly: boolean;
  textCode?: string;
  useAllWidth?: boolean;
}

/**
 * ProsessStegBegrunnelseTextField
 *
 * Presentasjonskomponent. Lar den NAV-ansatte skrive inn en begrunnelse før lagring av behandlingspunkter.
 */
const ProsessStegBegrunnelseTextFieldImpl: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  intl,
  readOnly,
  textCode,
  useAllWidth = false,
}) => (
  <div className={!useAllWidth ? styles.begrunnelseTextField : ''}>
    <TextAreaField
      name="begrunnelse"
      label={intl.formatMessage({ id: textCode || getBegrunnelseTextCode(readOnly) })}
      validate={[requiredIfNotPristine, minLength3, maxLength1500, hasValidText]}
      textareaClass={styles.explanationTextarea}
      maxLength={1500}
      readOnly={readOnly}
      placeholder={intl.formatMessage({ id: 'ProsessStegBegrunnelseTextField.BegrunnVurdering' })}
    />
  </div>
);

const ProsessStegBegrunnelseTextField = injectIntl(ProsessStegBegrunnelseTextFieldImpl);

const getBegrunnelse = (aksjonspunkter) => (aksjonspunkter.length > 0 && aksjonspunkter[0].begrunnelse
  ? aksjonspunkter[0].begrunnelse
  : '');

// @ts-ignore Korleis fikse dette på ein bra måte?
ProsessStegBegrunnelseTextField.buildInitialValues = (aksjonspunkter) => ({
  begrunnelse: decodeHtmlEntity(getBegrunnelse(aksjonspunkter)),
});

// @ts-ignore Korleis fikse dette på ein bra måte?
ProsessStegBegrunnelseTextField.transformValues = (values) => ({
  begrunnelse: values.begrunnelse,
});

export default ProsessStegBegrunnelseTextField;

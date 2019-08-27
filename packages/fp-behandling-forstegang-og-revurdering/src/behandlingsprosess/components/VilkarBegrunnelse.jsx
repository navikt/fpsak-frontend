import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { Row, Column } from 'nav-frontend-grid';

import { TextAreaField } from '@fpsak-frontend/form';
import {
  minLength, maxLength, requiredIfNotPristine, hasValidText, decodeHtmlEntity,
} from '@fpsak-frontend/utils';

import styles from './vilkarBegrunnelse.less';

const minLength3 = minLength(3);
const maxLength1500 = maxLength(1500);

/**
 * VilkarBegrunnelse
 *
 * Presentasjonskomponent. Lar den NAV-ansatte skrive inn en begrunnelse før overstyring av vilkår eller beregning.
 */
const VilkarBegrunnelseImpl = ({
  intl,
  isReadOnly,
  begrunnelseLabel,
}) => (
  <Row className={isReadOnly ? styles.margin : ''}>
    <Column xs="8">
      <TextAreaField
        name="begrunnelse"
        label={intl.formatMessage({ id: begrunnelseLabel })}
        validate={[requiredIfNotPristine, minLength3, maxLength1500, hasValidText]}
        textareaClass={styles.explanationTextarea}
        maxLength={1500}
        readOnly={isReadOnly}
      />
    </Column>
  </Row>
);

VilkarBegrunnelseImpl.propTypes = {
  intl: intlShape.isRequired,
  isReadOnly: PropTypes.bool.isRequired,
  begrunnelseLabel: PropTypes.string,
};

VilkarBegrunnelseImpl.defaultProps = {
  begrunnelseLabel: 'VilkarBegrunnelse.Vilkar',
};

const VilkarBegrunnelse = injectIntl(VilkarBegrunnelseImpl);

VilkarBegrunnelse.buildInitialValues = (aksjonspunkt) => ({
  begrunnelse: decodeHtmlEntity(aksjonspunkt && aksjonspunkt.begrunnelse ? aksjonspunkt.begrunnelse : ''),
});

VilkarBegrunnelse.transformValues = (values) => ({
  begrunnelse: values.begrunnelse,
});

export default VilkarBegrunnelse;

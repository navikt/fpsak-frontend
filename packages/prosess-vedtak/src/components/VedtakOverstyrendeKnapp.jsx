import React from 'react';
import PropTypes from 'prop-types';

import { CheckboxField } from '@fpsak-frontend/form';

import styles from './vedtakOverstyrendeKnapp.less';

const VedtakOverstyrendeKnapp = ({
  readOnly,
  readOnlyHideEmpty,
  toggleCallback,
  keyName,
}) => (
  <div className={styles.manuell}>
    <CheckboxField
      key={keyName}
      name={keyName}
      label={{ id: 'VedtakForm.ManuellOverstyring' }}
      onChange={toggleCallback}
      readOnly={readOnly}
      readOnlyHideEmpty={readOnlyHideEmpty}
    />
  </div>
);

VedtakOverstyrendeKnapp.propTypes = {
  toggleCallback: PropTypes.func.isRequired,
  keyName: PropTypes.string.isRequired,
  readOnly: PropTypes.bool.isRequired,
  readOnlyHideEmpty: PropTypes.bool,
};

VedtakOverstyrendeKnapp.defaultProps = {
  readOnlyHideEmpty: false,
};

export default VedtakOverstyrendeKnapp;

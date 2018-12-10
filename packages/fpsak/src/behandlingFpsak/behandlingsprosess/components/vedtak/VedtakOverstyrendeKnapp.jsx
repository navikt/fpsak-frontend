import React from 'react';
import PropTypes from 'prop-types';
import { CheckboxField } from 'form/Fields';
import styles from './vedtakOverstyrendeKnapp.less';


const VedtakOverstyrendeKnappImpl = ({
  readOnly, readOnlyHideEmpty, toggleCallback, keyName,
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

VedtakOverstyrendeKnappImpl.propTypes = {
  toggleCallback: PropTypes.func.isRequired,
  keyName: PropTypes.string.isRequired,
  readOnly: PropTypes.bool.isRequired,
  readOnlyHideEmpty: PropTypes.bool,
};

VedtakOverstyrendeKnappImpl.defaultProps = {
  readOnlyHideEmpty: false,
};

export default VedtakOverstyrendeKnappImpl;

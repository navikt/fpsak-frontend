import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import styles from './aksjonspunktBox.less';

const classNames = classnames.bind(styles);

const AksjonspunktBox = ({
  erAksjonspunktApent,
  className,
  children,
}) => <div className={classNames(className, 'aksjonspunkt', { erAksjonspunktApent })}>{children}</div>;

AksjonspunktBox.propTypes = {
  erAksjonspunktApent: PropTypes.bool.isRequired,
  className: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]).isRequired,
};

AksjonspunktBox.defaultProps = {
  className: undefined,
};

export default AksjonspunktBox;

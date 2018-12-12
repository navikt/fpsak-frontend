import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import styles from './flexColumn.less';

const classNames = classnames.bind(styles);

const FlexColumn = ({ children, className }) => (
  <div className={classNames('flexColumn', className)}>
    {children}
  </div>
);

FlexColumn.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
  className: PropTypes.string,
};

FlexColumn.defaultProps = {
  children: null,
  className: undefined,
};

export default FlexColumn;

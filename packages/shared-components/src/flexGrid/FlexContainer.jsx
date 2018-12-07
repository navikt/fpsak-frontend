import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import styles from './flexContainer.less';

const classNames = classnames.bind(styles);

const FlexContainer = ({ children, wrap }) => (
  <div className={classNames('flexContainer', 'fluid', { flexWrap: wrap })}>
    {children}
  </div>
);

FlexContainer.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
  wrap: PropTypes.bool,
};

FlexContainer.defaultProps = {
  children: null,
  wrap: false,
};

export default FlexContainer;

import React from 'react';
import PropTypes from 'prop-types';
import styles from './floatRight.less';

const FloatRight = ({ children }) => (
  <span className={styles.floatRight}>
    {children}
  </span>
);
FloatRight.propTypes = {
  children: PropTypes.node,
};
export default FloatRight;

import React from 'react';
import PropTypes from 'prop-types';

import styles from './linkRow.less';

const LinkRow = ({ children }) => (
  <div className={styles.linkRow}>
    {children}
  </div>
);

LinkRow.propTypes = {
  children: PropTypes.node.isRequired,
};

export default LinkRow;

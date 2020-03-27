import React, { ReactNode, FunctionComponent } from 'react';

import styles from './floatRight.less';

interface OwnProps {
  children?: ReactNode;
}

const FloatRight: FunctionComponent<OwnProps> = ({ children }) => (
  <span className={styles.floatRight}>
    {children}
  </span>
);

export default FloatRight;

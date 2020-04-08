import React, { FunctionComponent, ReactNode } from 'react';

import styles from './tooltip2.less';

interface OwnProps {
  children: ReactNode | string;
  content: ReactNode | string;
  alignLeft?: boolean;
  alignRight?: boolean;
  alignTop?: boolean;
  alignBottom?: boolean;
}

/**
 * Tooltip
 */
const Tooltip: FunctionComponent<OwnProps> = ({
  children,
  content,
}) => (
  <div className={styles.tooltip}>
    <div className={styles.tooltiptext}>{content}</div>
    {children}
  </div>
);

export default Tooltip;

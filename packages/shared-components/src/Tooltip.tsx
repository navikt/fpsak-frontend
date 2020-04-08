import React, { FunctionComponent, ReactNode } from 'react';

import styles from './tooltip.less';

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
    <span className={styles.tooltiptext}>{content}</span>
    {children}
  </div>
);

export default Tooltip;

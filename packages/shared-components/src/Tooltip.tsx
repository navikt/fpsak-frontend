import React, { FunctionComponent, ReactNode } from 'react';
import classnames from 'classnames/bind';

import styles from './tooltip.less';

const classNames = classnames.bind(styles);

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
  alignRight = true,
  alignLeft = false,
  alignTop = false,
  alignBottom = false,
}) => (
  <div className={styles.tooltip}>
    <span className={classNames(styles.tooltiptext, {
      left: alignLeft,
      right: alignRight,
      top: alignTop,
      bottom: alignBottom,
    })}
    >
      {content}
    </span>
    {children}
  </div>
);

export default Tooltip;

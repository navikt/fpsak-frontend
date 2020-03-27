import React, { FunctionComponent, ReactNode } from 'react';
import classnames from 'classnames/bind';

import VerticalSpacer from './VerticalSpacer';

import styles from './tooltip.less';

const classNames = classnames.bind(styles);

interface OwnProps {
  header: ReactNode;
  body?: ReactNode;
  show?: boolean;
  alignArrowLeft?: boolean;
  children: ReactNode;
}

/**
 * Tooltip
 */
const Tooltip: FunctionComponent<OwnProps> = ({
  header,
  body,
  show = false,
  alignArrowLeft = false,
  children,
}) => (
  <div className={styles.tooltip}>
    {children}
    {header
      && (
      <div className={classNames(styles.tooltiptext, {
        show, hide: !show, tooltiptextLeft: alignArrowLeft, tooltiptextBottom: !alignArrowLeft,
      })}
      >
        {header}
        <VerticalSpacer eightPx />
        {body}
      </div>
      )}
  </div>
);

export default Tooltip;

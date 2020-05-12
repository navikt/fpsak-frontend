import React, { FunctionComponent } from 'react';
import classnames from 'classnames/bind';

import styles from './verticalSpacer.less';

const classNames = classnames.bind(styles);

interface OwnProps {
  fourPx?: boolean;
  eightPx?: boolean;
  sixteenPx?: boolean;
  twentyPx?: boolean;
  thirtyTwoPx?: boolean;
  fourtyPx?: boolean;
}

/**
 * VerticalSpacer
 *
 * Presentasjonskomponent. Legg inn vertikalt tomrom.
 */
const VerticalSpacer: FunctionComponent<OwnProps> = ({
  fourPx = false,
  eightPx = false,
  sixteenPx = false,
  twentyPx = false,
  thirtyTwoPx = false,
  fourtyPx = false,
}) => (
  <div className={classNames({
    fourPx,
    eightPx,
    sixteenPx,
    twentyPx,
    thirtyTwoPx,
    fourtyPx,
  })}
  />
);

export default VerticalSpacer;

import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import styles from './verticalSpacer.less';

const classNames = classnames.bind(styles);

/**
 * VerticalSpacer
 *
 * Presentasjonskomponent. Legg inn vertikalt tomrom.
 */
const VerticalSpacer = ({
  fourPx,
  eightPx,
  sixteenPx,
  twentyPx,
  thirtyTwoPx,
  dashed,
}) => (
  <div className={classNames({
    fourPx,
    eightPx,
    sixteenPx,
    twentyPx,
    thirtyTwoPx,
    dashed,
  })}
  />
);

VerticalSpacer.propTypes = {
  fourPx: PropTypes.bool,
  eightPx: PropTypes.bool,
  sixteenPx: PropTypes.bool,
  twentyPx: PropTypes.bool,
  thirtyTwoPx: PropTypes.bool,
  dashed: PropTypes.bool,
};

VerticalSpacer.defaultProps = {
  fourPx: false,
  eightPx: false,
  sixteenPx: false,
  twentyPx: false,
  thirtyTwoPx: false,
  dashed: false,
};

export default VerticalSpacer;

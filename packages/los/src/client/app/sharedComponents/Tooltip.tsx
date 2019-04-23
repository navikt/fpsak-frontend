import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import VerticalSpacer from 'sharedComponents/VerticalSpacer';

import styles from './tooltip.less';

const classNames = classnames.bind(styles);

/**
 * Tooltip
 *
 */
const Tooltip = ({
  header,
  body,
  show,
  alignArrowLeft,
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
      )
    }
  </div>
);

Tooltip.propTypes = {
  header: PropTypes.node.isRequired,
  body: PropTypes.node,
  show: PropTypes.bool,
  alignArrowLeft: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

Tooltip.defaultProps = {
  body: undefined,
  show: true,
  alignArrowLeft: false,
};

export default Tooltip;

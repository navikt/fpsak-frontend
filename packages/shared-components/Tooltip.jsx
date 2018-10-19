import React from 'react';
import PropTypes from 'prop-types';

import VerticalSpacer from 'sharedComponents/VerticalSpacer';

import styles from './tooltip.less';

/**
 * Tooltip
 *
 */
const Tooltip = ({
  header,
  body,
  children,
}) => (
  <div className={styles.tooltip}>
    {children}
    {header
      && (
      <div className={styles.tooltiptext}>
        <h3>
          {header}
        </h3>
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
  children: PropTypes.node.isRequired,
};

Tooltip.defaultProps = {
  body: undefined,
};

export default Tooltip;

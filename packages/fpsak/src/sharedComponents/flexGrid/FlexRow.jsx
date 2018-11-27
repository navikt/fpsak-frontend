import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import styles from './flexRow.less';

const classNames = classnames.bind(styles);

const FlexRow = ({
  children, spaceBetween, alignItemsToBaseline, alignItemsToFlexEnd, wrap, className,
}) => (
  <div className={classNames('flexRow', { spaceBetween }, { alignItemsToBaseline }, { alignItemsToFlexEnd }, { wrap }, className)}>
    {children}
  </div>
);

FlexRow.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
  /**
   * spaceBetween: aktiverer { justify-content: space-between } på raden. Default er false.
   */
  spaceBetween: PropTypes.bool,
  alignItemsToBaseline: PropTypes.bool,
  alignItemsToFlexEnd: PropTypes.bool,
  wrap: PropTypes.bool,
  className: PropTypes.string,
};

FlexRow.defaultProps = {
  children: null,
  spaceBetween: false,
  alignItemsToBaseline: false,
  alignItemsToFlexEnd: false,
  wrap: false,
  className: undefined,
};

export default FlexRow;

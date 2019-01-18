import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import styles from './tableColumn.less';

const classNames = classnames.bind(styles);

/**
 * TableColumn
 *
 * Presentasjonskomponent. Tabellkolonne som brukes av komponenten Table.
 */
const TableColumn = ({
  children,
  className,
  hidden,
}) => {
  if (hidden) {
    return null;
  }
  return (
    <td className={classNames(styles.columnStyle, className)}>
      {children}
    </td>
  );
};

TableColumn.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.number.isRequired,
    PropTypes.string.isRequired,
    PropTypes.element.isRequired,
    PropTypes.node.isRequired,
  ]),
  className: PropTypes.string,
  hidden: PropTypes.bool,
};

TableColumn.defaultProps = {
  children: '',
  className: undefined,
  hidden: false,
};

export default TableColumn;

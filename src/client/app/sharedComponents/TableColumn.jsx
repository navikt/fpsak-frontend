import React from 'react';
import PropTypes from 'prop-types';

/**
 * TableColumn
 *
 * Presentasjonskomponent. Tabellkolonne som brukes av komponenten Table.
 */
const TableColumn = ({
  children,
  className,
  hidden,
}) => (hidden ? null : <td className={className}>{children}</td>);

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

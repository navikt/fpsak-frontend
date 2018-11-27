import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import styles from './tableRow.less';

const classNames = classnames.bind(styles);

/**
 * TableRow
 *
 * Presentasjonskomponent. Tabellrad som brukes av komponenten Table.
 */
const TableRow = ({
  id,
  model,
  isHeader,
  onMouseDown,
  onKeyDown,
  children,
  noHover,
  isSelected,
  isBold,
  isDashedBottomBorder,
  isSolidBottomBorder,
}) => {
  const keyDownHandler = (e) => {
    if (e.key === 'ArrowDown') {
      if (e.target.nextSibling) {
        e.target.nextSibling.focus();
        e.preventDefault();
      }
    } else if (e.key === 'ArrowUp') {
      if (e.target.previousSibling) {
        e.target.previousSibling.focus();
        e.preventDefault();
      }
    } else if (onKeyDown && (e.key === 'Enter' || e.key === ' ')) {
      onKeyDown(e, id, model);
      e.preventDefault();
    }
  };

  return (
    <tr
      className={classNames({
        rowHeader: isHeader,
        rowContent: (!isHeader && !noHover),
        selected: isSelected,
        bold: isBold,
        dashedBottomBorder: isDashedBottomBorder,
        solidBottomBorder: isSolidBottomBorder,
      })}
      onMouseDown={e => onMouseDown && onMouseDown(e, id, model)}
      onKeyDown={e => keyDownHandler(e)}
      tabIndex="0"
    >
      {children}
    </tr>
  );
};

TableRow.propTypes = {
  id: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  model: PropTypes.shape(),
  isHeader: PropTypes.bool,
  onMouseDown: PropTypes.func,
  onKeyDown: PropTypes.func,
  children: PropTypes.node.isRequired,
  noHover: PropTypes.bool,
  isSelected: PropTypes.bool,
  isBold: PropTypes.bool,
  isDashedBottomBorder: PropTypes.bool,
  isSolidBottomBorder: PropTypes.bool,
};

TableRow.defaultProps = {
  id: null,
  model: null,
  isHeader: false,
  onMouseDown: null,
  onKeyDown: null,
  noHover: false,
  isSelected: false,
  isBold: false,
  isDashedBottomBorder: false,
  isSolidBottomBorder: false,
};

export default TableRow;

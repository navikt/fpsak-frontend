import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import styles from './tableRow.less';

const classNames = classnames.bind(styles);

const createMouseDownHandler = (onMouseDown, id, model) => e => onMouseDown && onMouseDown(e, id, model);

const findNearestRow = element => (element.tagName === 'TR' ? element : findNearestRow(element.parentElement));

const setFocus = (e, isNext) => {
  const row = findNearestRow(e.target);
  const otherRow = isNext ? row.nextSibling : row.previousSibling;
  const element = otherRow || row;

  if (element) {
    element.focus();
    e.preventDefault();
  }
};

const createKeyHandler = (onKeyDown, id, model) => (e) => {
  if (e.key === 'ArrowDown') {
    setFocus(e, true);
  } else if (e.key === 'ArrowUp') {
    setFocus(e, false);
  } else if (onKeyDown && e.target.tagName !== 'TD' && (e.key === 'Enter' || e.key === ' ')) {
    onKeyDown(e, id, model);
    e.preventDefault();
  }
};

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
  isApLeftBorder,
  className,
}) => (
  <tr
    className={classNames(className, {
      rowHeader: isHeader,
      rowContent: (!isHeader && !noHover),
      selected: isSelected,
      bold: isBold,
      dashedBottomBorder: isDashedBottomBorder,
      solidBottomBorder: isSolidBottomBorder,
      apLeftBorder: isApLeftBorder,
    })}
    onMouseDown={createMouseDownHandler(onMouseDown, id, model)}
    onKeyDown={createKeyHandler(onKeyDown, id, model)}
    tabIndex={0}
  >
    {children}
  </tr>
);

TableRow.propTypes = {
  id: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  model: PropTypes.shape({}),
  isHeader: PropTypes.bool,
  onMouseDown: PropTypes.func,
  onKeyDown: PropTypes.func,
  children: PropTypes.node.isRequired,
  noHover: PropTypes.bool,
  isSelected: PropTypes.bool,
  isBold: PropTypes.bool,
  isDashedBottomBorder: PropTypes.bool,
  isSolidBottomBorder: PropTypes.bool,
  isApLeftBorder: PropTypes.bool,
  className: PropTypes.string,
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
  isApLeftBorder: false,
  className: undefined,
};

export default TableRow;

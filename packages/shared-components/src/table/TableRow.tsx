import React, { ReactNode, FunctionComponent } from 'react';
import classnames from 'classnames/bind';

import styles from './tableRow.less';

const classNames = classnames.bind(styles);

const createMouseDownHandler = (onMouseDown, id, model) => (e) => onMouseDown && onMouseDown(e, id, model);

const findNearestRow = (element) => (element.tagName === 'TR' ? element : findNearestRow(element.parentElement));

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

interface OwnProps {
  id?: number | string;
  model?: {};
  isHeader?: boolean;
  onMouseDown?: () => void;
  onKeyDown?: () => void;
  children: ReactNode | ReactNode[];
  noHover?: boolean;
  isSelected?: boolean;
  isBold?: boolean;
  isDashedBottomBorder?: boolean;
  isSolidBottomBorder?: boolean;
  isApLeftBorder?: boolean;
  className?: string;
}

/**
 * TableRow
 *
 * Presentasjonskomponent. Tabellrad som brukes av komponenten Table.
 */
const TableRow: FunctionComponent<OwnProps> = ({
  id,
  model,
  isHeader = false,
  onMouseDown,
  onKeyDown,
  children,
  noHover = false,
  isSelected = false,
  isBold = false,
  isDashedBottomBorder = false,
  isSolidBottomBorder = false,
  isApLeftBorder = false,
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

export default TableRow;

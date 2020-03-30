import React, { ReactNode, FunctionComponent } from 'react';
import classnames from 'classnames/bind';

import styles from './tableColumn.less';

const classNames = classnames.bind(styles);

interface OwnProps {
  children: number | string | ReactNode;
  className?: string;
  hidden?: boolean;
}

/**
 * TableColumn
 *
 * Presentasjonskomponent. Tabellkolonne som brukes av komponenten Table.
 */
const TableColumn: FunctionComponent<OwnProps> = ({
  children = '',
  className,
  hidden = false,
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

export default TableColumn;

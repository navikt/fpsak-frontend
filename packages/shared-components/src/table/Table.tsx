import React, { ReactElement, FunctionComponent } from 'react';
import { FormattedHTMLMessage } from 'react-intl';
import classnames from 'classnames/bind';

import TableRow from './TableRow';
import TableColumn from './TableColumn';

import styles from './table.less';

const classNames = classnames.bind(styles);

const EMPTY_STRING = 'EMPTY';

interface OwnProps {
  headerTextCodes?: any;
  children: ReactElement | ReactElement[];
  classNameTable?: string;
  noHover?: boolean;
  allowFormattedHeader?: boolean;
}

/**
 * Table
 *
 * Presentasjonskomponent. Definerer en tabell med rader og kolonner.
 */
const Table: FunctionComponent<OwnProps> = ({
  headerTextCodes = [],
  allowFormattedHeader = false,
  classNameTable = '',
  noHover = false,
  children,
}) => (
  <table className={classNames('table', { [classNameTable]: classNameTable, noHover })}>
    <thead>
      <TableRow isHeader noHover={noHover}>
        {headerTextCodes.map((headerElement) => {
          if (typeof headerElement === 'string' && headerElement.startsWith(EMPTY_STRING)) {
            return <TableColumn key={headerElement}>&nbsp;</TableColumn>;
          }
          return (
            <TableColumn key={headerElement.key ? headerElement.key : headerElement}>
              { allowFormattedHeader && headerElement}
              { !allowFormattedHeader && <FormattedHTMLMessage id={headerElement} />}
            </TableColumn>
          );
        })}
      </TableRow>
    </thead>
    <tbody>
      {Array.isArray(children) ? React.Children.map(children, ((child) => React.cloneElement(child, { noHover }))) : React.cloneElement(children, { noHover })}
    </tbody>
  </table>
);

export default Table;

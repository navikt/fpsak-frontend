import React, { ReactElement, FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import classnames from 'classnames/bind';

import TableRow from './TableRow';
import TableColumn from './TableColumn';

import styles from './table.less';

const classNames = classnames.bind(styles);

const EMPTY_STRING = 'EMPTY';

interface OwnProps {
  headerTextCodes?: any;
  headerColumnContent?: ReactElement[];
  children: ReactElement | ReactElement[];
  classNameTable?: string;
  noHover?: boolean;
}

/**
 * Table
 *
 * Presentasjonskomponent. Definerer en tabell med rader og kolonner.
 */
const Table: FunctionComponent<OwnProps> = ({
  headerTextCodes = [],
  headerColumnContent = [],
  classNameTable = '',
  noHover = false,
  children,
}) => (
  <table className={classNames('table', { [classNameTable]: classNameTable, noHover })}>
    <thead>
      <TableRow isHeader noHover={noHover}>
        {headerTextCodes.map((headerElement) => (typeof headerElement === 'string' && headerElement.startsWith(EMPTY_STRING)
          ? <TableColumn key={headerElement}>&nbsp;</TableColumn>
          : (
            <TableColumn key={headerElement.key ? headerElement.key : headerElement}>
              <FormattedMessage id={headerElement} />
            </TableColumn>
          )))}
        {headerColumnContent.map((element) => (
          <TableColumn key={element.key}>
            {element}
          </TableColumn>
        ))}
      </TableRow>
    </thead>
    <tbody>
      {Array.isArray(children) ? React.Children.map(children, ((child) => React.cloneElement(child, { noHover }))) : React.cloneElement(children, { noHover })}
    </tbody>
  </table>
);

export default Table;

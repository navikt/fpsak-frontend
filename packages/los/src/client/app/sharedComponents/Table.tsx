import React from 'react';
import PropTypes from 'prop-types';
import { FormattedHTMLMessage } from 'react-intl';
import classnames from 'classnames/bind';

import TableRow from './TableRow';
import TableColumn from './TableColumn';

import styles from './table.less';

const classNames = classnames.bind(styles);

const EMPTY_STRING = 'EMPTY';

const isString = value => typeof value === 'string';


/**
 * Table
 *
 * Presentasjonskomponent. Definerer en tabell med rader og kolonner.
 */
const Table = ({
  headerTextCodes,
  allowFormattedHeader,
  classNameTable,
  children,
  noHover,
}) => (
  <table className={classNames('table', { [classNameTable]: classNameTable, noHover })}>
    <thead>
      <TableRow isHeader noHover={noHover}>
        {headerTextCodes.map((headerElement) => {
          if (isString(headerElement) && headerElement.startsWith(EMPTY_STRING)) {
            return <TableColumn key={headerElement}>&nbsp;</TableColumn>;
          }
          return (
            <TableColumn key={headerElement.key ? headerElement.key : headerElement}>
              { allowFormattedHeader
              && headerElement
              }
              { !allowFormattedHeader
              && <FormattedHTMLMessage id={headerElement} />
              }
            </TableColumn>
          );
        })}
      </TableRow>
    </thead>
    <tbody>
      {children.length ? children.map(child => React.cloneElement(child, { noHover })) : React.cloneElement(children, { noHover })}
    </tbody>
  </table>
);

Table.propTypes = {
  /**
   * En liste med kolonne-overskrifter
   */
  headerTextCodes: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string.isRequired),
    PropTypes.arrayOf(PropTypes.shape({}).isRequired),
  ]),
  /**
   * Radene og kolonnene i tabellen.
   */
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element.isRequired).isRequired,
    PropTypes.element.isRequired,
  ]).isRequired,
  classNameTable: PropTypes.string,
  noHover: PropTypes.bool,
  allowFormattedHeader: PropTypes.bool,
};

Table.defaultProps = {
  headerTextCodes: [],
  classNameTable: '',
  noHover: false,
  allowFormattedHeader: false,
};

export default Table;

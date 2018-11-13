import React from 'react';
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl';
import { Table, TableRow, TableColumn } from '@fpsak-frontend/shared-components/table';
import { getRangeOfMonths } from '@fpsak-frontend/utils/dateUtils';
import avregningCodes from '@fpsak-frontend/kodeverk/avregningCodes';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import moment from 'moment/moment';
import CollapseButton from './CollapseButton';
import styles from './avregningTable.less';

const classNames = classnames.bind(styles);

const getHeaderCodes = (showCollapseButton, collapseProps, rangeOfMonths) => {
  const firstElement = showCollapseButton ? <CollapseButton {...collapseProps} key={`collapseButton-${rangeOfMonths.length}`} /> : <div />;
  return [
    firstElement,
    ...rangeOfMonths.map(month => <FormattedHTMLMessage id={`Avregning.headerText.${month.month}`} key={`${month.month}-${month.year}`} />),
  ];
};

const showCollapseButton = mottakerResultatPerFag => mottakerResultatPerFag.some(fag => fag.rader.length > 1);

const rowToggable = (fagOmråde, rowIsFeilUtbetalt) => {
  const fagFeilUtbetalt = fagOmråde.rader.find(rad => rad.feltnavn === avregningCodes.DIFFERANSE);
  return fagFeilUtbetalt && !rowIsFeilUtbetalt;
};

const rowIsHidden = (isRowToggable, showDetails) => isRowToggable && !showDetails;

const createColumns = (perioder, rangeOfMonths) => {
  let perioderData = [];
  const periodeTom = periode => (periode.tom ? periode.tom : periode.periode.tom);
  const lastPeriod = `${rangeOfMonths[rangeOfMonths.length - 1].month}${rangeOfMonths[rangeOfMonths.length - 1].year}`;

  if (rangeOfMonths.length !== perioder.length) {
    perioderData = rangeOfMonths.map((month) => {
      const periodeExists = perioder.find(periode => moment(periodeTom(periode)).format('MMMMYY') === `${month.month}${month.year}`);
      return periodeExists || { måned: month, amount: null };
    });
  } else {
    perioderData = perioder;
  }

  return perioderData.map((måned, månedIndex) => (
    <TableColumn
      key={`columnIndex${månedIndex + 1}`}
      className={classNames({
        rodTekst: måned.beløp < 0,
        lastColumn: måned.måned
          ? måned.måned === rangeOfMonths[rangeOfMonths.length - 1]
          : moment(periodeTom(måned)).format('MMMMYY') === lastPeriod,
      })}
    >
      {måned.beløp}
    </TableColumn>
  ));
};

const AvregningTable = ({ simuleringResultat, toggleDetails, showDetails }) => {
  const rangeOfMonths = getRangeOfMonths(simuleringResultat.periodeFom, simuleringResultat.periodeTom);
  return (
    <div className={styles.table}>
      {
        simuleringResultat.perioderPerMottaker.map((mottaker, mottakerIndex) => (
          <Table
            headerTextCodes={getHeaderCodes(
              showCollapseButton(mottaker.resultatPerFagområde),
              { toggleDetails, showDetails: showDetails[mottakerIndex] ? showDetails[mottakerIndex].show : false, mottakerIndex },
              rangeOfMonths,
            )}
            allowFormattedHeader
            key={`tableIndex${mottakerIndex + 1}`}
          >
            {
              mottaker.resultatPerFagområde.map((fagOmråde, fagIndex) => fagOmråde.rader.filter((rad) => {
                const isFeilUtbetalt = rad.feltnavn === avregningCodes.DIFFERANSE;
                const isRowToggable = rowToggable(fagOmråde, isFeilUtbetalt);
                return !rowIsHidden(isRowToggable, showDetails[mottakerIndex] ? showDetails[mottakerIndex].show : false);
              })
                .map((rad, rowIndex) => {
                  const isFeilUtbetalt = rad.feltnavn === avregningCodes.DIFFERANSE;
                  const isRowToggable = rowToggable(fagOmråde, isFeilUtbetalt);
                  return (
                    <TableRow
                      isBold={isFeilUtbetalt}
                      isDashedBottomBorder={isRowToggable}
                      isSolidBottomBorder={!isRowToggable}
                      key={`rowIndex${fagIndex + 1}${rowIndex + 1}`}
                    >
                      <TableColumn>
                        <FormattedMessage id={`Avregning.${fagOmråde.fagOmrådeKode.kode}.${rad.feltnavn}`} />
                      </TableColumn>
                      {createColumns(rad.resultaterPerMåned, rangeOfMonths)}
                    </TableRow>
                  );
                })).flat()
                .concat(mottaker.resultatOgMotregningRader.map((resultat, resultatIndex) => (
                  <TableRow
                    isBold={resultat.feltnavn !== avregningCodes.INNTREKKNESTEMÅNED}
                    isSolidBottomBorder
                    key={`rowIndex${resultatIndex + 1}`}
                  >
                    <TableColumn>
                      <FormattedMessage id={`Avregning.${resultat.feltnavn}`} />
                    </TableColumn>
                    {createColumns(resultat.resultaterPerMåned, rangeOfMonths)}
                  </TableRow>
                )))
            }
          </Table>
        ))}
    </div>
  );
};

AvregningTable.propTypes = {
  toggleDetails: PropTypes.func.isRequired,
  showDetails: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  simuleringResultat: PropTypes.shape().isRequired,
};

export default AvregningTable;

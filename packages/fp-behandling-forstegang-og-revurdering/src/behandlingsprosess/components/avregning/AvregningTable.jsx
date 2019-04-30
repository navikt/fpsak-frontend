import React from 'react';
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';
import { Table, TableRow, TableColumn } from '@fpsak-frontend/shared-components';
import { getRangeOfMonths, formatCurrencyNoKr } from '@fpsak-frontend/utils';
import avregningCodes from '@fpsak-frontend/kodeverk/src/avregningCodes';
import mottakerTyper from '@fpsak-frontend/kodeverk/src/mottakerTyper';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import moment from 'moment/moment';
import CollapseButton from './CollapseButton';
import styles from './avregningTable.less';

const classNames = classnames.bind(styles);
const isNextPeriod = (month, nextPeriod) => `${month.month}${month.year}` === (nextPeriod ? moment(nextPeriod).format('MMMMYY') : false);
const getHeaderCodes = (showCollapseButton, collapseProps, rangeOfMonths, nextPeriod) => {
  const firstElement = showCollapseButton ? <CollapseButton {...collapseProps} key={`collapseButton-${rangeOfMonths.length}`} /> : <div />;
  return [
    firstElement,
    ...rangeOfMonths.map(month => (
      <span
        className={classNames({
          nextPeriod: isNextPeriod(month, nextPeriod),
          normalPeriod: !isNextPeriod(month, nextPeriod),
        })}
        key={`${month.month}-${month.year}`}
      >
        <FormattedHTMLMessage id={`Avregning.headerText.${month.month}`} />
      </span>
    )),
  ];
};

const showCollapseButton = mottakerResultatPerFag => mottakerResultatPerFag.some(fag => fag.rader.length > 1);

const rowToggable = (fagOmråde, rowIsFeilUtbetalt) => {
  const fagFeilUtbetalt = fagOmråde.rader.find(rad => rad.feltnavn === avregningCodes.DIFFERANSE);
  return fagFeilUtbetalt && !rowIsFeilUtbetalt;
};

const rowIsHidden = (isRowToggable, showDetails) => isRowToggable && !showDetails;

const createColumns = (perioder, rangeOfMonths, nextPeriod) => {
  const nextPeriodFormatted = `${moment(nextPeriod).format('MMMMYY')}`;

  const perioderData = rangeOfMonths.map((month) => {
    const periodeExists = perioder.find(periode => moment(periode.periode.tom).format('MMMMYY') === `${month.month}${month.year}`);
    return periodeExists || { måned: `${month.month}${month.year}`, beløp: null };
  });

  return perioderData.map((måned, månedIndex) => (
    <TableColumn
      key={`columnIndex${månedIndex + 1}`}
      className={classNames({
        rodTekst: måned.beløp < 0,
        lastColumn: måned.måned ? måned.måned === nextPeriodFormatted : moment(måned.periode.tom).format('MMMMYY') === nextPeriodFormatted,
      })}
    >
      {formatCurrencyNoKr(måned.beløp)}
    </TableColumn>
  ));
};

const tableTitle = mottaker => (mottaker.mottakerType.kode === mottakerTyper.ARBG
  ? (
    <Normaltekst className={styles.tableTitle}>
      {mottaker.mottakerNavn}
      {' '}
(
      {mottaker.mottakerNummer}
)
    </Normaltekst>
  )
  : null
);

const getResultatRadene = (ingenPerioderMedAvvik, resultatPerFagområde, resultatOgMotregningRader) => {
  if (!ingenPerioderMedAvvik) {
    return resultatOgMotregningRader;
  }
  return resultatPerFagområde.length > 1 ? resultatOgMotregningRader.filter(resultat => resultat.feltnavn !== avregningCodes.INNTREKKNESTEMÅNED) : [];
};

const avvikBruker = (ingenPerioderMedAvvik, mottakerTypeKode) => (!!(ingenPerioderMedAvvik && mottakerTypeKode === mottakerTyper.BRUKER));
const getPeriodeFom = (periodeFom, nesteUtbPeriodeFom) => (periodeFom || nesteUtbPeriodeFom);
const getPeriod = (ingenPerioderMedAvvik, periodeFom, mottaker) => getRangeOfMonths(
  avvikBruker(ingenPerioderMedAvvik, mottaker.mottakerType.kode)
    ? moment(mottaker.nestUtbPeriodeTom).subtract(1, 'months')
    : getPeriodeFom(periodeFom, mottaker.nesteUtbPeriodeFom),
  mottaker.nestUtbPeriodeTom,
);

const AvregningTable = ({
  simuleringResultat, toggleDetails, showDetails, ingenPerioderMedAvvik,
}) => (
  simuleringResultat.perioderPerMottaker.map((mottaker, mottakerIndex) => {
    const rangeOfMonths = getPeriod(ingenPerioderMedAvvik, simuleringResultat.periodeFom, mottaker);
    const nesteMåned = mottaker.nestUtbPeriodeTom;
    const visDetaljer = showDetails.find(d => d.id === mottakerIndex);
    return (
      <div className={styles.tableWrapper} key={`tableIndex${mottakerIndex + 1}`}>
        { tableTitle(mottaker) }
        <Table
          headerTextCodes={getHeaderCodes(
            showCollapseButton(mottaker.resultatPerFagområde),
            { toggleDetails, showDetails: (visDetaljer ? visDetaljer.show : false), mottakerIndex },
            rangeOfMonths,
            nesteMåned,
          )}
          allowFormattedHeader
          key={`tableIndex${mottakerIndex + 1}`}
          classNameTable={styles.simuleringTable}
        >
          {[].concat(
            ...mottaker.resultatPerFagområde.map((fagOmråde, fagIndex) => fagOmråde.rader.filter((rad) => {
              const isFeilUtbetalt = rad.feltnavn === avregningCodes.DIFFERANSE;
              const isRowToggable = rowToggable(fagOmråde, isFeilUtbetalt);
              return !rowIsHidden(isRowToggable, visDetaljer ? visDetaljer.show : false);
            })
              .map((rad, rowIndex) => {
                const isFeilUtbetalt = rad.feltnavn === avregningCodes.DIFFERANSE;
                const isRowToggable = rowToggable(fagOmråde, isFeilUtbetalt);
                return (
                  <TableRow
                    isBold={isFeilUtbetalt || ingenPerioderMedAvvik}
                    isDashedBottomBorder={isRowToggable}
                    isSolidBottomBorder={!isRowToggable}
                    key={`rowIndex${fagIndex + 1}${rowIndex + 1}`}
                  >
                    <TableColumn>
                      <FormattedMessage id={`Avregning.${fagOmråde.fagOmrådeKode.kode}.${rad.feltnavn}`} />
                    </TableColumn>
                    {createColumns(rad.resultaterPerMåned, rangeOfMonths, nesteMåned)}
                  </TableRow>
                );
              })),
          )
            .concat(getResultatRadene(ingenPerioderMedAvvik, mottaker.resultatPerFagområde, mottaker.resultatOgMotregningRader)
              .map((resultat, resultatIndex) => (
                <TableRow
                  isBold={resultat.feltnavn !== avregningCodes.INNTREKKNESTEMÅNED}
                  isSolidBottomBorder
                  key={`rowIndex${resultatIndex + 1}`}
                >
                  <TableColumn>
                    <FormattedMessage id={`Avregning.${resultat.feltnavn}`} />
                  </TableColumn>
                  {createColumns(resultat.resultaterPerMåned, rangeOfMonths, nesteMåned)}
                </TableRow>
              )))
        }
        </Table>
      </div>
    );
  })
);

AvregningTable.propTypes = {
  toggleDetails: PropTypes.func.isRequired,
  showDetails: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  simuleringResultat: PropTypes.shape().isRequired,
  ingenPerioderMedAvvik: PropTypes.bool.isRequired,
};

export default AvregningTable;

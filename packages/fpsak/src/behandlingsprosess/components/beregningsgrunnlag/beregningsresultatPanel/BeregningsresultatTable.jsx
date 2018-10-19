import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import moment from 'moment';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { Undertittel, Normaltekst, Element } from 'nav-frontend-typografi';
import { getBeregningsgrunnlagLedetekster, getBeregningsgrunnlagPerioder } from 'behandling/behandlingSelectors';
import Table from 'sharedComponents/Table';
import TableRow from 'sharedComponents/TableRow';
import TableColumn from 'sharedComponents/TableColumn';
import BorderBox from 'sharedComponents/BorderBox';
import { DDMMYYYY_DATE_FORMAT } from 'utils/formats';
import { formatCurrencyNoKr } from 'utils/currencyUtils';
import periodeAarsak from 'kodeverk/periodeAarsak';

import styles from './beregningsresultatTable.less';

const createTableRows = (listOfEntries, listOfDagsatser) => {
  const rows = listOfEntries.map((entry, index) => (
    <TableRow key={`index${index + 1}`}>
      {entry.map((col, index2) => (
        <TableColumn key={`index2${index2 + 1}`}>
          {col}
        </TableColumn>
      ))}
    </TableRow>
  ));
  const summaryRow = (
    <TableRow key="beregningOppsummering">
      <TableColumn><Undertittel><FormattedMessage id="Beregningsgrunnlag.BeregningTable.Dagsats" /></Undertittel></TableColumn>
      {listOfDagsatser.map((dag, index) => (
        <TableColumn key={`index${index + 1}`}>
          <Undertittel>{dag}</Undertittel>
        </TableColumn>
      ))}
    </TableRow>
  );
  rows.push(summaryRow);
  return rows;
};

const constructPeriod = (fom, tom) => (
  <FormattedMessage
    id="Beregningsgrunnlag.AarsinntektPanel.Periode"
    key={`fom-tom${fom}${tom}`}
    values={{ fom: moment(fom).format(DDMMYYYY_DATE_FORMAT), tom: tom ? moment(tom).format(DDMMYYYY_DATE_FORMAT) : '' }}
  />
);
const periodeHarAarsakSomTilsierVisning = (aarsaker) => {
  if (aarsaker.length < 1) {
    return true;
  }
  const aarsakerSomTilsierMuligEndringIDagsats = [periodeAarsak.NATURALYTELSE_BORTFALT,
    periodeAarsak.ARBEIDSFORHOLD_AVSLUTTET, periodeAarsak.NATURALYTELSE_TILKOMMER];
  return aarsaker.filter(aarsak => aarsakerSomTilsierMuligEndringIDagsats.indexOf(aarsak.kode) !== -1).length > 0;
};
const createBeregningTableData = createSelector([getBeregningsgrunnlagPerioder, getBeregningsgrunnlagLedetekster], ((allePerioder, ledetekster) => {
  const headers = [<FormattedMessage id="Beregningsgrunnlag.AarsinntektPanel.TomString" />];
  const bruttoRad = [ledetekster.ledetekstBrutto];
  const avkortetRad = [ledetekster.ledetekstAvkortet];
  const redusertRad = [ledetekster.ledetekstRedusert];
  const dagsatserRad = [];
  // Kun dersom periodeårsaken kan endre dagsatsen på beregningsresultatet er
  // vi interessert i å vise den tilhørende perioden i resultattabellen.
  const perioderSomSkalVises = allePerioder.filter(periode => periodeHarAarsakSomTilsierVisning(periode.periodeAarsaker));

  perioderSomSkalVises.forEach((periode) => {
    headers.push(constructPeriod(periode.beregningsgrunnlagPeriodeFom, periode.beregningsgrunnlagPeriodeTom));
    bruttoRad.push(formatCurrencyNoKr(periode.bruttoInkludertBortfaltNaturalytelsePrAar));
    avkortetRad.push(formatCurrencyNoKr(periode.avkortetPrAar));
    redusertRad.push(formatCurrencyNoKr(periode.redusertPrAar));
    dagsatserRad.push(formatCurrencyNoKr(periode.dagsats));
  });
  const rows = [bruttoRad, avkortetRad, redusertRad];
  return {
    headers,
    rows,
    dagsatser: dagsatserRad,
  };
}));

/**
 * BeregningsresultatTable
 *
 * Presentasjonskomponent. Viser faktagruppe med beregningstabellen som viser inntekter brukt i
 * beregningen og hva dagsatsen ble.
 * Dersom vilkåret ble avslått vil grunnen til dette vises istedenfor tabellen
 */
const BeregningsresultatTable = ({
  isVilkarOppfylt,
  halvGVerdi,
  tableData,
}) => (
  <BorderBox>
    <Element>
      <FormattedMessage id="Beregningsgrunnlag.AarsinntektPanel.ApplicationInformationBeregning" />
    </Element>
    { isVilkarOppfylt
      && (
      <Table headerTextCodes={tableData.headers} allowFormattedHeader classNameTable={styles.beregningTable} noHover>
        {createTableRows(tableData.rows, tableData.dagsatser)}
      </Table>
      )
      }
    { !isVilkarOppfylt
      && (
      <Normaltekst>
        <FormattedHTMLMessage
          id="Beregningsgrunnlag.BeregningTable.VilkarIkkeOppfylt"
          values={{ halvG: formatCurrencyNoKr(halvGVerdi) }}
        />
      </Normaltekst>
      )
      }
  </BorderBox>
);

BeregningsresultatTable.propTypes = {
  halvGVerdi: PropTypes.number,
  isVilkarOppfylt: PropTypes.bool.isRequired,
  tableData: PropTypes.shape().isRequired,
};


BeregningsresultatTable.defaultProps = {
  halvGVerdi: undefined,
};

const mapStateToProps = state => ({
  tableData: createBeregningTableData(state),
});

export default connect(mapStateToProps)(injectIntl(BeregningsresultatTable));

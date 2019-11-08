import React from 'react';
import PropTypes from 'prop-types';
import Panel from 'nav-frontend-paneler';
import { FormattedHTMLMessage, FormattedMessage, injectIntl } from 'react-intl';
import moment from 'moment';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { Column, Row } from 'nav-frontend-grid';
import { DDMMYYYY_DATE_FORMAT, formatCurrencyNoKr } from '@fpsak-frontend/utils';
import periodeAarsak from '@fpsak-frontend/kodeverk/src/periodeAarsak';

import beregningStyles from '../beregningsgrunnlagPanel/beregningsgrunnlag_V2.less';


const createTableRows = (listofAndeler, listOfEntries, listOfDagsatser) => {
  const rows = listofAndeler.map((entry, index) => (
    <Row key={`index${index + 1}`}>
      <Column xs="8" key={`index2${index + 1}`}>
        <Normaltekst>{entry[0]}</Normaltekst>
      </Column>
      <Column xs="4" key={`index2${index + 2}`} className={beregningStyles.rightAlignElement}>
        <Normaltekst>{formatCurrencyNoKr(entry[1])}</Normaltekst>
      </Column>
    </Row>
  ));
  const lineRow = (
    <Row key="separator">
      <Column xs="12">
        <hr />
      </Column>
    </Row>
  );
  const rowsRedusert = listOfEntries.map((entry, index) => (
    <Row key={`index${index + 1}`}>
      <Column xs="8" key={`index2${index + 1}`}>
        <Normaltekst>{entry[0]}</Normaltekst>
      </Column>
      <Column xs="4" key={`index2${index + 2}`} className={beregningStyles.rightAlignElement}>
        <Normaltekst>{formatCurrencyNoKr(entry[1])}</Normaltekst>
      </Column>
    </Row>
  ));
  const summaryRow = (
    <>
      <Row key="beregningOppsummering">
        <Column xs="8">
          <Normaltekst>
            <span className={beregningStyles.semiBoldText}>
              <FormattedMessage id="Beregningsgrunnlag.BeregningTable.Dagsats" />
            </span>
            <span>
              {` (${listOfEntries[listOfEntries.length - 1][1]}/260)`}
            </span>
          </Normaltekst>
        </Column>
        {listOfDagsatser.map((dag, index) => (
          <Column xs="4" key={`index${index + 1}`} className={beregningStyles.rightAlignElement}>
            <Normaltekst className={beregningStyles.semiBoldText}>{dag}</Normaltekst>
          </Column>
        ))}
      </Row>
    </>
  );

  rows.push(lineRow);
  rows.push(rowsRedusert);
  rows.push(lineRow);
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
  return aarsaker.filter((aarsak) => aarsakerSomTilsierMuligEndringIDagsats.indexOf(aarsak.kode) !== -1).length > 0;
};

const createBeregningTableData = createSelector(
  [(state, ownProps) => ownProps.beregningsgrunnlagPerioder,
    (state, ownProps) => ownProps.ledetekstBrutto,
    (state, ownProps) => ownProps.ledetekstRedusert,
    (state, ownProps) => ownProps.ledetekstAvkortet],
  (allePerioder, ledetekstBrutto, ledetekstRedusert, ledetekstAvkortet) => {
    const headers = [<FormattedMessage id="Beregningsgrunnlag.AarsinntektPanel.TomString" />];
    const bruttoRad = [ledetekstBrutto];
    const atRad = ['Beregningsgrunnlag - omregnet årsinntekt arbeid'];
    const flRad = ['Beregningsgrunnlag - omregnet årsinntekt frilans'];
    const snRad = ['Beregningsgrunnlag - omregnet årsinntekt sn'];
    const aapRad = ['Beregningsgrunnlag - omregnet årsinntekt aap'];
    const dpRad = ['Beregningsgrunnlag - omregnet årsinntekt dagpenger'];


    // const bruttoRad = [`<Column xs="8"> ${ledetekstBrutto} </Column>`];
    const avkortetRad = [ledetekstAvkortet];
    const redusertRad = [ledetekstRedusert];
    const dagsatserRad = [];

    // Kun dersom periodeårsaken kan endre dagsatsen på beregningsresultatet er
    // vi interessert i å vise den tilhørende perioden i resultattabellen.
    const perioderSomSkalVises = allePerioder.filter((periode) => periodeHarAarsakSomTilsierVisning(periode.periodeAarsaker));
    perioderSomSkalVises.forEach((periode) => {
      const atAndeleler = periode.beregningsgrunnlagPrStatusOgAndel.filter((andel) => andel.aktivitetStatus.kode === aktivitetStatus.ARBEIDSTAKER);

      const flAndel = periode.beregningsgrunnlagPrStatusOgAndel.find((andel) => andel.aktivitetStatus.kode === aktivitetStatus.FRILANSER);
      const dpAndel = periode.beregningsgrunnlagPrStatusOgAndel.find((andel) => andel.aktivitetStatus.kode === aktivitetStatus.DAGPENGER);
      const aapAndel = periode.beregningsgrunnlagPrStatusOgAndel.find((andel) => andel.aktivitetStatus.kode === aktivitetStatus.ARBEIDSAVKLARINGSPENGER);
      const snAndel = periode.beregningsgrunnlagPrStatusOgAndel.find((andel) => andel.aktivitetStatus.kode === aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE);
      const flInntekt = flAndel ? flAndel.bruttoPrAar : undefined;
      const dpInntekt = dpAndel ? dpAndel.bruttoPrAar : undefined;
      const aapInntekt = aapAndel ? aapAndel.bruttoPrAar : undefined;
      const snInntekt = snAndel ? snAndel.bruttoPrAar : undefined;
      const atInntekt = atAndeleler && atAndeleler.length > 0 ? atAndeleler.reduce((a, b) => +a + +b.bruttoPrAar, 0) : undefined;
      atRad.push(atInntekt);
      dpRad.push(dpInntekt);
      aapRad.push(aapInntekt);
      snRad.push(snInntekt);
      flRad.push(flInntekt);
      headers.push(constructPeriod(periode.beregningsgrunnlagPeriodeFom, periode.beregningsgrunnlagPeriodeTom));
      bruttoRad.push(formatCurrencyNoKr(periode.bruttoInkludertBortfaltNaturalytelsePrAar));
      avkortetRad.push(formatCurrencyNoKr(periode.avkortetPrAar)); // redusert til 6g
      redusertRad.push(formatCurrencyNoKr(periode.redusertPrAar)); // Redusert til 89%
      dagsatserRad.push(formatCurrencyNoKr(periode.dagsats));
    });
    const rowsAndeler = [];

    if (atRad[1] !== undefined) { rowsAndeler.push(atRad); }
    if (flRad[1] !== undefined) { rowsAndeler.push(flRad); }
    if (snRad[1] !== undefined) { rowsAndeler.push(snRad); }
    if (aapRad[1] !== undefined) { rowsAndeler.push(aapRad); }
    if (dpRad[1] !== undefined) { rowsAndeler.push(dpRad); }

    const rows = [bruttoRad, avkortetRad, redusertRad];
    return {
      headers,
      rows,
      rowsAndeler,
      dagsatser: dagsatserRad,
    };
  },
);

/**
 * BeregningsresultatTable
 *
 * Presentasjonskomponent. Viser faktagruppe med beregningstabellen som viser inntekter brukt i
 * beregningen og hva dagsatsen ble.
 * Dersom vilkåret ble avslått vil grunnen til dette vises istedenfor tabellen
 */
const BeregningsresultatTable2 = ({
  isVilkarOppfylt,
  halvGVerdi,
  tableData,
}) => (
  <Panel>
    <Element>
      <FormattedMessage id="Beregningsgrunnlag.BeregningTable.Tittel" />
    </Element>
    { isVilkarOppfylt
      && createTableRows(tableData.rowsAndeler, tableData.rows, tableData.dagsatser)}
    { !isVilkarOppfylt
      && (
      <Normaltekst>
        <FormattedHTMLMessage
          id="Beregningsgrunnlag.BeregningTable.VilkarIkkeOppfylt"
          values={{ halvG: formatCurrencyNoKr(halvGVerdi) }}
        />
      </Normaltekst>
      )}

  </Panel>
);

BeregningsresultatTable2.propTypes = {
  halvGVerdi: PropTypes.number,
  isVilkarOppfylt: PropTypes.bool.isRequired,
  tableData: PropTypes.shape().isRequired,

};

BeregningsresultatTable2.defaultProps = {
  halvGVerdi: undefined,
};

const mapStateToProps = (state, ownProps) => ({
  tableData: createBeregningTableData(state, ownProps),
});

export default connect(mapStateToProps)(injectIntl(BeregningsresultatTable2));

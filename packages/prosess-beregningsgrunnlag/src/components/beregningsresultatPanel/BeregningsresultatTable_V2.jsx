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

import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import beregningStyles from '../beregningsgrunnlagPanel/beregningsgrunnlag_V2.less';
import beregningsgrunnlagVilkarPropType from '../../propTypes/beregningsgrunnlagVilkarPropType';

const createRowsAndeler = (listofAndeler, ikkeVurdert) => (listofAndeler.map((entry, index) => (
  <Row key={`indeAx${index + 1}`}>
    <Column xs="9" key={`indexAl2${index + 1}`}>
      <Normaltekst>
        {entry[0]}
      </Normaltekst>
    </Column>
    {!ikkeVurdert && (
      <Column xs="3" key={`indexAt2${index + 2}`} className={beregningStyles.rightAlignElement}>
        <Normaltekst>{formatCurrencyNoKr(entry[1])}</Normaltekst>
      </Column>
    )}
    {ikkeVurdert && (
      <Column xs="3" key={`indexAf2${index + 2}`} className={beregningStyles.rightAlignElement}>
        <Normaltekst className={beregningStyles.redError}><FormattedMessage id="Beregningsgrunnlag.BeregningTable.MåFastsettes" /></Normaltekst>
      </Column>
    )}
  </Row>
))
);
const lineRow = (key) => (
  <Row key={key || 'separator'}>
    <Column xs="12">
      <hr />
    </Column>
  </Row>
);
const createRowsRedusert = (listOfEntries) => (
  listOfEntries.map((entry, index) => (
    <Row key={`indexR${index + 1}`}>
      <Column xs="8" key={`indexR2${index + 1}`}>
        <Normaltekst>
          {entry[0]}
        </Normaltekst>
      </Column>
      <Column xs="4" key={`indexR2${index + 2}`} className={beregningStyles.rightAlignElement}>
        <Normaltekst>{formatCurrencyNoKr(entry[1])}</Normaltekst>
      </Column>
    </Row>
  ))
);
const summaryRow = (listOfDagsatser, listOfEntries, ikkeVurdert) => (
  <React.Fragment key="beregningOppsummeringWrapper">
    <Row key="beregningOppsummering">
      <Column xs="8" key="beregningOppsummeringLedetekst">
        <Normaltekst>
          <span className={beregningStyles.semiBoldText}>
            { !ikkeVurdert && (
            <FormattedMessage id="Beregningsgrunnlag.BeregningTable.DagsatsNy" values={{ dagSats: listOfEntries[listOfEntries.length - 1][1] }} />
            )}
            { ikkeVurdert && (
              <FormattedMessage id="Beregningsgrunnlag.BeregningTable.Dagsats.ikkeFastsatt" />
            )}
          </span>


        </Normaltekst>
      </Column>
      {!ikkeVurdert && listOfDagsatser.map((dag, index) => (
        <Column xs="4" key={`indexDS${index + 1}`} className={beregningStyles.rightAlignElement}>
          <Normaltekst className={beregningStyles.semiBoldText}>{dag}</Normaltekst>
        </Column>
      ))}
      {ikkeVurdert && (
        <Column xs="4" className={beregningStyles.rightAlignElement} key="beregningOppsummeDagsats">
          <Normaltekst className={beregningStyles.semiBoldText}>-</Normaltekst>
        </Column>
      )}
    </Row>
  </React.Fragment>
);
const createTableRows = (listofAndeler, listOfEntries, listOfDagsatser) => {
  const rows = [];

  if (listofAndeler && listofAndeler.length > 0) {
    rows.push(createRowsAndeler(listofAndeler));
    rows.push(lineRow('andelLinje'));
  }
  rows.push(createRowsRedusert(listOfEntries));
  rows.push(lineRow('redusertLinje'));
  rows.push(summaryRow(listOfDagsatser, listOfEntries));
  return rows;
};
const createTableRowsIkkeVurdert = (listofAndeler, listOfEntries, listOfDagsatser) => {
  const rows = [];
  if (listofAndeler && listofAndeler.length > 0) {
    rows.push(createRowsAndeler(listofAndeler, true));
    rows.push(lineRow('redusertAndelLinje'));
  }
  rows.push(summaryRow(listOfDagsatser, listOfEntries, true));
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

export const createBeregningTableData = createSelector(
  [(state, ownProps) => ownProps.beregningsgrunnlagPerioder,
    (state, ownProps) => ownProps.ledetekstBrutto,
    (state, ownProps) => ownProps.ledetekstRedusert,
    (state, ownProps) => ownProps.ledetekstAvkortet,
    (state, ownProps) => ownProps.vilkaarBG.vilkarStatus],
  (allePerioder, ledetekstBrutto, ledetekstRedusert, ledetekstAvkortet, vilkarStatus) => {
    const headers = [<FormattedMessage id="Beregningsgrunnlag.AarsinntektPanel.TomString" />];
    const bruttoRad = [ledetekstBrutto];
    const strKey = vilkarStatus && vilkarStatus.kode === vilkarUtfallType.OPPFYLT ? 'Omberegnet' : 'Fastsatt';
    const atRad = [<FormattedMessage id={`Beregningsgrunnlag.BeregningTable.${strKey}.AT`} />];
    const flRad = [<FormattedMessage id={`Beregningsgrunnlag.BeregningTable.${strKey}.FL`} />];
    const snRad = [<FormattedMessage id={`Beregningsgrunnlag.BeregningTable.${strKey}.SN`} />];
    const aapRad = [<FormattedMessage id={`Beregningsgrunnlag.BeregningTable.${strKey}.AT`} />];
    const dpRad = [<FormattedMessage id="Beregningsgrunnlag.BeregningTable.Dagpenger" />];
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
      const atInntekt = atAndeleler && atAndeleler.length > 0 ? atAndeleler.reduce((a, b) => a + b.bruttoPrAar, 0) : undefined;

      atRad.push(atInntekt);
      dpRad.push(dpInntekt);
      aapRad.push(aapInntekt);
      snRad.push(snInntekt);
      flRad.push(flInntekt);
      headers.push(constructPeriod(periode.beregningsgrunnlagPeriodeFom, periode.beregningsgrunnlagPeriodeTom));
      bruttoRad.push(formatCurrencyNoKr(periode.bruttoInkludertBortfaltNaturalytelsePrAar));
      avkortetRad.push(formatCurrencyNoKr(periode.avkortetPrAar));
      redusertRad.push(formatCurrencyNoKr(periode.redusertPrAar));
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
 * BeregningsresultatTable2
 *
 * Presentasjonskomponent. Viser faktagruppe med beregningstabellen som viser inntekter brukt i
 * beregningen og hva dagsatsen ble.
 * Dersom vilkåret ble avslått vil grunnen til dette vises istedenfor tabellen
 */
const BeregningsresultatTable2 = ({
  vilkaarBG,
  halvGVerdi,
  tableData,
}) => (
  <Panel className={beregningStyles.panel}>
    <Element>
      <FormattedMessage id="Beregningsgrunnlag.BeregningTable.Tittel" />
    </Element>
    { vilkaarBG && vilkaarBG.vilkarStatus.kode === vilkarUtfallType.OPPFYLT
      && createTableRows(tableData.rowsAndeler, tableData.rows, tableData.dagsatser)}
    { vilkaarBG && vilkaarBG.vilkarStatus.kode === vilkarUtfallType.IKKE_VURDERT
      && createTableRowsIkkeVurdert(tableData.rowsAndeler, tableData.rows, tableData.dagsatser)}
    { vilkaarBG && vilkaarBG.vilkarStatus.kode === vilkarUtfallType.IKKE_OPPFYLT
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
  vilkaarBG: beregningsgrunnlagVilkarPropType.isRequired,
  tableData: PropTypes.shape().isRequired,

};

BeregningsresultatTable2.defaultProps = {
  halvGVerdi: undefined,
};

const mapStateToProps = (state, ownProps) => ({
  tableData: createBeregningTableData(state, ownProps),
});

export default connect(mapStateToProps)(injectIntl(BeregningsresultatTable2));

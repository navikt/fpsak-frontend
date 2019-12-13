import React from 'react';
import PropTypes from 'prop-types';
import Panel from 'nav-frontend-paneler';
import { FormattedMessage, injectIntl } from 'react-intl';
import moment from 'moment';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { Column, Row } from 'nav-frontend-grid';
import { DDMMYYYY_DATE_FORMAT, formatCurrencyNoKr } from '@fpsak-frontend/utils';
import periodeAarsak from '@fpsak-frontend/kodeverk/src/periodeAarsak';

import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import avslaatIkonUrl from '@fpsak-frontend/assets/images/avslaatt_mini.svg';
import { Image, VerticalSpacer } from '@fpsak-frontend/shared-components';
import beregningStyles from '../beregningsgrunnlagPanel/beregningsgrunnlag_V2.less';
import beregningsgrunnlagVilkarPropType from '../../propTypes/beregningsgrunnlagVilkarPropType';
import styles from './beregningsresultatTable_V2.less';


const createRowsAndeler = (listofAndeler, ikkeVurdert) => (listofAndeler.map((entry, index) => (
  <Row key={`indeAx${index + 1}`}>
    <Column xs={ikkeVurdert ? '8' : '9'} key={`indexAl2${index + 1}`}>
      <Normaltekst>
        {entry.ledetekst}
      </Normaltekst>
    </Column>
    {!ikkeVurdert && (
      <Column xs="2" key={`indexAt2${index + 2}`} className={beregningStyles.rightAlignElement}>
        <Normaltekst>{formatCurrencyNoKr(entry.verdi)}</Normaltekst>
      </Column>
    )}
    {ikkeVurdert && entry.skalFastsetteGrunnlag === true && (
      <Column xs="3" key={`indexAf2${index + 2}`} className={styles.maaFastsettes}>
        <Normaltekst className={beregningStyles.redError}><FormattedMessage id="Beregningsgrunnlag.BeregningTable.MåFastsettes" /></Normaltekst>
      </Column>
    )}
    {ikkeVurdert && !entry.skalFastsetteGrunnlag && (
      <Column xs="3" key={`indexAf2${index + 2}`} className={beregningStyles.rightAlignElement}>
        <Normaltekst>{formatCurrencyNoKr(entry.verdi)}</Normaltekst>
      </Column>
    )}
  </Row>
))
);
const lineRow = (key) => (
  <Row key={key || 'separator'}>
    <Column xs="11" className={styles.colLine} />
  </Row>
);

const erRedusereVerdierLike = (listOfEntries) => {
  let alleLike = true;
  let lastEntry;
  listOfEntries.forEach((entry) => {
    if (lastEntry && lastEntry[1] !== entry[1]) {
      alleLike = false;
    }
    lastEntry = entry;
  });
  return alleLike;
};
const createRowsRedusert = (listOfEntries, verdierLike) => {
  if (!verdierLike) {
    return (
      listOfEntries.map((entry, index) => (
        <Row key={`indexR${index + 1}`}>
          <Column xs="9" key={`indexR2${index + 1}`}>
            <Normaltekst>
              {entry.ledetekst}
            </Normaltekst>
          </Column>
          <Column xs="2" key={`indexR2${index + 2}`} className={beregningStyles.rightAlignElement}>
            <Normaltekst>{formatCurrencyNoKr(entry.verdi)}</Normaltekst>
          </Column>
        </Row>
      ))
    );
  }
  const entry = listOfEntries[0];
  return (
    <Row>
      <Column xs="8">
        <Normaltekst>
          {entry.ledetekst}
        </Normaltekst>
      </Column>
      <Column xs="3" className={beregningStyles.rightAlignElement}>
        <Normaltekst>{formatCurrencyNoKr(entry.verdi)}</Normaltekst>
      </Column>
    </Row>
  );
};
const summaryRow = (listOfDagsatser, listOfEntries, ikkeVurdert) => (
  <React.Fragment key="beregningOppsummeringWrapper">
    <Row key="beregningOppsummering">
      <Column xs="8" key="beregningOppsummeringLedetekst">
        <Normaltekst>
          <span className={beregningStyles.semiBoldText}>
            { !ikkeVurdert && (
            <FormattedMessage
              id="Beregningsgrunnlag.BeregningTable.DagsatsNy"
              values={{ dagSats: formatCurrencyNoKr(listOfEntries[listOfEntries.length - 1].verdi) }}
            />
            )}
            { ikkeVurdert && (
              <FormattedMessage id="Beregningsgrunnlag.BeregningTable.Dagsats.ikkeFastsatt" />
            )}
          </span>


        </Normaltekst>
      </Column>
      {!ikkeVurdert && listOfDagsatser.map((dag, index) => (
        <Column xs="3" key={`indexDS${index + 1}`} className={beregningStyles.rightAlignElement}>
          <Normaltekst className={beregningStyles.semiBoldText}>{dag}</Normaltekst>
        </Column>
      ))}
      {ikkeVurdert && (
        <Column xs="3" className={beregningStyles.rightAlignElement} key="beregningOppsummeDagsats">
          <Normaltekst className={beregningStyles.semiBoldText}>-</Normaltekst>
        </Column>
      )}
    </Row>
  </React.Fragment>
);

const createRowsForklaringer = (forklaringsListe) => (
  forklaringsListe.map((forklaring) => (
    <>
      <Row>
        <Column xs="12">
          <Normaltekst>
            {forklaring}
          </Normaltekst>
        </Column>
      </Row>
      <VerticalSpacer twentyPx />
    </>
  ))
);

const createTableRows = (listofAndeler, listOfEntries, listOfDagsatser, listOfForklaringer) => {
  const rows = [];

  if (listOfForklaringer && listOfForklaringer.length > 0) {
    rows.push(createRowsForklaringer(listOfForklaringer));
  }
  if (listofAndeler && listofAndeler.length > 0) {
    rows.push(createRowsAndeler(listofAndeler));
    if (listofAndeler.length > 1) {
      rows.push(lineRow('andelLinje'));
    }
  }
  rows.push(createRowsRedusert(listOfEntries));
  rows.push(lineRow('redusertLinje'));

  }
  if (listOfEntries.length === 0) {
    rows.push(summaryRow(listOfDagsatser, listofAndeler));
  } else {rows.push(summaryRow(listOfDagsatser, listOfEntries));
}
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
const setTekstStrengKeyPavilkaarUtfallType = (vilkarStatus) => {
  if (vilkarStatus && (vilkarStatus.kode === vilkarUtfallType.OPPFYLT || vilkarStatus.kode === vilkarUtfallType.IKKE_OPPFYLT)) {
    return 'Omberegnet';
  }
  return 'Fastsatt';
};

export const createBeregningTableData = createSelector(
  [(state, ownProps) => ownProps.beregningsgrunnlagPerioder,
    (state, ownProps) => ownProps.aktivitetStatusList,
    (state, ownProps) => ownProps.dekningsgrad,
    (state, ownProps) => ownProps.vilkaarBG.vilkarStatus],
  (allePerioder, aktivitetStatusList, dekningsgrad, vilkarStatus) => {
    const headers = [<FormattedMessage id="Beregningsgrunnlag.AarsinntektPanel.TomString" />];
    // const bruttoRad = { ledetekst: ledetekstBrutto };
    const bruttoRad = { ledetekst: <FormattedMessage id="Beregningsgrunnlag.BeregningTable.BruttoTotalt" /> };
    const strKey = setTekstStrengKeyPavilkaarUtfallType(vilkarStatus);
    const atRad = { ledetekst: <FormattedMessage id={`Beregningsgrunnlag.BeregningTable.${strKey}.AT`} /> };
    const flRad = { ledetekst: <FormattedMessage id={`Beregningsgrunnlag.BeregningTable.${strKey}.FL`} /> };
    const snRad = { ledetekst: <FormattedMessage id={`Beregningsgrunnlag.BeregningTable.${strKey}.SN`} /> };
    const aapRad = { ledetekst: <FormattedMessage id={`Beregningsgrunnlag.BeregningTable.${strKey}.AAP`} /> };
    const ytRad = { ledetekst: <FormattedMessage id={`Beregningsgrunnlag.BeregningTable.${strKey}.Ytelse`} /> };
    const dpRad = { ledetekst: <FormattedMessage id="Beregningsgrunnlag.BeregningTable.Dagpenger" /> };
    // const avkortetRad = { ledetekst: ledetekstAvkortet };
    const avkortetRad = { ledetekst: <FormattedMessage id="Beregningsgrunnlag.BeregningTable.Avkortet6g" /> };
    // const redusertRad = { ledetekst: ledetekstRedusert };
    const redusertRad = { ledetekst: <FormattedMessage id="Beregningsgrunnlag.BeregningTable.RedusertProsent" values={{ redusert: dekningsgrad }} /> };
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
      const ytAndel = periode.beregningsgrunnlagPrStatusOgAndel.find((andel) => andel.aktivitetStatus.kode === aktivitetStatus.KUN_YTELSE);
      const flInntekt = flAndel ? flAndel.bruttoPrAar : undefined;
      const dpInntekt = dpAndel ? dpAndel.bruttoPrAar : undefined;
      const aapInntekt = aapAndel ? aapAndel.bruttoPrAar : undefined;
      const snInntekt = snAndel ? snAndel.pgiSnitt : undefined;
      const ytInntekt = ytAndel ? ytAndel.bruttoPrAar : undefined;
      const atInntekt = atAndeleler && atAndeleler.length > 0 ? atAndeleler.reduce((a, b) => a + b.bruttoPrAar, 0) : undefined;

      // const skalFastsetteAT = atAndeleler && atAndeleler.length > 0 ? atAndeleler.some((andeler) => andeler.skalFastsetteGrunnlag);
      const skalFastsetteAT = atAndeleler.some((andel) => andel.skalFastsetteGrunnlag === true);
      atRad.verdi = atInntekt;
      atRad.skalFastsetteGrunnlag = skalFastsetteAT;
      dpRad.verdi = dpInntekt;
      dpRad.skalFastsetteGrunnlag = dpAndel && dpAndel.skalFastsetteGrunnlag;
      aapRad.verdi = aapInntekt;
      aapRad.skalFastsetteGrunnlag = aapAndel && aapAndel.skalFastsetteGrunnlag;
      snRad.verdi = snInntekt;
      snRad.skalFastsetteGrunnlag = snAndel && snAndel.skalFastsetteGrunnlag;
      flRad.verdi = flInntekt;
      flRad.skalFastsetteGrunnlag = flAndel && flAndel.skalFastsetteGrunnlag;
      ytRad.verdi = ytInntekt;
      ytRad.skalFastsetteGrunnlag = ytAndel && ytAndel.skalFastsetteGrunnlag;
      headers.push(constructPeriod(periode.beregningsgrunnlagPeriodeFom, periode.beregningsgrunnlagPeriodeTom));
      bruttoRad.verdi = formatCurrencyNoKr(periode.bruttoInkludertBortfaltNaturalytelsePrAar);
      avkortetRad.verdi = formatCurrencyNoKr(periode.avkortetPrAar);
      if (dekningsgrad !== 100) {

      if (dekningsgrad !== 100) {
        redusertRad.verdi = formatCurrencyNoKr(periode.redusertPrAar);
      }
      dagsatserRad.push(formatCurrencyNoKr(periode.dagsats));
    });

    const rowsAndeler = [];
    const rowsForklaringer = [];
    const sortedStatusList = aktivitetStatusList.sort((a, b) => ((a.kode > b.kode) ? 1 : -1)); // sorter alfabvetis
    const aktivitetStatusKodeKombo = sortedStatusList.map((andelKode) => andelKode.kode).join('_');
    switch (aktivitetStatusKodeKombo) {
      case 'AT_SN': {
        if ((atRad && atRad.verdi) < (snRad && snRad.verdi)) {
          rowsAndeler.push(snRad);
        }
        if ((atRad && atRad.verdi) > (snRad && snRad.verdi)) {
          rowsForklaringer.push(<FormattedMessage id="Beregningsgrunnlag.BeregningTable.Omberegnet.ForklaringAT>SN" />);
          rowsAndeler.push(atRad);
        }
        break;
      }
      case 'AT_FL_SN': {
        if (((atRad && atRad.verdi) + (flRad && flRad.verdi)) > (snRad && snRad.verdi)) {
          rowsForklaringer.push(<FormattedMessage id="Beregningsgrunnlag.BeregningTable.Omberegnet.ForklaringAT_FL>SN" />);
          rowsAndeler.push(atRad);
          rowsAndeler.push(flRad);
        }
        if (((atRad && atRad.verdi) + (flRad && flRad.verdi)) < (snRad && snRad.verdi)) {
          rowsAndeler.push(atRad);
          rowsAndeler.push(flRad);
          rowsAndeler.push(snRad);
        }
        break;
      }
      case 'DP_FL_SN': {
        if (((dpRad && dpRad.verdi) + (flRad && flRad.verdi)) > (snRad && snRad.verdi)) {
          rowsForklaringer.push(<FormattedMessage id="Beregningsgrunnlag.BeregningTable.Omberegnet.ForklaringDP_FL>SN" />);
          rowsAndeler.push(flRad);
        }
        break;
      }
      case 'AT_DP_SN': {
        if (((dpRad && dpRad.verdi) + (atRad && atRad.verdi)) > (snRad && snRad.verdi)) {
          rowsForklaringer.push(<FormattedMessage id="Beregningsgrunnlag.BeregningTable.Omberegnet.ForklaringAT_DP>SN" />);
          rowsAndeler.push(atRad);
        }
        break;
      }
      case 'KUN_YTELSE': {
        if (ytRad && ytRad.verdi) {
          rowsAndeler.push(ytRad);
        }
        break;
      }
      default: {
        if (atRad.verdi !== undefined) { rowsAndeler.push(atRad); }
        if (flRad.verdi !== undefined) { rowsAndeler.push(flRad); }
        if (snRad.verdi !== undefined) { rowsAndeler.push(snRad); }
        if (aapRad.verdi !== undefined) { rowsAndeler.push(aapRad); }
        if (dpRad.verdi !== undefined) { rowsAndeler.push(dpRad); }
      }
    }
    const rows = [];
    if (bruttoRad.verdi !== avkortetRad.verdi) {
      rows.push(avkortetRad);
    }
    if (rowsAndeler.length > 1) {
      rows.unshift(bruttoRad);
    }
    if (redusertRad.verdi) {
      rows.push(redusertRad);
    }
    return {
      headers,
      rows,
      rowsAndeler,
      dagsatser: dagsatserRad,
      rowsForklaringer,
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
  intl,
  vilkaarBG,
  halvGVerdi,
  tableData,
}) => {
  console.log('tabledata', tableData); // eslint-disable-line no-console
  return (
    <Panel>
      <Element>
        <FormattedMessage id="Beregningsgrunnlag.BeregningTable.Tittel" />
      </Element>

      { vilkaarBG && vilkaarBG.vilkarStatus.kode === vilkarUtfallType.OPPFYLT
      && createTableRows(tableData.rowsAndeler, tableData.rows, tableData.dagsatser, tableData.rowsForklaringer)}
      { vilkaarBG && vilkaarBG.vilkarStatus.kode === vilkarUtfallType.IKKE_VURDERT
      && createTableRowsIkkeVurdert(tableData.rowsAndeler, tableData.rows, tableData.dagsatser)}
      { vilkaarBG && vilkaarBG.vilkarStatus.kode === vilkarUtfallType.IKKE_OPPFYLT
        && (
          <>
            {createRowsAndeler(tableData.rowsAndeler)}
            <VerticalSpacer twentyPx />
            <Normaltekst className={beregningStyles.redError}>
              <Image
                className={styles.avslaat_icon}
                alt={intl.formatMessage({ id: 'Beregningsgrunnlag.BeregningTable.VilkarIkkeOppfylt2' })}
                src={avslaatIkonUrl}
              />
              <FormattedMessage
                id="Beregningsgrunnlag.BeregningTable.VilkarIkkeOppfylt2"
                values={{ halvG: formatCurrencyNoKr(halvGVerdi) }}
              />
            </Normaltekst>
          </>
        )}

    </Panel>
  );
};

BeregningsresultatTable2.propTypes = {
  intl: PropTypes.shape().isRequired,
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

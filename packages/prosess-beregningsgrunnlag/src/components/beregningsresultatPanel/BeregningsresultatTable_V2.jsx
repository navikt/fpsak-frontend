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
import { DDMMYYYY_DATE_FORMAT, formatCurrencyNoKr, removeSpacesFromNumber } from '@fpsak-frontend/utils';
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
  if (listOfEntries.length === 0) {
    rows.push(summaryRow(listOfDagsatser, listofAndeler));
  } else {
    if (listOfEntries.length === 0) {
    rows.push(summaryRow(listOfDagsatser, listofAndeler));
  } else {
    if (listOfEntries.length === 0) {
    rows.push(summaryRow(listOfDagsatser, listofAndeler));
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
const createPeriodeHeader = (header) => (
  <>
    <VerticalSpacer twentyPx />
    <Normaltekst className={beregningStyles.semiBoldText}>{header}</Normaltekst>
  </>
);
const createPeriodeResultat = (vilkaarBG, tableData, lagPeriodeHeaders) => (
  <React.Fragment key={`Wr${tableData.dagsatser[0]}`}>
    {tableData && lagPeriodeHeaders && createPeriodeHeader(tableData.headers)}
    { vilkaarBG && vilkaarBG.vilkarStatus.kode === vilkarUtfallType.OPPFYLT
  && createTableRows(tableData.rowsAndeler, tableData.rows, tableData.dagsatser, tableData.rowsForklaringer)}
    { vilkaarBG && vilkaarBG.vilkarStatus.kode === vilkarUtfallType.IKKE_VURDERT
  && createTableRowsIkkeVurdert(tableData.rowsAndeler, tableData.rows, tableData.dagsatser)}
    { vilkaarBG && vilkaarBG.vilkarStatus.kode === vilkarUtfallType.IKKE_OPPFYLT
  && (
    <React.Fragment key={`IVR2${tableData.dagsatser[0]}`}>
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
    </React.Fragment>
  )}
  </React.Fragment>
);

const constructPeriod = (fom, tom) => (
  <FormattedMessage
    id="Beregningsgrunnlag.BeregningTable.Periode"
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
const setTekstStrengKeyPavilkaarUtfallType = (vilkarStatus, skalFastsetteGrunnlag) => {
  if (vilkarStatus && ((vilkarStatus.kode === vilkarUtfallType.OPPFYLT && !skalFastsetteGrunnlag) || vilkarStatus.kode === vilkarUtfallType.IKKE_OPPFYLT)) {
    return 'Omberegnet';
  }
  return 'Fastsatt';
};
const opprettAndelElement = (andel, andelType, vilkarStatus) => {
  let inntekt;
  const andelElement = {};
  let skalFastsetteGrunnlag = false;
  if (!andel) {
    return null;
  }
  switch (andelType) {
    case 'AT':
      skalFastsetteGrunnlag = andel.some((atAndel) => atAndel.skalFastsetteGrunnlag === true);
      inntekt = andel && andel.length > 0 ? andel.reduce((a, b) => a + b.bruttoPrAar, 0) : undefined;
      break;
    case 'SN':
      inntekt = andel ? andel.pgiSnitt : undefined;
      skalFastsetteGrunnlag = andel.skalFastsetteGrunnlag;
      break;
    default:
      inntekt = andel ? andel.bruttoPrAar : undefined;
      skalFastsetteGrunnlag = andel.skalFastsetteGrunnlag;
  }

  if (inntekt) {
    andelElement.verdi = inntekt;
    andelElement.skalFastsetteGrunnlag = skalFastsetteGrunnlag;
    const strKey = setTekstStrengKeyPavilkaarUtfallType(vilkarStatus, skalFastsetteGrunnlag);
    andelElement.ledetekst = <FormattedMessage id={`Beregningsgrunnlag.BeregningTable.${strKey}.${andelType}`} />;
  }
  return andelElement;
};

export const createBeregningTableData = createSelector(
  [(state, ownProps) => ownProps.beregningsgrunnlagPerioder,
    (state, ownProps) => ownProps.aktivitetStatusList,
    (state, ownProps) => ownProps.dekningsgrad,
    (state, ownProps) => ownProps.grunnbelop,
    (state, ownProps) => ownProps.vilkaarBG.vilkarStatus],
  (allePerioder, aktivitetStatusList, dekningsgrad, grunnbelop, vilkarStatus) => {
    const perioderSomSkalVises = allePerioder.filter((periode) => periodeHarAarsakSomTilsierVisning(periode.periodeAarsaker));
    const periodeResultatTabeller = [];
    perioderSomSkalVises.forEach((periode) => {
      const headers = [];
      const bruttoRad = { ledetekst: <FormattedMessage id="Beregningsgrunnlag.BeregningTable.BruttoTotalt" /> };
      const avkortetRad = { ledetekst: <FormattedMessage id="Beregningsgrunnlag.BeregningTable.Avkortet6g" /> };
      const redusertRad = { ledetekst: <FormattedMessage id="Beregningsgrunnlag.BeregningTable.RedusertProsent" values={{ redusert: dekningsgrad }} /> };
      const dagsatserRad = [];

      headers.push(constructPeriod(periode.beregningsgrunnlagPeriodeFom, periode.beregningsgrunnlagPeriodeTom));
      bruttoRad.verdi = formatCurrencyNoKr(periode.bruttoInkludertBortfaltNaturalytelsePrAar);
      avkortetRad.verdi = formatCurrencyNoKr(periode.avkortetPrAar);
      if (dekningsgrad !== 100) {
        redusertRad.verdi = formatCurrencyNoKr(periode.redusertPrAar);
      }
      dagsatserRad.push(formatCurrencyNoKr(periode.dagsats));

      const rowsAndeler = [];
      const rowsForklaringer = [];
      const sortedStatusList = aktivitetStatusList.sort((a, b) => ((a.kode > b.kode) ? 1 : -1)); // sorter alfabetisk
      const aktivitetStatusKodeKombo = sortedStatusList.map((andelKode) => andelKode.kode).join('_');
      const isMS = sortedStatusList.some((andelKode) => andelKode.kode === aktivitetStatus.MILITAER_ELLER_SIVIL);
      switch (aktivitetStatusKodeKombo) {
        case 'AT_SN': {
          const atElement = opprettAndelElement(
            periode.beregningsgrunnlagPrStatusOgAndel.filter((andel) => andel.aktivitetStatus.kode === aktivitetStatus.ARBEIDSTAKER),
            'AT',
            vilkarStatus,
          );
          const snElement = opprettAndelElement(
            periode.beregningsgrunnlagPrStatusOgAndel.find((andel) => andel.aktivitetStatus.kode === aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE),
            'SN',
            vilkarStatus,
          );

          if ((atElement && atElement.verdi) < (snElement && snElement.verdi)) {
            rowsAndeler.push(snElement);
          }
          if ((atElement && atElement.verdi) > (snElement && snElement.verdi)) {
            rowsForklaringer.push(<FormattedMessage id="Beregningsgrunnlag.BeregningTable.Omberegnet.ForklaringAT>SN" />);
            rowsAndeler.push(atElement);
          }
          break;
        }
        case 'AT_FL_SN': {
          const atElement = opprettAndelElement(
            periode.beregningsgrunnlagPrStatusOgAndel.filter((andel) => andel.aktivitetStatus.kode === aktivitetStatus.ARBEIDSTAKER),
            'AT',
            vilkarStatus,
          );
          const snElement = opprettAndelElement(
            periode.beregningsgrunnlagPrStatusOgAndel.find((andel) => andel.aktivitetStatus.kode === aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE),
            'SN',
            vilkarStatus,
          );
          const flElement = opprettAndelElement(
            periode.beregningsgrunnlagPrStatusOgAndel.find((andel) => andel.aktivitetStatus.kode === aktivitetStatus.FRILANSER),
            'FL',
            vilkarStatus,
          );
          if (((atElement && atElement.verdi) + (flElement && flElement.verdi)) > (snElement && snElement.verdi)) {
            rowsForklaringer.push(<FormattedMessage id="Beregningsgrunnlag.BeregningTable.Omberegnet.ForklaringAT_FL>SN" />);
            rowsAndeler.push(atElement);
            rowsAndeler.push(flElement);
          }
          if (((atElement && atElement.verdi) + (flElement && flElement.verdi)) < (snElement && snElement.verdi)) {
            rowsAndeler.push(atElement);
            rowsAndeler.push(flElement);
            rowsAndeler.push(snElement);
          }
          break;
        }
        case 'DP_FL_SN': {
          const snElement = opprettAndelElement(
            periode.beregningsgrunnlagPrStatusOgAndel.find((andel) => andel.aktivitetStatus.kode === aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE),
            'SN',
            vilkarStatus,
          );
          const flElement = opprettAndelElement(
            periode.beregningsgrunnlagPrStatusOgAndel.find((andel) => andel.aktivitetStatus.kode === aktivitetStatus.FRILANSER),
            'FL',
            vilkarStatus,
          );
          const dpElement = opprettAndelElement(
            periode.beregningsgrunnlagPrStatusOgAndel.find((andel) => andel.aktivitetStatus.kode === aktivitetStatus.DAGPENGER),
            'DP',
            vilkarStatus,
          );

          if (((dpElement && dpElement.verdi) + (flElement && flElement.verdi)) > (snElement && snElement.verdi)) {
            rowsForklaringer.push(<FormattedMessage id="Beregningsgrunnlag.BeregningTable.Omberegnet.ForklaringDP_FL>SN" />);
            rowsAndeler.push(flElement);
          } else {
            // TODO: Avklar hva vi skal vise her
            rowsAndeler.push(snElement);
          }
          break;
        }
        case 'AT_DP_SN': {
          const atElement = opprettAndelElement(
            periode.beregningsgrunnlagPrStatusOgAndel.filter((andel) => andel.aktivitetStatus.kode === aktivitetStatus.ARBEIDSTAKER),
            'AT',
            vilkarStatus,
          );
          const snElement = opprettAndelElement(
            periode.beregningsgrunnlagPrStatusOgAndel.find((andel) => andel.aktivitetStatus.kode === aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE),
            'SN',
            vilkarStatus,
          );
          const dpElement = opprettAndelElement(
            periode.beregningsgrunnlagPrStatusOgAndel.find((andel) => andel.aktivitetStatus.kode === aktivitetStatus.DAGPENGER),
            'DP',
            vilkarStatus,
          );

          if (((dpElement && dpElement.verdi) + (atElement && atElement.verdi)) > (snElement && snElement.verdi)) {
            rowsForklaringer.push(<FormattedMessage id="Beregningsgrunnlag.BeregningTable.Omberegnet.ForklaringAT_DP>SN" />);
            rowsAndeler.push(atElement);
          } else {
            // TODO: Avklar hva vi skal vise her
            rowsAndeler.push(atElement);
            rowsAndeler.push(snElement);
            rowsAndeler.push(dpElement);
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
          const ytElement = opprettAndelElement(
            periode.beregningsgrunnlagPrStatusOgAndel.find((andel) => andel.aktivitetStatus.kode === aktivitetStatus.KUN_YTELSE),
            'YT',
            vilkarStatus,
          );
          if (ytElement && ytElement.verdi) {
            rowsAndeler.push(ytElement);
          }
          break;
        }

        default: {
          const atElement = opprettAndelElement(
            periode.beregningsgrunnlagPrStatusOgAndel.filter((andel) => andel.aktivitetStatus.kode === aktivitetStatus.ARBEIDSTAKER),
            'AT',
            vilkarStatus,
          );
          const flElement = opprettAndelElement(
            periode.beregningsgrunnlagPrStatusOgAndel.find((andel) => andel.aktivitetStatus.kode === aktivitetStatus.FRILANSER),
            'FL',
            vilkarStatus,
          );
          const snElement = opprettAndelElement(
            periode.beregningsgrunnlagPrStatusOgAndel.find((andel) => andel.aktivitetStatus.kode === aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE),
            'SN',
            vilkarStatus,
          );
          const aapElement = opprettAndelElement(
            periode.beregningsgrunnlagPrStatusOgAndel.find((andel) => andel.aktivitetStatus.kode === aktivitetStatus.ARBEIDSAVKLARINGSPENGER),
            'AAP',
            vilkarStatus,
          );
          const dpElement = opprettAndelElement(
            periode.beregningsgrunnlagPrStatusOgAndel.find((andel) => andel.aktivitetStatus.kode === aktivitetStatus.DAGPENGER),
            'DP',
            vilkarStatus,
          );
          if (atElement && atElement.verdi !== undefined) { rowsAndeler.push(atElement); }
          if (flElement && flElement.verdi !== undefined) { rowsAndeler.push(flElement); }
          if (snElement && snElement.verdi !== undefined) { rowsAndeler.push(snElement); }
          if (aapElement && aapElement.verdi !== undefined) { rowsAndeler.push(aapElement); }
          if (dpElement && dpElement.verdi !== undefined) { rowsAndeler.push(dpElement); }
        }
      }
      const rows = [];
      if (isMS && msRad.verdi > 0) {
        rows.push(msRad);
      }
      const seksG = grunnbelop * 6;
      if (bruttoRad.verdi !== avkortetRad.verdi && removeSpacesFromNumber(bruttoRad.verdi) > seksG) {
        rows.push(avkortetRad);
      }
      if (rowsAndeler.length > 1) {
        rows.unshift(bruttoRad);
      }
      if (redusertRad.verdi) {
        rows.push(redusertRad);
      }
      periodeResultatTabeller.push(
        {
          headers,
          rows,
          rowsAndeler,
          dagsatser: dagsatserRad,
          rowsForklaringer,
        },
      );
    });
    return periodeResultatTabeller;
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
  periodeResultatTabeller,
}) => {
  const lagPeriodeHeaders = periodeResultatTabeller.length > 1;
  return (
    <Panel className={beregningStyles.panelRight}>
      <Element>
        <FormattedMessage id="Beregningsgrunnlag.BeregningTable.Tittel" />
      </Element>
      {periodeResultatTabeller.map((tableData) => createPeriodeResultat(vilkaarBG, tableData, lagPeriodeHeaders))}
    </Panel>
  );
};

BeregningsresultatTable2.propTypes = {
  vilkaarBG: beregningsgrunnlagVilkarPropType.isRequired,
  periodeResultatTabeller: PropTypes.arrayOf(PropTypes.shape()).isRequired,

};

BeregningsresultatTable2.defaultProps = {
};

const mapStateToProps = (state, ownProps) => ({
  periodeResultatTabeller: createBeregningTableData(state, ownProps),
});

export default connect(mapStateToProps)(injectIntl(BeregningsresultatTable2));

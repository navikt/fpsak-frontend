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
import dekningsgradKode from '@fpsak-frontend/kodeverk/src/dekningsgrad';

import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import avslaatIkonUrl from '@fpsak-frontend/assets/images/avslaatt_mini.svg';
import { Image, VerticalSpacer } from '@fpsak-frontend/shared-components';
import beregningStyles from '../beregningsgrunnlagPanel/beregningsgrunnlag_V2.less';
import beregningsgrunnlagVilkarPropType from '../../propTypes/beregningsgrunnlagVilkarPropType';
import styles from './beregningsresultatTable_V2.less';
import { andelErIkkeTilkommetEllerLagtTilAvSBH } from '../arbeidstaker/GrunnlagForAarsinntektPanelAT_V2';


const createRowsAndeler = (listofAndeler, erVurdert) => (listofAndeler.map((entry, index) => (
  <Row key={`indeAx${index + 1}`}>
    <Column xs={!erVurdert ? '8' : '9'} key={`indexAl2${index + 1}`}>
      <Normaltekst>
        {entry.ledetekst}
      </Normaltekst>
    </Column>
    {erVurdert && (
      <Column xs="2" key={`indexAt2${index + 2}`} className={beregningStyles.rightAlignElementNoWrap}>
        <Normaltekst>{formatCurrencyNoKr(entry.verdi)}</Normaltekst>
      </Column>
    )}
    {!erVurdert && entry.skalFastsetteGrunnlag === true && (
      <Column xs="3" key={`indexAf2${index + 2}`} className={styles.maaFastsettes}>
        <Normaltekst className={beregningStyles.redError}><FormattedMessage id="Beregningsgrunnlag.BeregningTable.MåFastsettes" /></Normaltekst>
      </Column>
    )}
    {!erVurdert && !entry.skalFastsetteGrunnlag && (
      <Column xs="3" key={`indexAf2${index + 2}`} className={beregningStyles.rightAlignElementNoWrap}>
        <Normaltekst>{formatCurrencyNoKr(entry.verdi)}</Normaltekst>
      </Column>
    )}
  </Row>
))
);
const lineRow = (key) => (
  <Row key={key || 'separator'}>
    <Column xs="11" className={beregningStyles.noPaddingRight}>
      <div className={beregningStyles.colDevider} />
    </Column>
  </Row>
);


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
          <Column xs="2" key={`indexR2${index + 2}`} className={beregningStyles.rightAlignElementNoWrap}>
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
      <Column xs="3" className={beregningStyles.rightAlignElementNoWrap}>
        <Normaltekst>{formatCurrencyNoKr(entry.verdi)}</Normaltekst>
      </Column>
    </Row>
  );
};
const summaryRow = (listOfDagsatser, listOfEntries, erVurdert) => {
  if (!listOfEntries || listOfEntries.length === 0) {
    return null;
  }
  if (erVurdert && (listOfDagsatser.length === 0 || !listOfDagsatser[0])) {
    return null;
  }
  const dagsats = listOfEntries[listOfEntries.length - 1].verdi !== undefined
    ? formatCurrencyNoKr(listOfEntries[listOfEntries.length - 1].verdi) : 0;
  return (
    <React.Fragment key="beregningOppsummeringWrapper">
      <Row key="beregningOppsummering">
        <Column xs="8" key="beregningOppsummeringLedetekst">
          <Normaltekst>
            <span className={beregningStyles.semiBoldText}>
              { erVurdert && (
              <FormattedMessage
                id="Beregningsgrunnlag.BeregningTable.DagsatsNy"
                values={{ dagSats: dagsats }}
              />
              )}
              { !erVurdert && (
              <FormattedMessage id="Beregningsgrunnlag.BeregningTable.Dagsats.ikkeFastsatt" />
              )}
            </span>


          </Normaltekst>
        </Column>
        {erVurdert && listOfDagsatser.map((dag, index) => (
          <Column xs="3" key={`indexDS${index + 1}`} className={beregningStyles.rightAlignElement}>
            {dag && (
            <Normaltekst className={beregningStyles.semiBoldText}>{dag}</Normaltekst>
            )}
          </Column>
        ))}
        {!erVurdert && (
        <Column xs="3" className={beregningStyles.rightAlignElement} key="beregningOppsummeDagsats">
          <Normaltekst className={beregningStyles.semiBoldText}>-</Normaltekst>
        </Column>
        )}
      </Row>
    </React.Fragment>
  );
};

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
    rows.push(createRowsAndeler(listofAndeler, true));
    if (listofAndeler.length > 1) {
      rows.push(lineRow('andelLinje'));
    }
  }
  rows.push(createRowsRedusert(listOfEntries));
  if (listofAndeler.length > 0 || listOfEntries.length > 0) {
    rows.push(lineRow('redusertLinje'));
    if (listOfEntries.length === 0) {
      rows.push(summaryRow(listOfDagsatser, listofAndeler, true));
    } else {
      rows.push(summaryRow(listOfDagsatser, listOfEntries, true));
    }
  }
  return rows;
};
const createTableRowsIkkeVurdert = (listofAndeler, listOfEntries, listOfDagsatser) => {
  const rows = [];
  if (listofAndeler && listofAndeler.length > 0) {
    rows.push(createRowsAndeler(listofAndeler, false));
    rows.push(lineRow('redusertAndelLinje'));
  }

  rows.push(summaryRow(listOfDagsatser, listOfEntries, false));

  return rows;
};
const createPeriodeHeader = (header) => (
  <>
    <VerticalSpacer twentyPx />
    <Normaltekst className={beregningStyles.semiBoldText}>{header}</Normaltekst>
  </>
);
const lagKeyForPeriode = (dagsats, header) => {
  if (dagsats) {
    return dagsats;
  }
  if (header && header.key) {
    return header.key;
  }
  return 'key';
};
const createPeriodeResultat = (vilkaarBG, tableData, lagPeriodeHeaders, intl, halvGVerdi) => {
  const key = lagKeyForPeriode(tableData.dagsatser[0], tableData.headers[0]);
  return (
    <React.Fragment key={`Wr${key}`}>
      {tableData && lagPeriodeHeaders && createPeriodeHeader(tableData.headers)}
      { vilkaarBG && vilkaarBG.vilkarStatus.kode === vilkarUtfallType.OPPFYLT
  && createTableRows(tableData.rowsAndeler, tableData.rows, tableData.dagsatser, tableData.rowsForklaringer)}
      { vilkaarBG && vilkaarBG.vilkarStatus.kode === vilkarUtfallType.IKKE_VURDERT
  && createTableRowsIkkeVurdert(tableData.rowsAndeler, tableData.rows, tableData.dagsatser)}
      { vilkaarBG && vilkaarBG.vilkarStatus.kode === vilkarUtfallType.IKKE_OPPFYLT
  && (
    <React.Fragment key={`IVR2${key}`}>
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
};

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
    default:
      inntekt = andel && (andel.bruttoPrAar || andel.bruttoPrAar === 0) ? andel.bruttoPrAar : undefined;
      skalFastsetteGrunnlag = andel.skalFastsetteGrunnlag;
  }

  if (inntekt || inntekt === 0) {
    andelElement.verdi = inntekt;
    andelElement.skalFastsetteGrunnlag = skalFastsetteGrunnlag;
    const strKey = setTekstStrengKeyPavilkaarUtfallType(vilkarStatus, skalFastsetteGrunnlag);
    andelElement.ledetekst = <FormattedMessage id={`Beregningsgrunnlag.BeregningTable.${strKey}.${andelType}`} />;
  }
  return andelElement;
};
const hentVerdiFraAndel = (andel) => {
  if (!andel || !andel.verdi) {
    return 0;
  }
  return andel.verdi;
};
export const createBeregningTableData = createSelector(
  [(state, ownProps) => ownProps.beregningsgrunnlagPerioder,
    (state, ownProps) => ownProps.aktivitetStatusList,
    (state, ownProps) => ownProps.dekningsgrad,
    (state, ownProps) => ownProps.grunnbelop,
    (state, ownProps) => ownProps.harAksjonspunkter,
    (state, ownProps) => ownProps.vilkaarBG.vilkarStatus],
  (allePerioder, aktivitetStatusList, dekningsgrad, grunnbelop, harAksjonspunkter, vilkarStatus) => {
    const perioderSomSkalVises = allePerioder.filter((periode) => periodeHarAarsakSomTilsierVisning(periode.periodeAarsaker));
    const periodeResultatTabeller = [];
    perioderSomSkalVises.forEach((periode) => {
      const headers = [];
      const bruttoRad = { ledetekst: <FormattedMessage id="Beregningsgrunnlag.BeregningTable.BruttoTotalt" /> };
      const avkortetRad = { ledetekst: <FormattedMessage id="Beregningsgrunnlag.BeregningTable.Avkortet6g" /> };
      const redusertRad = { ledetekst: <FormattedMessage id="Beregningsgrunnlag.BeregningTable.RedusertProsent" values={{ redusert: dekningsgrad }} /> };
      const dagsatserRad = [];
      const harBortfallNaturalYtelse = periode.periodeAarsaker.some((aarsaak) => aarsaak.kode === periodeAarsak.NATURALYTELSE_BORTFALT);
      headers.push(constructPeriod(periode.beregningsgrunnlagPeriodeFom, periode.beregningsgrunnlagPeriodeTom));
      bruttoRad.verdi = formatCurrencyNoKr(periode.bruttoInkludertBortfaltNaturalytelsePrAar);
      avkortetRad.verdi = formatCurrencyNoKr(periode.avkortetPrAar);

      if (dekningsgrad !== dekningsgradKode.HUNDRE) {
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
            periode.beregningsgrunnlagPrStatusOgAndel
              .filter((andel) => andel.aktivitetStatus.kode === aktivitetStatus.ARBEIDSTAKER)
              .filter((andel) => andelErIkkeTilkommetEllerLagtTilAvSBH(andel)),
            'AT',
            vilkarStatus,
          );
          const snElement = opprettAndelElement(
            periode.beregningsgrunnlagPrStatusOgAndel.find((andel) => andel.aktivitetStatus.kode === aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE),
            'SN',
            vilkarStatus,
          );
          if (((atElement && atElement.verdi) < (snElement && snElement.verdi)) && harAksjonspunkter) {
            rowsAndeler.push(snElement);
            break;
          }
          if ((atElement && atElement.verdi) > (snElement && snElement.verdi)) {
            rowsForklaringer.push(<FormattedMessage id="Beregningsgrunnlag.BeregningTable.Omberegnet.ForklaringAT>SN" />);
            rowsAndeler.push(atElement);
            break;
          }
          rowsAndeler.push(atElement);
          rowsAndeler.push(snElement);
          break;
        }
        case 'AT_FL_SN': {
          const atElement = opprettAndelElement(
            periode.beregningsgrunnlagPrStatusOgAndel
              .filter((andel) => andel.aktivitetStatus.kode === aktivitetStatus.ARBEIDSTAKER)
              .filter((andel) => andelErIkkeTilkommetEllerLagtTilAvSBH(andel)),
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
          if (!harAksjonspunkter) {
            if ((hentVerdiFraAndel(atElement) + hentVerdiFraAndel(flElement)) > hentVerdiFraAndel(snElement)) {
              rowsForklaringer.push(<FormattedMessage id="Beregningsgrunnlag.BeregningTable.Omberegnet.ForklaringAT_FL>SN" />);
              rowsAndeler.push(atElement);
              rowsAndeler.push(flElement);
            } else {
              // setter SN ledetekst til Pensjonsgibevnde årsintekt
              snElement.ledetekst = <FormattedMessage id="Beregningsgrunnlag.BeregningTable.Omberegnet.SN" />;
              rowsAndeler.push(atElement);
              rowsAndeler.push(flElement);
              rowsAndeler.push(snElement);
            }
          } else {
            // setter SN ledetekst til Fastsatt årsintekt
            snElement.ledetekst = <FormattedMessage id="Beregningsgrunnlag.BeregningTable.Fastsatt.SN" />;
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

          if ((hentVerdiFraAndel(dpElement) + hentVerdiFraAndel(flElement)) > hentVerdiFraAndel(snElement)) {
            rowsForklaringer.push(<FormattedMessage id="Beregningsgrunnlag.BeregningTable.Omberegnet.ForklaringDP_FL>SN" />);
            rowsAndeler.push(flElement);
          } else {
            // TODO: Avklar hva vi skal vise her min tolkning er kun snAndel
            rowsAndeler.push(snElement);
          }
          break;
        }
        case 'AT_DP_SN': {
          const atElement = opprettAndelElement(
            periode.beregningsgrunnlagPrStatusOgAndel
              .filter((andel) => andel.aktivitetStatus.kode === aktivitetStatus.ARBEIDSTAKER)
              .filter((andel) => andelErIkkeTilkommetEllerLagtTilAvSBH(andel)),
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

          if ((hentVerdiFraAndel(dpElement) + hentVerdiFraAndel(atElement)) > hentVerdiFraAndel(snElement)) {
            rowsForklaringer.push(<FormattedMessage id="Beregningsgrunnlag.BeregningTable.Omberegnet.ForklaringAT_DP>SN" />);
            rowsAndeler.push(atElement);
          } else {
            rowsAndeler.push(atElement);
            rowsAndeler.push(dpElement);
            rowsAndeler.push(snElement);
          }
          break;
        }
        default: {
          const atElement = opprettAndelElement(
            periode.beregningsgrunnlagPrStatusOgAndel
              .filter((andel) => andel.aktivitetStatus.kode === aktivitetStatus.ARBEIDSTAKER)
              .filter((andel) => andelErIkkeTilkommetEllerLagtTilAvSBH(andel)),
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
          const baElement = opprettAndelElement(
            periode.beregningsgrunnlagPrStatusOgAndel.find((andel) => andel.aktivitetStatus.kode === aktivitetStatus.BRUKERS_ANDEL),
            'BA',
            vilkarStatus,
          );
          if (baElement && baElement.verdi !== undefined) { rowsAndeler.push(baElement); }
          if (atElement && atElement.verdi !== undefined) { rowsAndeler.push(atElement); }
          if (flElement && flElement.verdi !== undefined) { rowsAndeler.push(flElement); }
          if (snElement && snElement.verdi !== undefined) { rowsAndeler.push(snElement); }
          if (aapElement && aapElement.verdi !== undefined) { rowsAndeler.push(aapElement); }
          if (dpElement && dpElement.verdi !== undefined) { rowsAndeler.push(dpElement); }
        }
          if (harBortfallNaturalYtelse) {
            const ntElement = {};
            const atAndel = periode.beregningsgrunnlagPrStatusOgAndel.filter(
              (andel) => andel.aktivitetStatus.kode === aktivitetStatus.ARBEIDSTAKER && andel.bortfaltNaturalytelse,
            );
            ntElement.verdi = atAndel && atAndel.length > 0 ? atAndel.reduce((sum, andel) => sum + andel.bortfaltNaturalytelse, 0) : undefined;
            ntElement.skalFastsetteGrunnlag = false;
            ntElement.ledetekst = <FormattedMessage id="Beregningsgrunnlag.BeregningTable.Naturalytelser" />;
            rowsAndeler.push(ntElement);
          }
      }
      const rows = [];
      if (isMS) {
        const msElement = opprettAndelElement(
          periode.beregningsgrunnlagPrStatusOgAndel.find((andel) => andel.aktivitetStatus.kode === aktivitetStatus.MILITAER_ELLER_SIVIL),
          'MS',
          vilkarStatus,
        );
        rows.push(msElement);
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
  halvGVerdi,
}) => {
  const skalLagePeriodeHeaders = periodeResultatTabeller.length > 1;
  return (
    <Panel className={beregningStyles.panelRight}>
      <Element>
        <FormattedMessage id="Beregningsgrunnlag.BeregningTable.Tittel" />
      </Element>
      {periodeResultatTabeller.map((tableData) => createPeriodeResultat(vilkaarBG, tableData, skalLagePeriodeHeaders, intl, halvGVerdi))}
    </Panel>
  );
};

BeregningsresultatTable2.propTypes = {
  intl: PropTypes.shape().isRequired,
  halvGVerdi: PropTypes.number.isRequired,
  vilkaarBG: beregningsgrunnlagVilkarPropType.isRequired,
  periodeResultatTabeller: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

BeregningsresultatTable2.defaultProps = {
};

const mapStateToProps = (state, ownProps) => ({
  periodeResultatTabeller: createBeregningTableData(state, ownProps),
});

export default connect(mapStateToProps)(injectIntl(BeregningsresultatTable2));

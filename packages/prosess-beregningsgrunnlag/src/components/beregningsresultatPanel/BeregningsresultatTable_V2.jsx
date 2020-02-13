import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';

import { connect } from 'react-redux';
import moment from 'moment';
import { createSelector } from 'reselect';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';

import { DDMMYYYY_DATE_FORMAT, formatCurrencyNoKr, removeSpacesFromNumber } from '@fpsak-frontend/utils';
import periodeAarsak from '@fpsak-frontend/kodeverk/src/periodeAarsak';
import dekningsgradKode from '@fpsak-frontend/kodeverk/src/dekningsgrad';

import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import beregningsgrunnlagVilkarPropType from '../../propTypes/beregningsgrunnlagVilkarPropType';
import { andelErIkkeTilkommetEllerLagtTilAvSBH } from '../arbeidstaker/GrunnlagForAarsinntektPanelAT_V2';
import BeregningsresutatPanel from './BeregningsResultatPanel';


const periodeHarAarsakSomTilsierVisning = (aarsaker) => {
  if (aarsaker.length < 1) {
    return true;
  }
  const aarsakerSomTilsierMuligEndringIDagsats = [periodeAarsak.NATURALYTELSE_BORTFALT,
    periodeAarsak.ARBEIDSFORHOLD_AVSLUTTET, periodeAarsak.NATURALYTELSE_TILKOMMER];
  return aarsaker.filter((aarsak) => aarsakerSomTilsierMuligEndringIDagsats.indexOf(aarsak.kode) !== -1).length > 0;
};
const setTekstStrengKeyPavilkaarUtfallType = (vilkarStatus, skalFastsetteGrunnlag) => {
  if (!vilkarStatus || !vilkarStatus.kode) return 'Fastsatt';
  if (vilkarStatus.kode === vilkarUtfallType.OPPFYLT && !skalFastsetteGrunnlag) {
    return 'Omberegnet';
  }
  if (vilkarStatus.kode === vilkarUtfallType.IKKE_OPPFYLT) {
    return 'Omberegnet';
  }
  return 'Fastsatt';
};
const hentAndelFraPeriode = (periode, andelType) => {
  if (andelType === aktivitetStatus.ARBEIDSTAKER) {
    return periode.beregningsgrunnlagPrStatusOgAndel
      .filter((andel) => andel.aktivitetStatus.kode === aktivitetStatus.ARBEIDSTAKER)
      .filter((andel) => andelErIkkeTilkommetEllerLagtTilAvSBH(andel));
  }
  return periode.beregningsgrunnlagPrStatusOgAndel.find((andel) => andel.aktivitetStatus.kode === andelType);
};
const lagPeriodeHeader = (fom, tom) => (
  <FormattedMessage
    id="Beregningsgrunnlag.BeregningTable.Periode"
    key={`fom-tom${fom}${tom}`}
    values={{ fom: moment(fom).format(DDMMYYYY_DATE_FORMAT), tom: tom ? moment(tom).format(DDMMYYYY_DATE_FORMAT) : '' }}
  />
);

const opprettAndelElement = (periode, andelType, vilkarStatus) => {
  let inntekt;
  const andelElement = {};
  let skalFastsetteGrunnlag = false;
  const andel = hentAndelFraPeriode(periode, andelType);
  if (!andel) {
    return null;
  }
  switch (andelType) {
    case aktivitetStatus.ARBEIDSTAKER:
      skalFastsetteGrunnlag = andel.some((atAndel) => atAndel.skalFastsetteGrunnlag === true);
      inntekt = andel && andel.length > 0 ? andel.reduce((a, b) => a + b.bruttoPrAar, 0) : undefined;
      break;
    case aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE:
      skalFastsetteGrunnlag = andel.skalFastsetteGrunnlag;
      if (skalFastsetteGrunnlag) {
        inntekt = andel && (andel.overstyrtPrAar || andel.overstyrtPrAar === 0) ? andel.overstyrtPrAar : undefined;
      } else {
        inntekt = andel && (andel.bruttoPrAar || andel.bruttoPrAar === 0) ? andel.bruttoPrAar : undefined;
      }
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
const settVisningsRaderForATSN = (periode, rowsAndeler, rowsForklaringer, vilkarStatus, harAksjonspunkter) => {
  const atElement = opprettAndelElement(
    periode,
    aktivitetStatus.ARBEIDSTAKER,
    vilkarStatus,
  );
  const snElement = opprettAndelElement(
    periode,
    aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE,
    vilkarStatus,
  );

  // legg til regler for særtilfeller
  if (hentVerdiFraAndel(atElement) < (hentVerdiFraAndel(snElement) && harAksjonspunkter)) {
    rowsAndeler.push(snElement);
    return;
  }
  if (!harAksjonspunkter) {
    if (hentVerdiFraAndel(atElement) > hentVerdiFraAndel(snElement)) {
      rowsForklaringer.push(<FormattedMessage
        id="Beregningsgrunnlag.BeregningTable.Omberegnet.ForklaringAToverstigerSN"
      />);
      rowsAndeler.push(atElement);
      return;
    }
  }
  rowsAndeler.push(atElement);
  rowsAndeler.push(snElement);
};
const settVisningsRaderForATFLSN = (periode, rowsAndeler, rowsForklaringer, vilkarStatus, harAksjonspunkter) => {
  const atElement = opprettAndelElement(
    periode,
    aktivitetStatus.ARBEIDSTAKER,
    vilkarStatus,
  );
  const snElement = opprettAndelElement(
    periode,
    aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE,
    vilkarStatus,
  );
  const flElement = opprettAndelElement(
    periode,
    aktivitetStatus.FRILANSER,
    vilkarStatus,
  );
  if (!harAksjonspunkter) {
    if ((hentVerdiFraAndel(atElement) + hentVerdiFraAndel(flElement)) > hentVerdiFraAndel(snElement)) {
      rowsForklaringer.push(<FormattedMessage id="Beregningsgrunnlag.BeregningTable.Omberegnet.ForklaringAT_FLoverstigerSN" />);
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
};
const settVisningsRaderForDPFLSN = (periode, rowsAndeler, rowsForklaringer, vilkarStatus) => {
  const snElement = opprettAndelElement(
    periode,
    aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE,
    vilkarStatus,
  );
  const flElement = opprettAndelElement(
    periode,
    aktivitetStatus.FRILANSER,
    vilkarStatus,
  );
  const dpElement = opprettAndelElement(
    periode,
    aktivitetStatus.DAGPENGER,
    vilkarStatus,
  );
  if ((hentVerdiFraAndel(dpElement) + hentVerdiFraAndel(flElement)) > hentVerdiFraAndel(snElement)) {
    rowsForklaringer.push(<FormattedMessage id="Beregningsgrunnlag.BeregningTable.Omberegnet.ForklaringDP_FLoverstigerSN" />);
    rowsAndeler.push(flElement);
  } else {
    rowsAndeler.push(snElement);
  }
};
const settVisningsRaderForATDPSN = (periode, rowsAndeler, rowsForklaringer, vilkarStatus) => {
  const atElement = opprettAndelElement(
    periode,
    aktivitetStatus.ARBEIDSTAKER,
    vilkarStatus,
  );
  const snElement = opprettAndelElement(
    periode,
    aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE,
    vilkarStatus,
  );
  const dpElement = opprettAndelElement(
    periode,
    aktivitetStatus.DAGPENGER,
    vilkarStatus,
  );

  if ((hentVerdiFraAndel(dpElement) + hentVerdiFraAndel(atElement)) > hentVerdiFraAndel(snElement)) {
    rowsForklaringer.push(<FormattedMessage id="Beregningsgrunnlag.BeregningTable.Omberegnet.ForklaringAT_DPoverstigerSN" />);
    rowsAndeler.push(atElement);
  } else {
    rowsAndeler.push(atElement);
    rowsAndeler.push(dpElement);
    rowsAndeler.push(snElement);
  }
};
const settVisningsRaderForDefault = (periode, rows, rowsAndeler, rowsForklaringer, vilkarStatus, harBortfallNaturalYtelse) => {
  const atElement = opprettAndelElement(
    periode,
    aktivitetStatus.ARBEIDSTAKER,
    vilkarStatus,
  );
  const flElement = opprettAndelElement(
    periode,
    aktivitetStatus.FRILANSER,
    vilkarStatus,
  );
  const snElement = opprettAndelElement(
    periode,
    aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE,
    vilkarStatus,
  );
  const aapElement = opprettAndelElement(
    periode,
    aktivitetStatus.ARBEIDSAVKLARINGSPENGER,
    vilkarStatus,
  );
  const dpElement = opprettAndelElement(
    periode,
    aktivitetStatus.DAGPENGER,
    vilkarStatus,
  );
  const baElement = opprettAndelElement(
    periode,
    aktivitetStatus.BRUKERS_ANDEL,
    vilkarStatus,
  );
  const msElement = opprettAndelElement(
    periode,
    aktivitetStatus.MILITAER_ELLER_SIVIL,
    vilkarStatus,
  );
  const kyElement = opprettAndelElement(
    periode,
    aktivitetStatus.KUN_YTELSE,
    vilkarStatus,
  );

  if (baElement && baElement.verdi !== undefined) { rowsAndeler.push(baElement); }
  if (atElement && atElement.verdi !== undefined) { rowsAndeler.push(atElement); }
  if (flElement && flElement.verdi !== undefined) { rowsAndeler.push(flElement); }
  if (snElement && snElement.verdi !== undefined) { rowsAndeler.push(snElement); }
  if (aapElement && aapElement.verdi !== undefined) { rowsAndeler.push(aapElement); }
  if (dpElement && dpElement.verdi !== undefined) { rowsAndeler.push(dpElement); }
  if (msElement && msElement.verdi !== undefined) { rowsAndeler.push(msElement); }
  if (kyElement && kyElement.verdi !== undefined) { rowsAndeler.push(kyElement); }

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
};
const finnDagsatsGrunnlag = (bruttoRad, avkortetRad, redusertRad) => {
  if (redusertRad.verdi && redusertRad.display !== false) return redusertRad.verdi;
  if (avkortetRad.verdi && avkortetRad.display !== false) return avkortetRad.verdi;
  if (bruttoRad.verdi && bruttoRad.display !== false) return bruttoRad.verdi;
  return null;
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
    const seksG = grunnbelop * 6;
    perioderSomSkalVises.forEach((periode) => {
      const headers = [];
      const bruttoRad = { ledetekst: <FormattedMessage id="Beregningsgrunnlag.BeregningTable.BruttoTotalt" /> };
      const avkortetRad = { ledetekst: <FormattedMessage id="Beregningsgrunnlag.BeregningTable.Avkortet6g" /> };
      const redusertRad = { ledetekst: <FormattedMessage id="Beregningsgrunnlag.BeregningTable.RedusertProsent" values={{ redusert: dekningsgrad }} /> };
      const dagsatserRad = {};
      const harBortfallNaturalYtelse = periode.periodeAarsaker.some((aarsaak) => aarsaak.kode === periodeAarsak.NATURALYTELSE_BORTFALT);
      headers.push(lagPeriodeHeader(periode.beregningsgrunnlagPeriodeFom, periode.beregningsgrunnlagPeriodeTom));
      bruttoRad.verdi = formatCurrencyNoKr(periode.bruttoInkludertBortfaltNaturalytelsePrAar);
      avkortetRad.verdi = formatCurrencyNoKr(periode.avkortetPrAar);
      if (dekningsgrad !== dekningsgradKode.HUNDRE) {
        redusertRad.verdi = formatCurrencyNoKr(periode.redusertPrAar);
      }
      dagsatserRad.verdi = formatCurrencyNoKr(periode.dagsats);
      const rows = [];
      const rowsAndeler = [];
      const rowsForklaringer = [];
      const sortedStatusList = aktivitetStatusList.sort((a, b) => ((a.kode > b.kode) ? 1 : -1)); // sorter alfabetisk
      const aktivitetStatusKodeKombo = sortedStatusList.map((andelKode) => andelKode.kode).join('_');
      switch (aktivitetStatusKodeKombo) {
        case 'AT_SN': {
          settVisningsRaderForATSN(periode, rowsAndeler, rowsForklaringer, vilkarStatus, harAksjonspunkter);
          break;
        }
        case 'AT_FL_SN': {
          settVisningsRaderForATFLSN(periode, rowsAndeler, rowsForklaringer, vilkarStatus, harAksjonspunkter);
          break;
        }
        case 'DP_FL_SN': {
          settVisningsRaderForDPFLSN(periode, rowsAndeler, rowsForklaringer, vilkarStatus);
          break;
        }
        case 'AT_DP_SN': {
          settVisningsRaderForATDPSN(periode, rowsAndeler, rowsForklaringer, vilkarStatus);
          break;
        }
        default: {
          settVisningsRaderForDefault(periode, rows, rowsAndeler, rowsForklaringer, vilkarStatus, harBortfallNaturalYtelse);
        }
      }

      // sjekk om spesialrader skul vises
      // IKKE vis avkortet rad vis mindre en 6G
      if (removeSpacesFromNumber(bruttoRad.verdi) < seksG) {
        avkortetRad.display = false;
      }
      dagsatserRad.grunnlag = finnDagsatsGrunnlag(bruttoRad, avkortetRad, redusertRad);
      if (rowsAndeler.length < 2) {
        bruttoRad.display = false;
      }
      if (bruttoRad.display !== false && bruttoRad.verdi === redusertRad.verdi) {
        redusertRad.display = false;
      }

      periodeResultatTabeller.push(
        {
          headers,
          rowsAndeler,
          avkortetRad,
          redusertRad,
          bruttoRad,
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

}) => (
  <BeregningsresutatPanel intl={intl} halvGVerdi={halvGVerdi} periodeResultatTabeller={periodeResultatTabeller} vilkaarBG={vilkaarBG} />
);

BeregningsresultatTable2.propTypes = {
  intl: PropTypes.shape().isRequired,
  halvGVerdi: PropTypes.number.isRequired,
  vilkaarBG: beregningsgrunnlagVilkarPropType.isRequired,
  periodeResultatTabeller: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  periodeResultatTabeller: createBeregningTableData(state, ownProps),
});

export default connect(mapStateToProps)(injectIntl(BeregningsresultatTable2));

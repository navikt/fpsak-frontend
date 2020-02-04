import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FieldArray } from 'redux-form';
import faktaOmBeregningTilfelle from '@fpsak-frontend/kodeverk/src/faktaOmBeregningTilfelle';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import { createSelector } from 'reselect';
import LonnsendringForm, { lonnsendringField }
  from './forms/LonnsendringForm';
import NyoppstartetFLForm, { erNyoppstartetFLField }
  from './forms/NyoppstartetFLForm';
import { harVurdertMottarYtelse } from './forms/VurderMottarYtelseUtils';
import InntektstabellPanel from '../InntektstabellPanel';
import { ATFLSammeOrgTekst, transformValuesForATFLISammeOrg } from './forms/ATFLSammeOrg';
import { harKunstigArbeidsforhold } from './forms/KunstigArbeidsforhold';
import transformValuesArbeidUtenInntektsmelding from './forms/ArbeidUtenInntektsmelding';
import VurderMottarYtelseForm from './forms/VurderMottarYtelseForm';
import { getFormValuesForBeregning } from '../../BeregningFormUtils';
import {
  skalRedigereInntektForAndel, mapAndelToField, erOverstyring, getSkalRedigereInntekt, INNTEKT_FIELD_ARRAY_NAME, skalFastsetteInntektForSN,
} from '../BgFordelingUtils';
import VurderBesteberegningForm, { besteberegningField, vurderBesteberegningTransform } from '../besteberegningFodendeKvinne/VurderBesteberegningForm';
import InntektFieldArray from '../InntektFieldArray';
import VurderEtterlonnSluttpakkeForm from './forms/VurderEtterlonnSluttpakkeForm';
import beregningAksjonspunkterPropType from '../../../propTypes/beregningAksjonspunkterPropType';


const lonnsendringErVurdertEllerIkkjeTilstede = (tilfeller, values) => (
  !tilfeller.includes(faktaOmBeregningTilfelle.VURDER_LONNSENDRING)
  || (values[lonnsendringField] !== undefined && values[lonnsendringField] !== null));

const nyoppstartetFLErVurdertEllerIkkjeTilstede = (tilfeller, values) => (
  !tilfeller.includes(faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL)
  || (values[erNyoppstartetFLField] !== undefined && values[erNyoppstartetFLField] !== null));


const besteberegningErVurdertEllerIkkjeTilstede = (tilfeller, values) => (
  !tilfeller.includes(faktaOmBeregningTilfelle.VURDER_BESTEBEREGNING)
  || (values[besteberegningField] !== undefined && values[besteberegningField] !== null));

const mottarYtelseErVurdertEllerIkkjeTilstede = (tilfeller, vurderMottarYtelse, values) => (
  !tilfeller.includes(faktaOmBeregningTilfelle.VURDER_MOTTAR_YTELSE)
  || (harVurdertMottarYtelse(values, vurderMottarYtelse)));

const harVurdert = (tilfeller, values, faktaOmBeregning) => (
  lonnsendringErVurdertEllerIkkjeTilstede(tilfeller, values)
    && nyoppstartetFLErVurdertEllerIkkjeTilstede(tilfeller, values)
    && mottarYtelseErVurdertEllerIkkjeTilstede(tilfeller, faktaOmBeregning.vurderMottarYtelse, values)
    && besteberegningErVurdertEllerIkkjeTilstede(tilfeller, values)
);

const skalFastsetteInntekt = (values, faktaOmBeregning, beregningsgrunnlag) => faktaOmBeregning.andelerForFaktaOmBeregning
  .map((andel) => mapAndelToField(andel))
  .find(skalRedigereInntektForAndel(values, faktaOmBeregning, beregningsgrunnlag)) !== undefined;


export const findInstruksjonForFastsetting = (skalHaBesteberegning, skalFastsetteFL, skalFastsetteAT, harKunstigArbeid) => {
  if (harKunstigArbeid) {
    return 'BeregningInfoPanel.KunstigArbeidsforhold.FastsettKunstigArbeidsforhold';
  }
  if (skalHaBesteberegning) {
    return 'KunYtelsePanel.OverskriftBesteberegning';
  }
  if (skalFastsetteFL) {
    if (!skalFastsetteAT) {
      return 'BeregningInfoPanel.VurderOgFastsettATFL.FastsettFrilans';
    }
    return 'BeregningInfoPanel.VurderOgFastsettATFL.FastsettATFLAlleOppdrag';
  }
  if (skalFastsetteAT) {
    return 'BeregningInfoPanel.VurderOgFastsettATFL.FastsettArbeidsinntekt';
  }
  return ' ';
};


const finnInntektstabell = (readOnly, behandlingId, behandlingVersjon, beregningsgrunnlag, isAksjonspunktClosed, alleKodeverk) => (
  <FieldArray
    name={INNTEKT_FIELD_ARRAY_NAME}
    component={InntektFieldArray}
    readOnly={readOnly}
    skalKunneLeggeTilAndel={false}
    behandlingId={behandlingId}
    behandlingVersjon={behandlingVersjon}
    beregningsgrunnlag={beregningsgrunnlag}
    alleKodeverk={alleKodeverk}
    isAksjonspunktClosed={isAksjonspunktClosed}
  />
);

/**
 * VurderOgFastsettATFL
 *
 * Presentasjonskomponent. Styrer samspillet mellom tre tilfeller av vurdering: VURDER_LONNSENDRING,
 * VURDER_NYOPPSTARTET_FL og VURDER_AT_OG_FL_I_SAMME_ORGANISASJON.
 * Dersom alle tre opptrer samtidig er det et spesialtilfelle, der saksbehandler først må vurdere to
 * tilfeller før h*n kan fastsette inntekt.
 */

const VurderOgFastsettATFL = ({
  readOnly,
  isAksjonspunktClosed,
  tilfeller,
  beregningsgrunnlag,
  manglerInntektsmelding,
  skalFastsetteAT,
  skalFastsetteFL,
  skalHaBesteberegning,
  harKunstigArbeid,
  skalViseTabell,
  behandlingId,
  behandlingVersjon,
  aksjonspunkter,
  alleKodeverk,
  erOverstyrer,
}) => (
  <div>
    <InntektstabellPanel
      key="inntektstabell"
      tabell={finnInntektstabell(readOnly, behandlingId, behandlingVersjon, beregningsgrunnlag, isAksjonspunktClosed, alleKodeverk)}
      skalViseTabell={skalViseTabell}
      hjelpeTekstId={findInstruksjonForFastsetting(skalHaBesteberegning, skalFastsetteFL, skalFastsetteAT, harKunstigArbeid)}
      readOnly={readOnly}
      erOverstyrer={erOverstyrer}
      aksjonspunkter={aksjonspunkter}
      behandlingId={behandlingId}
      behandlingVersjon={behandlingVersjon}
    >
      <ATFLSammeOrgTekst
        beregningsgrunnlag={beregningsgrunnlag}
        manglerInntektsmelding={manglerInntektsmelding}
      />
      {tilfeller.includes(faktaOmBeregningTilfelle.VURDER_LONNSENDRING)
      && (
        <LonnsendringForm
          readOnly={readOnly}
          isAksjonspunktClosed={isAksjonspunktClosed}
          tilfeller={tilfeller}
          manglerIM={manglerInntektsmelding}
        />
      )}
      {tilfeller.includes(faktaOmBeregningTilfelle.VURDER_ETTERLONN_SLUTTPAKKE)
      && (
        <VurderEtterlonnSluttpakkeForm
          readOnly={readOnly}
          isAksjonspunktClosed={isAksjonspunktClosed}
          behandlingId={behandlingId}
          behandlingVersjon={behandlingVersjon}
        />
      )}
      {tilfeller.includes(faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL)
      && (
        <NyoppstartetFLForm
          readOnly={readOnly}
          isAksjonspunktClosed={isAksjonspunktClosed}
          manglerIM={manglerInntektsmelding}
        />
      )}
      {tilfeller.includes(faktaOmBeregningTilfelle.VURDER_MOTTAR_YTELSE)
      && (
        <VurderMottarYtelseForm
          readOnly={readOnly}
          isAksjonspunktClosed={isAksjonspunktClosed}
          tilfeller={tilfeller}
          beregningsgrunnlag={beregningsgrunnlag}
          alleKodeverk={alleKodeverk}
        />
      )}
      {tilfeller.includes(faktaOmBeregningTilfelle.VURDER_BESTEBEREGNING) && !tilfeller.includes(faktaOmBeregningTilfelle.FASTSETT_BG_KUN_YTELSE)
      && (
        <VurderBesteberegningForm
          readOnly={readOnly}
          isAksjonspunktClosed={isAksjonspunktClosed}
          behandlingId={behandlingId}
          behandlingVersjon={behandlingVersjon}
        />
      )}
    </InntektstabellPanel>
  </div>
);

VurderOgFastsettATFL.buildInitialValues = (aksjonspunkter, faktaOmBeregning) => {
  if (!faktaOmBeregning) {
    return {};
  }
  const andeler = faktaOmBeregning.andelerForFaktaOmBeregning;
  if (andeler.length === 0) {
    return {};
  }
  return {
    [INNTEKT_FIELD_ARRAY_NAME]: InntektFieldArray.buildInitialValues(andeler),
    ...InntektstabellPanel.buildInitialValues(aksjonspunkter),
  };
};


VurderOgFastsettATFL.validate = (values, tilfeller, faktaOmBeregning, beregningsgrunnlag) => {
  const errors = {};
  if (harVurdert(tilfeller, values, faktaOmBeregning) && skalFastsetteInntekt(values, faktaOmBeregning, beregningsgrunnlag)) {
    errors[INNTEKT_FIELD_ARRAY_NAME] = InntektFieldArray.validate(values[INNTEKT_FIELD_ARRAY_NAME], false,
      skalRedigereInntektForAndel(values, faktaOmBeregning, beregningsgrunnlag));
  }
  return errors;
};

const concatTilfeller = (transformed, newTransformedValues) => ({
  ...transformed,
  ...newTransformedValues,
  faktaOmBeregningTilfeller: newTransformedValues.faktaOmBeregningTilfeller
    ? transformed.faktaOmBeregningTilfeller.concat(newTransformedValues.faktaOmBeregningTilfeller) : transformed.faktaOmBeregningTilfeller,
});


const transformValuesForOverstyring = (values, transformed, inntektVerdier, fastsatteAndelsnr) => {
  if (erOverstyring(values)) {
    const overstyrteAndeler = inntektVerdier.filter((andel) => !fastsatteAndelsnr.includes(andel.andelsnr))
      .map((verdi) => ({
        andelsnr: verdi.andelsnr,
        nyAndel: verdi.nyAndel,
        lagtTilAvSaksbehandler: verdi.lagtTilAvSaksbehandler,
        fastsatteVerdier: {
          fastsattBeløp: verdi.fastsattBelop,
          inntektskategori: verdi.inntektskategori,
        },
      }));
    return {
      fakta: transformed,
      overstyrteAndeler,
    };
  }
  return {
    fakta: transformed,
  };
};

const transformValuesForAksjonspunkt = (values, inntektVerdier, fastsatteAndelsnr, faktaOmBeregning, beregningsgrunnlag) => {
  const tilfeller = faktaOmBeregning.faktaOmBeregningTilfeller
    ? faktaOmBeregning.faktaOmBeregningTilfeller.map(({ kode }) => kode) : [];
  let transformed = { faktaOmBeregningTilfeller: [] };
  if (tilfeller.length > 0) {
    // Besteberegning
    transformed = concatTilfeller(transformed, vurderBesteberegningTransform(faktaOmBeregning)(values, inntektVerdier));
    const allInntektErFastsatt = values[besteberegningField] === true;
    // Nyoppstartet FL
    transformed = concatTilfeller(transformed, NyoppstartetFLForm.transformValues(values, allInntektErFastsatt ? null : inntektVerdier,
      faktaOmBeregning, fastsatteAndelsnr));
    // Etterlønn / sluttpakke
    transformed = concatTilfeller(transformed, VurderEtterlonnSluttpakkeForm.transformValues(values, allInntektErFastsatt ? null : inntektVerdier,
      faktaOmBeregning, fastsatteAndelsnr));
    // Lønnsendring FL
    transformed = concatTilfeller(transformed, LonnsendringForm.transformValues(values, faktaOmBeregning));
    // Mottar ytelse
    transformed = concatTilfeller(transformed, VurderMottarYtelseForm.transformValues(values, allInntektErFastsatt ? null : inntektVerdier,
      faktaOmBeregning, beregningsgrunnlag, fastsatteAndelsnr));
    // ATFL i samme org
    transformed = concatTilfeller(transformed, transformValuesForATFLISammeOrg(allInntektErFastsatt ? null : inntektVerdier,
      faktaOmBeregning, fastsatteAndelsnr));
    // Inntekt for arbeid uten inntektsmelding
    transformed = concatTilfeller(transformed, transformValuesArbeidUtenInntektsmelding(values, allInntektErFastsatt ? null : inntektVerdier,
      faktaOmBeregning, beregningsgrunnlag, fastsatteAndelsnr));
  }
  return transformed;
};

VurderOgFastsettATFL.transformValues = (faktaOmBeregning, beregningsgrunnlag) => (values) => {
  const inntektVerdier = InntektFieldArray.transformValues(values[INNTEKT_FIELD_ARRAY_NAME]);
  const fastsatteAndelsnr = [];
  const transformed = transformValuesForAksjonspunkt(values, inntektVerdier, fastsatteAndelsnr, faktaOmBeregning, beregningsgrunnlag);
  return transformValuesForOverstyring(values, transformed, inntektVerdier, fastsatteAndelsnr);
};

VurderOgFastsettATFL.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
  tilfeller: PropTypes.arrayOf(PropTypes.string).isRequired,
  manglerInntektsmelding: PropTypes.bool.isRequired,
  skalFastsetteAT: PropTypes.bool.isRequired,
  skalFastsetteFL: PropTypes.bool.isRequired,
  skalHaBesteberegning: PropTypes.bool.isRequired,
  harKunstigArbeid: PropTypes.bool.isRequired,
  skalViseTabell: PropTypes.bool.isRequired,
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  erOverstyrer: PropTypes.bool.isRequired,
  aksjonspunkter: PropTypes.arrayOf(beregningAksjonspunkterPropType).isRequired,
  beregningsgrunnlag: PropTypes.shape().isRequired,
};

export const skalFastsettInntektForArbeidstaker = createSelector([
  getFormValuesForBeregning,
  getSkalRedigereInntekt],
(values, skalFastsette) => {
  const fields = values[INNTEKT_FIELD_ARRAY_NAME];
  if (!fields) {
    return false;
  }
  return fields.filter((field) => field.aktivitetStatus === aktivitetStatus.ARBEIDSTAKER).map(skalFastsette).includes(true);
});

export const skalFastsettInntektForFrilans = createSelector([
  getFormValuesForBeregning,
  getSkalRedigereInntekt],
(values, skalFastsette) => {
  const fields = values[INNTEKT_FIELD_ARRAY_NAME];
  if (!fields) {
    return false;
  }
  return fields.filter((field) => field.aktivitetStatus === aktivitetStatus.FRILANSER).map(skalFastsette).includes(true);
});

const getManglerInntektsmelding = createSelector([(ownProps) => ownProps.faktaOmBeregning],
  (faktaOmBeregning) => {
    if (faktaOmBeregning.arbeidstakerOgFrilanserISammeOrganisasjonListe && faktaOmBeregning.arbeidstakerOgFrilanserISammeOrganisasjonListe.length > 0) {
      return faktaOmBeregning.arbeidstakerOgFrilanserISammeOrganisasjonListe.find((forhold) => !forhold.inntektPrMnd) !== undefined;
    }
    return false;
  });

const getSkalViseTabell = createSelector([
  (state, ownProps) => ownProps.tilfeller,
  (state, ownProps) => ownProps.beregningsgrunnlag,
  skalFastsetteInntektForSN],
(tilfeller, beregningsgrunnlag, skalFastsetteSN) => {
  if (beregningsgrunnlag.beregningsgrunnlagPeriode[0].beregningsgrunnlagPrStatusOgAndel
    .some((andel) => andel.aktivitetStatus.kode !== aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE)) {
    return !tilfeller.includes(faktaOmBeregningTilfelle.FASTSETT_BG_KUN_YTELSE);
  }
  return skalFastsetteSN;
});

const mapStateToProps = (state, ownProps) => ({
  skalFastsetteAT: skalFastsettInntektForArbeidstaker(state, ownProps),
  skalFastsetteFL: skalFastsettInntektForFrilans(state, ownProps),
  skalHaBesteberegning: getFormValuesForBeregning(state, ownProps)[besteberegningField] === true,
  manglerInntektsmelding: getManglerInntektsmelding(ownProps),
  skalViseTabell: getSkalViseTabell(state, ownProps),
  harKunstigArbeid: harKunstigArbeidsforhold(ownProps.tilfeller, ownProps.beregningsgrunnlag),
});

export default connect(mapStateToProps)(VurderOgFastsettATFL);

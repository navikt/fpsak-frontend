import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FieldArray } from 'redux-form';

import faktaOmBeregningTilfelle from '@fpsak-frontend/kodeverk/src/faktaOmBeregningTilfelle';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';

import LonnsendringForm, { lonnsendringField }
  from 'behandlingForstegangOgRevurdering/src/fakta/components/beregning/fellesFaktaForATFLogSN/vurderOgFastsettATFL/forms/LonnsendringForm';
import NyoppstartetFLForm, { erNyoppstartetFLField }
  from 'behandlingForstegangOgRevurdering/src/fakta/components/beregning/fellesFaktaForATFLogSN/vurderOgFastsettATFL/forms/NyoppstartetFLForm';
import { getFaktaOmBeregning, getBeregningsgrunnlag } from 'behandlingForstegangOgRevurdering/src/behandlingSelectors';
import { harVurdertMottarYtelse } from './forms/VurderMottarYtelseUtils';
import InntektstabellPanel from '../InntektstabellPanel';
import { ATFLSammeOrgTekst, transformValuesForATFLISammeOrg } from './forms/ATFLSammeOrg';
import { transformValuesKunstigArbeidsforhold, harKunstigArbeidsforhold } from './forms/KunstigArbeidsforhold';
import VurderMottarYtelseForm from './forms/VurderMottarYtelseForm';
import FastsettEndretBeregningsgrunnlag from '../endringBeregningsgrunnlag/FastsettEndretBeregningsgrunnlag';
import { getFormValuesForBeregning } from '../../BeregningFormUtils';
import {
 skalRedigereInntektForAndel, mapAndelToField, skalFastsettInntektForStatus, erOverstyring,
} from '../BgFordelingUtils';
import VurderBesteberegningForm, { besteberegningField, vurderBesteberegningTransform } from '../besteberegningFodendeKvinne/VurderBesteberegningForm';
import InntektFieldArray from '../InntektFieldArray';


export const inntektFieldArrayName = 'inntektFieldArray';


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

const skalFastsetteInntekt = (values, faktaOmBeregning, beregningsgrunnlag, getKodeverknavn) => {
  if (faktaOmBeregning.faktaOmBeregningTilfeller.map(({ kode }) => kode).includes(faktaOmBeregningTilfelle.FASTSETT_ENDRET_BEREGNINGSGRUNNLAG)) {
    return !values[besteberegningField];
  }
  return beregningsgrunnlag.beregningsgrunnlagPeriode[0]
    .beregningsgrunnlagPrStatusOgAndel
    .map(andel => mapAndelToField(andel, getKodeverknavn, faktaOmBeregning))
    .find(skalRedigereInntektForAndel(values, faktaOmBeregning, beregningsgrunnlag)) !== undefined;
};


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


const finnInntektstabell = (tilfeller, readOnly, isAksjonspunktClosed) => {
  if (tilfeller.includes(faktaOmBeregningTilfelle.FASTSETT_ENDRET_BEREGNINGSGRUNNLAG)) {
    // For visning av saker med tilfelle FASTSETT_ENDRET_BEREGNINGSGRUNNLAG
    // Opprettelse av FASTSETT_ENDRET_BEREGNINGSGRUNNLAG er fjernet og håndteres nå i aksjonspunkt FORDEL_BEREGNINGSGRUNNLAG
    // Migrer data til nytt aksjonspunkt før sletting
    return (
      <FastsettEndretBeregningsgrunnlag
        readOnly={readOnly}
        isAksjonspunktClosed={isAksjonspunktClosed}
      />
    );
  }
  return (
    <FieldArray
      name={inntektFieldArrayName}
      component={InntektFieldArray}
      readOnly={readOnly}
      skalKunneLeggeTilAndel={false}
    />
  );
};

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
  manglerInntektsmelding,
  skalFastsetteAT,
  skalFastsetteFL,
  skalHaBesteberegning,
  harKunstigArbeid,
  skalViseTabell,
}) => (
  <div>
    <InntektstabellPanel
      key="inntektstabell"
      tabell={finnInntektstabell(tilfeller, readOnly, isAksjonspunktClosed)}
      skalViseTabell={skalViseTabell}
      hjelpeTekstId={findInstruksjonForFastsetting(skalHaBesteberegning, skalFastsetteFL, skalFastsetteAT, harKunstigArbeid)}
      readOnly={readOnly}
    >
      <ATFLSammeOrgTekst
        tilfeller={tilfeller}
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
      )
      }
      {tilfeller.includes(faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL)
      && (
        <NyoppstartetFLForm
          readOnly={readOnly}
          isAksjonspunktClosed={isAksjonspunktClosed}
          tilfeller={tilfeller}
          manglerIM={manglerInntektsmelding}
        />
      )
      }
      {tilfeller.includes(faktaOmBeregningTilfelle.VURDER_MOTTAR_YTELSE)
      && (
        <VurderMottarYtelseForm
          readOnly={readOnly}
          isAksjonspunktClosed={isAksjonspunktClosed}
          tilfeller={tilfeller}
        />
      )
      }
      {tilfeller.includes(faktaOmBeregningTilfelle.VURDER_BESTEBEREGNING)
      && (
        <VurderBesteberegningForm
          readOnly={readOnly}
          isAksjonspunktClosed={isAksjonspunktClosed}
        />
      )
      }
    </InntektstabellPanel>
  </div>
);

VurderOgFastsettATFL.buildInitialValues = (beregningsgrunnlag, getKodeverknavn, aksjonspunkter, faktaOmBeregning) => {
  if (!beregningsgrunnlag) {
    return {};
  }
  const andeler = beregningsgrunnlag.beregningsgrunnlagPeriode[0].beregningsgrunnlagPrStatusOgAndel
  .filter(andel => andel.aktivitetStatus.kode !== aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE);
  return {
    [inntektFieldArrayName]: InntektFieldArray.buildInitialValues(andeler, getKodeverknavn, faktaOmBeregning),
    ...InntektstabellPanel.buildInitialValues(aksjonspunkter),
  };
};


VurderOgFastsettATFL.validate = (values, tilfeller, faktaOmBeregning, beregningsgrunnlag, getKodeverknavn) => {
  const errors = {};
  if (harVurdert(tilfeller, values, faktaOmBeregning) && skalFastsetteInntekt(values, faktaOmBeregning, beregningsgrunnlag, getKodeverknavn)) {
    errors[inntektFieldArrayName] = InntektFieldArray.validate(values[inntektFieldArrayName], false,
      skalRedigereInntektForAndel(values, faktaOmBeregning, beregningsgrunnlag));
  }
  return errors;
};

const endretBGTransform = endringBGPerioder => values => ({
  faktaOmBeregningTilfeller: [faktaOmBeregningTilfelle.FASTSETT_ENDRET_BEREGNINGSGRUNNLAG],
  ...FastsettEndretBeregningsgrunnlag.transformValues(values, endringBGPerioder),
});

const concatTilfeller = (transformed, newTransformedValues) => ({
  ...transformed,
  ...newTransformedValues,
  faktaOmBeregningTilfeller: newTransformedValues.faktaOmBeregningTilfeller
    ? transformed.faktaOmBeregningTilfeller.concat(newTransformedValues.faktaOmBeregningTilfeller) : transformed.faktaOmBeregningTilfeller,
});


const transformValuesForOverstyring = (values, transformed, inntektVerdier, fastsatteAndelsnr) => {
  if (erOverstyring(values)) {
    const overstyrteAndeler = inntektVerdier.filter(andel => !fastsatteAndelsnr.includes(andel.andelsnr))
      .map(verdi => ({
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
  let allInntektErFastsatt = false;
  const tilfeller = faktaOmBeregning.faktaOmBeregningTilfeller
  ? faktaOmBeregning.faktaOmBeregningTilfeller.map(({ kode }) => kode) : [];
  let transformed = { faktaOmBeregningTilfeller: [] };
  if (tilfeller.length > 0) {
    if (tilfeller.includes(faktaOmBeregningTilfelle.FASTSETT_ENDRET_BEREGNINGSGRUNNLAG)) {
      allInntektErFastsatt = true;
      transformed = endretBGTransform(faktaOmBeregning.endringBeregningsgrunnlag.endringBeregningsgrunnlagPerioder)(values);
    }
    // Besteberegning
    transformed = concatTilfeller(transformed, vurderBesteberegningTransform(faktaOmBeregning)(values, allInntektErFastsatt ? null : inntektVerdier));
    allInntektErFastsatt = allInntektErFastsatt || values[besteberegningField] === true;
    // Nyoppstartet FL
    transformed = concatTilfeller(transformed, NyoppstartetFLForm.transformValues(values, allInntektErFastsatt ? null : inntektVerdier,
      faktaOmBeregning, fastsatteAndelsnr));
    // Lønnsendring FL
    transformed = concatTilfeller(transformed,
      LonnsendringForm.transformValues(values, allInntektErFastsatt ? null : inntektVerdier, faktaOmBeregning, fastsatteAndelsnr));
    // Mottar ytelse
    transformed = concatTilfeller(transformed, VurderMottarYtelseForm.transformValues(values, allInntektErFastsatt ? null : inntektVerdier,
      faktaOmBeregning, beregningsgrunnlag, fastsatteAndelsnr));
    // ATFL i samme org
    transformed = concatTilfeller(transformed, transformValuesForATFLISammeOrg(allInntektErFastsatt ? null : inntektVerdier,
      faktaOmBeregning, fastsatteAndelsnr));
    // Kunstig arbeidsforhold
    transformed = concatTilfeller(transformed, transformValuesKunstigArbeidsforhold(allInntektErFastsatt ? null : inntektVerdier,
      faktaOmBeregning, beregningsgrunnlag, fastsatteAndelsnr));
  }
  return transformed;
};


VurderOgFastsettATFL.transformValues = (faktaOmBeregning, beregningsgrunnlag) => (values) => {
  const inntektVerdier = InntektFieldArray.transformValues(values[inntektFieldArrayName]);
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
};


const mapStateToProps = (state, initialProps) => {
  const skalFastsetteAT = skalFastsettInntektForStatus(inntektFieldArrayName, aktivitetStatus.ARBEIDSTAKER)(state);
  const skalFastsetteFL = skalFastsettInntektForStatus(inntektFieldArrayName, aktivitetStatus.FRILANSER)(state);
  const faktaOmBeregning = getFaktaOmBeregning(state);
  const beregningsgrunnlag = getBeregningsgrunnlag(state);
  let manglerInntektsmelding = false;
  if (faktaOmBeregning.arbeidstakerOgFrilanserISammeOrganisasjonListe && faktaOmBeregning.arbeidstakerOgFrilanserISammeOrganisasjonListe.length > 0) {
    manglerInntektsmelding = faktaOmBeregning.arbeidstakerOgFrilanserISammeOrganisasjonListe.find(forhold => !forhold.inntektPrMnd) !== undefined;
  }
  const values = getFormValuesForBeregning(state);
  return {
    skalViseTabell: beregningsgrunnlag.beregningsgrunnlagPeriode[0].beregningsgrunnlagPrStatusOgAndel
    .some(andel => andel.aktivitetStatus.kode !== aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE)
    && !initialProps.tilfeller.includes(faktaOmBeregningTilfelle.FASTSETT_BG_KUN_YTELSE),
    skalHaBesteberegning: values[besteberegningField] === true,
    harKunstigArbeid: harKunstigArbeidsforhold(initialProps.tilfeller, beregningsgrunnlag),
    manglerInntektsmelding,
    skalFastsetteAT,
    skalFastsetteFL,
  };
};

export default connect(mapStateToProps)(VurderOgFastsettATFL);

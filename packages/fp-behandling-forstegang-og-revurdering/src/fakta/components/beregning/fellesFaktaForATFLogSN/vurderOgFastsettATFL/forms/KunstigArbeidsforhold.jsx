import organisasjonstyper from '@fpsak-frontend/kodeverk/src/organisasjonstype';
import faktaOmBeregningTilfelle from '@fpsak-frontend/kodeverk/src/faktaOmBeregningTilfelle';
import { removeSpacesFromNumber } from '@fpsak-frontend/utils';


export const transformValuesKunstigArbeidsforhold = (inntektVerdier, faktaOmBeregning, bg, fastsatteAndelsnr) => {
  if (!faktaOmBeregning.faktaOmBeregningTilfeller.map(({ kode }) => kode)
  .includes(faktaOmBeregningTilfelle.FASTSETT_MAANEDSLONN_ARBEIDSTAKER_UTEN_INNTEKTSMELDING)) {
    return {};
  }
  if (inntektVerdier === null) {
    return {};
  }

  const kunstigeArbeidsforhold = inntektVerdier
    .filter(field => !fastsatteAndelsnr.includes(field.andelsnr) && !fastsatteAndelsnr.includes(field.andelsnrRef))
    .filter(field => bg.beregningsgrunnlagPeriode[0].beregningsgrunnlagPrStatusOgAndel
      .find(andel => (andel.andelsnr === field.andelsnr || andel.andelsnr === field.andelsnrRef)
      && andel.arbeidsforhold
      && andel.arbeidsforhold.organisasjonstype
      && andel.arbeidsforhold.organisasjonstype.kode === organisasjonstyper.KUNSTIG));
      kunstigeArbeidsforhold.forEach(field => fastsatteAndelsnr.push(field.andelsnr));
  const fastsattInntekt = kunstigeArbeidsforhold
    .map(field => ({
      andelsnr: field.andelsnr,
      fastsatteVerdier: {
        fastsattBeløp: removeSpacesFromNumber(field.fastsattBelop),
        inntektskategori: field.inntektskategori,
      },
  }));
  if (fastsattInntekt.length > 0) {
    return ({
        faktaOmBeregningTilfeller: [faktaOmBeregningTilfelle.FASTSETT_MAANEDSLONN_ARBEIDSTAKER_UTEN_INNTEKTSMELDING],
        fastsattUtenInntektsmelding: { andelListe: fastsattInntekt },
      });
  }
  return {};
};

export const harKunstigArbeidsforhold = (tilfeller, beregningsgrunnlag) => {
  if (tilfeller.includes(faktaOmBeregningTilfelle.FASTSETT_MAANEDSLONN_ARBEIDSTAKER_UTEN_INNTEKTSMELDING)) {
    return beregningsgrunnlag.beregningsgrunnlagPeriode[0].beregningsgrunnlagPrStatusOgAndel
    .find(andel => andel.arbeidsforhold
      && andel.arbeidsforhold.organisasjonstype
      && andel.arbeidsforhold.organisasjonstype.kode === organisasjonstyper.KUNSTIG) !== undefined;
  }
  return false;
};

export default transformValuesKunstigArbeidsforhold;

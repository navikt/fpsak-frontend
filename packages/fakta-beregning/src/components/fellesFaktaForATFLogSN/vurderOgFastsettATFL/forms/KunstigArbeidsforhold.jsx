import organisasjonstyper from '@fpsak-frontend/kodeverk/src/organisasjonstype';
import faktaOmBeregningTilfelle from '@fpsak-frontend/kodeverk/src/faktaOmBeregningTilfelle';

const harAndelKunstigArbeidsforhold = (andel) => andel.arbeidsforhold
&& andel.arbeidsforhold.organisasjonstype
&& andel.arbeidsforhold.organisasjonstype.kode === organisasjonstyper.KUNSTIG;

export const harKunstigArbeidsforhold = (tilfeller, beregningsgrunnlag) => {
  if (tilfeller.includes(faktaOmBeregningTilfelle.FASTSETT_MAANEDSLONN_ARBEIDSTAKER_UTEN_INNTEKTSMELDING)) {
    return beregningsgrunnlag.beregningsgrunnlagPeriode[0].beregningsgrunnlagPrStatusOgAndel
      .find(harAndelKunstigArbeidsforhold) !== undefined;
  }
  return false;
};

export const harFieldKunstigArbeidsforhold = (field, bg) => bg.beregningsgrunnlagPeriode[0].beregningsgrunnlagPrStatusOgAndel
  .find((andel) => (andel.andelsnr === field.andelsnr || andel.andelsnr === field.andelsnrRef)
&& andel.arbeidsforhold
&& andel.arbeidsforhold.organisasjonstype
&& andel.arbeidsforhold.organisasjonstype.kode === organisasjonstyper.KUNSTIG) !== undefined;

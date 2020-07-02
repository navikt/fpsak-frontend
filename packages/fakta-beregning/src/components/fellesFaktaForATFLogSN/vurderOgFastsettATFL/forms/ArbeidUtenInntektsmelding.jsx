import { removeSpacesFromNumber } from '@fpsak-frontend/utils';
import faktaOmBeregningTilfelle from '@fpsak-frontend/kodeverk/src/faktaOmBeregningTilfelle';
import erAndelUtenReferanseOgGrunnlagHarAndelForSammeArbeidsgiverMedReferanse from './AvsluttetArbeidsforhold';
import { harFieldKunstigArbeidsforhold } from './KunstigArbeidsforhold';
import { harFieldLønnsendring } from './LonnsendringForm';

const transformValuesArbeidUtenInntektsmelding = (values, inntektVerdier, faktaOmBeregning, bg, fastsatteAndelsnr) => {
  const tilfeller = faktaOmBeregning.faktaOmBeregningTilfeller ? faktaOmBeregning.faktaOmBeregningTilfeller : [];

  if (!tilfeller.map(({ kode }) => kode)
    .includes(faktaOmBeregningTilfelle.FASTSETT_MAANEDSLONN_ARBEIDSTAKER_UTEN_INNTEKTSMELDING)
    && !tilfeller.map(({ kode }) => kode)
      .includes(faktaOmBeregningTilfelle.VURDER_LONNSENDRING)) {
    return {};
  }
  if (inntektVerdier === null) {
    return {};
  }
  const arbeidUtenInntektsmelding = inntektVerdier
    .filter((field) => !fastsatteAndelsnr.includes(field.andelsnr) && !fastsatteAndelsnr.includes(field.andelsnrRef))
    .filter((field) => erAndelUtenReferanseOgGrunnlagHarAndelForSammeArbeidsgiverMedReferanse(field, bg)
      || harFieldKunstigArbeidsforhold(field, bg)
      || harFieldLønnsendring(field, faktaOmBeregning, values));

  arbeidUtenInntektsmelding.forEach((field) => fastsatteAndelsnr.push(field.andelsnr));
  const fastsattInntekt = arbeidUtenInntektsmelding
    .map((field) => ({
      andelsnr: field.andelsnr,
      fastsattBeløp: removeSpacesFromNumber(field.fastsattBelop),
      inntektskategori: field.inntektskategori,
    }));
  if (fastsattInntekt.length > 0) {
    return ({
      faktaOmBeregningTilfeller: [faktaOmBeregningTilfelle.FASTSETT_MAANEDSLONN_ARBEIDSTAKER_UTEN_INNTEKTSMELDING],
      fastsattUtenInntektsmelding: { andelListe: fastsattInntekt },
    });
  }
  return {};
};

export default transformValuesArbeidUtenInntektsmelding;

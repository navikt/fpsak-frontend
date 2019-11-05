import { expect } from 'chai';
import organisasjonstyper from '@fpsak-frontend/kodeverk/src/organisasjonstype';
import faktaOmBeregningTilfelle from '@fpsak-frontend/kodeverk/src/faktaOmBeregningTilfelle';

import { transformValuesKunstigArbeidsforhold } from './KunstigArbeidsforhold';


describe('<KunstigArbeidsforhold>', () => {
  it('skal ikke transform values uten tilfelle', () => {
    const inntektVerdier = [
      { andelsnr: 1, fastsattBelop: '10 0000' },
    ];
    const faktaOmBeregning = {
      faktaOmBeregningTilfeller: [{ kode: faktaOmBeregningTilfelle.VURDER_MOTTAR_YTELSE }],
    };
    const transformed = transformValuesKunstigArbeidsforhold(inntektVerdier, faktaOmBeregning, {}, []);
    expect(transformed).to.be.empty;
  });

  it('skal ikke transform values når inntektverdier er null', () => {
    const faktaOmBeregning = {
      faktaOmBeregningTilfeller: [{ kode: faktaOmBeregningTilfelle.VURDER_MOTTAR_YTELSE },
        { kode: faktaOmBeregningTilfelle.FASTSETT_MAANEDSLONN_ARBEIDSTAKER_UTEN_INNTEKTSMELDING }],
    };
    const transformed = transformValuesKunstigArbeidsforhold(null, faktaOmBeregning, {}, []);
    expect(transformed).to.be.empty;
  });

  it('skal ikke transform values når andel allerede er fastsatt', () => {
    const faktaOmBeregning = {
      faktaOmBeregningTilfeller: [{ kode: faktaOmBeregningTilfelle.VURDER_MOTTAR_YTELSE },
        { kode: faktaOmBeregningTilfelle.FASTSETT_MAANEDSLONN_ARBEIDSTAKER_UTEN_INNTEKTSMELDING }],
    };
    const inntektVerdier = [
      { andelsnr: 1, fastsattBelop: '10 0000' },
    ];
    const bg = {
      beregningsgrunnlagPeriode: [
        {
          beregningsgrunnlagPrStatusOgAndel: [
            { andelsnr: 1, arbeidsforhold: { organisasjonstype: { kode: organisasjonstyper.KUNSTIG } } },
          ],
        },
      ],
    };
    const fastsatteAndeler = [1];
    const transformed = transformValuesKunstigArbeidsforhold(inntektVerdier, faktaOmBeregning, bg, fastsatteAndeler);
    expect(transformed).to.be.empty;
  });

  it('skal transform values', () => {
    const faktaOmBeregning = {
      faktaOmBeregningTilfeller: [{ kode: faktaOmBeregningTilfelle.VURDER_MOTTAR_YTELSE },
        { kode: faktaOmBeregningTilfelle.FASTSETT_MAANEDSLONN_ARBEIDSTAKER_UTEN_INNTEKTSMELDING }],
    };
    const inntektVerdier = [
      { andelsnr: 1, fastsattBelop: '10 000', inntektskategori: 'ARBEIDSTAKER' },
    ];
    const bg = {
      beregningsgrunnlagPeriode: [
        {
          beregningsgrunnlagPrStatusOgAndel: [
            { andelsnr: 1, arbeidsforhold: { organisasjonstype: { kode: organisasjonstyper.KUNSTIG } } },
          ],
        },
      ],
    };
    const fastsatteAndeler = [];
    const transformed = transformValuesKunstigArbeidsforhold(inntektVerdier, faktaOmBeregning, bg, fastsatteAndeler);
    expect(transformed.faktaOmBeregningTilfeller[0]).to.equal(faktaOmBeregningTilfelle.FASTSETT_MAANEDSLONN_ARBEIDSTAKER_UTEN_INNTEKTSMELDING);
    expect(transformed.fastsattUtenInntektsmelding.andelListe[0].andelsnr).to.equal(1);
    expect(transformed.fastsattUtenInntektsmelding.andelListe[0].fastsatteVerdier.fastsattBeløp).to.equal(10000);
    expect(transformed.fastsattUtenInntektsmelding.andelListe[0].fastsatteVerdier.inntektskategori).to.equal('ARBEIDSTAKER');
    expect(fastsatteAndeler[0]).to.equal(1);
  });
});

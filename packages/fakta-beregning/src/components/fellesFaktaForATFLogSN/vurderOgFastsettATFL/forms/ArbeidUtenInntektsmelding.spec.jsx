import { expect } from 'chai';
import organisasjonstyper from '@fpsak-frontend/kodeverk/src/organisasjonstype';
import faktaOmBeregningTilfelle from '@fpsak-frontend/kodeverk/src/faktaOmBeregningTilfelle';
import { lonnsendringField } from './LonnsendringForm';
import transformValues from './ArbeidUtenInntektsmelding';


describe('<ArbeidUtenInntektsmelding>', () => {
  it('skal ikke transform values uten tilfelle', () => {
    const inntektVerdier = [
      { andelsnr: 1, fastsattBelop: '10 0000' },
    ];
    const faktaOmBeregning = {
      faktaOmBeregningTilfeller: [{ kode: faktaOmBeregningTilfelle.VURDER_MOTTAR_YTELSE }],
    };
    const transformed = transformValues({}, inntektVerdier, faktaOmBeregning, {}, []);
    expect(transformed).to.be.empty;
  });

  it('skal ikke transform values når inntektverdier er null', () => {
    const faktaOmBeregning = {
      faktaOmBeregningTilfeller: [{ kode: faktaOmBeregningTilfelle.VURDER_MOTTAR_YTELSE },
        { kode: faktaOmBeregningTilfelle.FASTSETT_MAANEDSLONN_ARBEIDSTAKER_UTEN_INNTEKTSMELDING }],
    };
    const transformed = transformValues({}, null, faktaOmBeregning, {}, []);
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
    const transformed = transformValues({}, inntektVerdier, faktaOmBeregning, bg, fastsatteAndeler);
    expect(transformed).to.be.empty;
  });

  it('skal transform values for kunstig arbeidsforhold', () => {
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
    const transformed = transformValues({}, inntektVerdier, faktaOmBeregning, bg, fastsatteAndeler);
    expect(transformed.faktaOmBeregningTilfeller[0]).to.equal(faktaOmBeregningTilfelle.FASTSETT_MAANEDSLONN_ARBEIDSTAKER_UTEN_INNTEKTSMELDING);
    expect(transformed.fastsattUtenInntektsmelding.andelListe[0].andelsnr).to.equal(1);
    expect(transformed.fastsattUtenInntektsmelding.andelListe[0].fastsattBeløp).to.equal(10000);
    expect(transformed.fastsattUtenInntektsmelding.andelListe[0].inntektskategori).to.equal('ARBEIDSTAKER');
    expect(fastsatteAndeler[0]).to.equal(1);
  });


  it('skal teste at transformValues gir korrekt output når lønnsendring', () => {
    const values = { };
    values[lonnsendringField] = true;
    values.dummyField = 'tilfeldig verdi';
    const inntektVerdier = [
      { fastsattBelop: '10 000', andelsnr: 1 },
    ];
    const faktaOmBeregning = {
      faktaOmBeregningTilfeller: [{ kode: faktaOmBeregningTilfelle.VURDER_LONNSENDRING }],
      arbeidsforholdMedLønnsendringUtenIM: [{ andelsnr: 1 }],
    };
    const bg = {
      beregningsgrunnlagPeriode: [
        {
          beregningsgrunnlagPrStatusOgAndel: [
            { andelsnr: 1, arbeidsforhold: {} },
          ],
        },
      ],
    };
    const transformedObject = transformValues(values, inntektVerdier, faktaOmBeregning, bg, []);
    expect(transformedObject.fastsattUtenInntektsmelding.andelListe.length).to.equal(1);
    expect(transformedObject.fastsattUtenInntektsmelding.andelListe[0].andelsnr).to.equal(1);
    expect(transformedObject.fastsattUtenInntektsmelding.andelListe[0].fastsattBeløp).to.equal(10000);
  });


  it('skal ikkje submitte inntekt uten lønnsendring', () => {
    const values = { };
    values[lonnsendringField] = false;
    const inntektVerdier = [
      { fastsattBelop: '', andelsnr: 1 },
    ];
    const faktaOmBeregning = {
      faktaOmBeregningTilfeller: [{ kode: faktaOmBeregningTilfelle.VURDER_LONNSENDRING }],
      arbeidsforholdMedLønnsendringUtenIM: [{ andelsnr: 1 }],
    };
    const bg = {
      beregningsgrunnlagPeriode: [
        {
          beregningsgrunnlagPrStatusOgAndel: [
            { andelsnr: 1, arbeidsforhold: {} },
          ],
        },
      ],
    };
    const transformedObject = transformValues(values, inntektVerdier, faktaOmBeregning, bg, []);
    expect(transformedObject).to.be.empty;
  });


  it('skal transform values når ved avsluttet arbeidsforhold dagen før skjæringstidspunktet '
  + 'og et annet løpende i samme virksomhet der det er mottatt inntektsmelding', () => {
    const values = { };
    const inntektVerdier = [
      {
        fastsattBelop: '10 000', andelsnr: 1, arbeidsgiverId: '2134567', arbeidsforholdId: null,
      },
    ];
    const faktaOmBeregning = {
      faktaOmBeregningTilfeller: [{ kode: faktaOmBeregningTilfelle.VURDER_LONNSENDRING }],
      arbeidsforholdMedLønnsendringUtenIM: [{ andelsnr: 1 }],
    };
    const bg = {
      beregningsgrunnlagPeriode: [
        {
          beregningsgrunnlagPrStatusOgAndel: [
            { andelsnr: 1, aktivitetStatus: { kode: 'AT' }, arbeidsforhold: { arbeidsgiverId: '2134567', arbeidsforholdId: null } },
            { andelsnr: 2, aktivitetStatus: { kode: 'AT' }, arbeidsforhold: { arbeidsgiverId: '2134567', arbeidsforholdId: '8u328ru9h34' } },
          ],
        },
      ],
    };
    const transformedObject = transformValues(values, inntektVerdier, faktaOmBeregning, bg, []);
    expect(transformedObject.fastsattUtenInntektsmelding.andelListe.length).to.equal(1);
    expect(transformedObject.fastsattUtenInntektsmelding.andelListe[0].andelsnr).to.equal(1);
    expect(transformedObject.fastsattUtenInntektsmelding.andelListe[0].fastsattBeløp).to.equal(10000);
  });
});

import { expect } from 'chai';
import aktivitetStatuser from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import {
  EndringBeregningsgrunnlagForm, getFieldNameKey, finnSumIPeriode,
  mapTilFastsatteVerdier, mapAndel,
  transformPerioder,
} from './EndringBeregningsgrunnlagForm';

const skalValidereMotRapportert = () => true;

const andel1 = {
  andelsnr: 1,
  fastsattBelop: null,
  readOnlyBelop: '10 000',
  harPeriodeAarsakGraderingEllerRefusjon: true,
  inntektskategori: 'ARBEIDSTAKER',
  nyAndel: false,
  skalKunneEndreRefusjon: false,
  lagtTilAvSaksbehandler: false,
  arbeidsforholdId: null,
  andel: 'Sopra Steria AS (2342342348)',
  aktivitetStatus: aktivitetStatuser.ARBEIDSTAKER,
};

const andel2 = {
  andelsnr: 2,
  fastsattBelop: '20 000',
  readOnlyBelop: '10 000',
  harPeriodeAarsakGraderingEllerRefusjon: true,
  skalKunneEndreRefusjon: false,
  refusjonskrav: '10 000',
  inntektskategori: 'ARBEIDSTAKER',
  nyAndel: false,
  lagtTilAvSaksbehandler: false,
  arbeidsforholdId: 'ri4j3f34rt3144',
  andel: 'Sopra Steria AS (2342342348)',
  aktivitetStatus: aktivitetStatuser.ARBEIDSTAKER,
};

describe('<EndringBeregningsgrunnlagForm>', () => {
  it('skal ikkje validere om det ikkje finnes perioder', () => {
    const values = {};
    const endringBGPerioder = [];
    const faktaOmBeregning = {};
    const beregningsgrunnlag = {};
    const errors = EndringBeregningsgrunnlagForm.validate(values, endringBGPerioder, faktaOmBeregning, beregningsgrunnlag, skalValidereMotRapportert);
    expect(errors).to.be.empty;
  });

  it('skal validere 1 periode', () => {
    const values = {};
    values[getFieldNameKey(0)] = [andel1, andel2];
    const endringBGPerioder = [{ fom: '2018-01-01', tom: null }];
    const beregningsgrunnlag = {
 beregningsgrunnlagPeriode: [{
      beregningsgrunnlagPeriodeFom: '2018-01-01',
      beregningsgrunnlagPrStatusOgAndel: [],
}],
};
    const errors = EndringBeregningsgrunnlagForm.validate(values, endringBGPerioder, beregningsgrunnlag, skalValidereMotRapportert);
    expect(errors[getFieldNameKey(0)]).to.not.be.empty;
  });

  it('skal validere 2 perioder', () => {
    const values = {};
    values[getFieldNameKey(0)] = [andel1, andel2];
    values[getFieldNameKey(1)] = [andel1, andel2];
    const endringBGPerioder = [{ fom: '2018-01-01', tom: '2018-07-01' }, { fom: '2018-07-02', tom: null }];
    const beregningsgrunnlag = {
 beregningsgrunnlagPeriode: [{
      beregningsgrunnlagPeriodeFom: '2018-01-01',
      beregningsgrunnlagPrStatusOgAndel: [],
},
{
  beregningsgrunnlagPeriodeFom: '2018-07-02',
  beregningsgrunnlagPrStatusOgAndel: [],
}],
};
    const errors = EndringBeregningsgrunnlagForm.validate(values, endringBGPerioder, beregningsgrunnlag, skalValidereMotRapportert);
    expect(errors[getFieldNameKey(0)]).to.not.be.empty;
    expect(errors[getFieldNameKey(1)]).to.not.be.empty;
  });

  it('skal finne sum av beregnetPrAar i periode, ulik null', () => {
    const perioder = [{
        beregningsgrunnlagPeriodeFom: '2018-07-02',
        beregningsgrunnlagPrStatusOgAndel: [{ beregnetPrAar: 50000 }, { beregnetPrAar: 50000 }],
    }];
    const fastsattIForstePeriode = finnSumIPeriode(perioder, '2018-07-02');
    expect(fastsattIForstePeriode).to.equal(100000);
  });

  it('skal finne sum av beregnet når en er lik null', () => {
    const perioder = [{
        beregningsgrunnlagPeriodeFom: '2018-07-02',
        beregningsgrunnlagPrStatusOgAndel: [{ beregnetPrAar: 50000 }, { beregnetPrAar: null }],
    }];
  const fastsattIForstePeriode = finnSumIPeriode(perioder, '2018-07-02');
  expect(fastsattIForstePeriode).to.equal(50000);
  });

  it('skal mappe andel til fastsatte verdier uten endring i refusjon', () => {
    const fastsatteVerdier = mapTilFastsatteVerdier(andel2);
    expect(fastsatteVerdier.fastsattÅrsbeløp).to.equal(20000);
    expect(fastsatteVerdier.refusjonPrÅr).to.equal(null);
    expect(fastsatteVerdier.inntektskategori).to.equal('ARBEIDSTAKER');
  });

  it('skal mappe andel til fastsatte verdier med endring i refusjon', () => {
    const andel = { ...andel2, skalKunneEndreRefusjon: true };
    const fastsatteVerdier = mapTilFastsatteVerdier(andel);
    expect(fastsatteVerdier.fastsattÅrsbeløp).to.equal(20000);
    expect(fastsatteVerdier.refusjonPrÅr).to.equal(10000);
    expect(fastsatteVerdier.inntektskategori).to.equal('ARBEIDSTAKER');
  });

  it('skal mappe verdier fra andel', () => {
    const verdier = mapAndel(andel2);
    expect(verdier.fastsatteVerdier.fastsattÅrsbeløp).to.equal(20000);
    expect(verdier.fastsatteVerdier.refusjonPrÅr).to.equal(null);
    expect(verdier.fastsatteVerdier.inntektskategori).to.equal('ARBEIDSTAKER');
    expect(verdier.lagtTilAvSaksbehandler).to.equal(false);
    expect(verdier.nyAndel).to.equal(false);
    expect(verdier.andel).to.equal('Sopra Steria AS (2342342348)');
    expect(verdier.arbeidsforholdId).to.equal('ri4j3f34rt3144');
  });

  it('skal transforme perioder for submit', () => {
    const endringBGPerioder = [
      { fom: '2018-01-01', tom: '2018-06-01', harPeriodeAarsakGraderingEllerRefusjon: false },
      { fom: '2018-06-02', tom: null, harPeriodeAarsakGraderingEllerRefusjon: true },
    ];
    const values = {};
    values[getFieldNameKey(0)] = [{ ...andel1 }, { ...andel2 }];
    values[getFieldNameKey(1)] = [{ ...andel1, fastsattBelop: '10 000' }, andel2];
    const perioder = transformPerioder(endringBGPerioder, values, false);
    expect(perioder.length).to.equal(1);
    expect(perioder[0].fom).to.equal('2018-06-02');
    expect(perioder[0].tom).to.equal(null);
    expect(perioder[0].andeler.length).to.equal(2);

    expect(perioder[0].andeler[0].fastsatteVerdier.fastsattÅrsbeløp).to.equal(10000);
    expect(perioder[0].andeler[0].fastsatteVerdier.refusjonPrÅr).to.equal(null);
    expect(perioder[0].andeler[0].fastsatteVerdier.inntektskategori).to.equal('ARBEIDSTAKER');
    expect(perioder[0].andeler[0].lagtTilAvSaksbehandler).to.equal(false);
    expect(perioder[0].andeler[0].nyAndel).to.equal(false);
    expect(perioder[0].andeler[0].andel).to.equal('Sopra Steria AS (2342342348)');
    expect(perioder[0].andeler[0].arbeidsforholdId).to.equal(null);

    expect(perioder[0].andeler[1].fastsatteVerdier.fastsattÅrsbeløp).to.equal(20000);
    expect(perioder[0].andeler[1].fastsatteVerdier.refusjonPrÅr).to.equal(null);
    expect(perioder[0].andeler[1].fastsatteVerdier.inntektskategori).to.equal('ARBEIDSTAKER');
    expect(perioder[0].andeler[1].lagtTilAvSaksbehandler).to.equal(false);
    expect(perioder[0].andeler[1].nyAndel).to.equal(false);
    expect(perioder[0].andeler[1].andel).to.equal('Sopra Steria AS (2342342348)');
    expect(perioder[0].andeler[1].arbeidsforholdId).to.equal('ri4j3f34rt3144');
  });
});

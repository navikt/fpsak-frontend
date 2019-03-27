import { expect } from 'chai';
import {
  EndringBeregningsgrunnlagForm, getFieldNameKey, finnFastsattIForstePeriode,
  mapTilFastsatteVerdier, mapAndel, finnRedigerteAndeler, shouldBeSubmitted, lagPeriodeForSubmit,
  transformPerioder,
} from './EndringBeregningsgrunnlagForm';

const skalOverstyreBg = () => true;

const andel1 = {
  andelsnr: 1,
  fastsattBeløp: null,
  readOnlyBelop: '10 000',
  skalRedigereInntekt: true,
  harPeriodeAarsakGraderingEllerRefusjon: true,
  inntektskategori: 'ARBEIDSTAKER',
  nyAndel: false,
  skalKunneEndreRefusjon: false,
  lagtTilAvSaksbehandler: false,
  arbeidsforholdId: null,
  andel: 'Sopra Steria AS (2342342348)',
};

const andel2 = {
  andelsnr: 2,
  fastsattBeløp: '20 000',
  readOnlyBelop: '10 000',
  skalRedigereInntekt: true,
  harPeriodeAarsakGraderingEllerRefusjon: true,
  skalKunneEndreRefusjon: false,
  refusjonskrav: '10 000',
  inntektskategori: 'ARBEIDSTAKER',
  nyAndel: false,
  lagtTilAvSaksbehandler: false,
  arbeidsforholdId: 'ri4j3f34rt3144',
  andel: 'Sopra Steria AS (2342342348)',
};

describe('<EndringBeregningsgrunnlagForm>', () => {
  it('skal ikkje validere om det ikkje finnes perioder', () => {
    const values = {};
    const endringBGPerioder = [];
    const faktaOmBeregning = {};
    const beregningsgrunnlag = {};
    const errors = EndringBeregningsgrunnlagForm.validate(values, endringBGPerioder, faktaOmBeregning, beregningsgrunnlag, skalOverstyreBg);
    expect(errors).to.be.empty;
  });

  it('skal validere 1 periode', () => {
    const values = {};
    values[getFieldNameKey(0)] = [andel1, andel2];
    const endringBGPerioder = [{ fom: '2018-01-01', tom: null }];
    const faktaOmBeregning = {};
    const beregningsgrunnlag = {};
    const errors = EndringBeregningsgrunnlagForm.validate(values, endringBGPerioder, faktaOmBeregning, beregningsgrunnlag, skalOverstyreBg);
    expect(errors[getFieldNameKey(0)]).to.not.be.empty;
  });

  it('skal validere 2 perioder', () => {
    const values = {};
    values[getFieldNameKey(0)] = [andel1, andel2];
    values[getFieldNameKey(1)] = [andel1, andel2];
    const endringBGPerioder = [{ fom: '2018-01-01', tom: '2018-07-01' }, { fom: '2018-07-02', tom: null }];
    const faktaOmBeregning = {};
    const beregningsgrunnlag = {};
    const errors = EndringBeregningsgrunnlagForm.validate(values, endringBGPerioder, faktaOmBeregning, beregningsgrunnlag, skalOverstyreBg);
    expect(errors[getFieldNameKey(0)]).to.not.be.empty;
    expect(errors[getFieldNameKey(1)]).to.not.be.empty;
  });

  it('skal finne fastsatt i forste periode når en andel kan redigere og en kan ikke redigeres, og den som redigeres er lik null', () => {
    const kanRedigereInntekt = andel => andel.andelsnr === 1;
    const values = {};
    values[getFieldNameKey(0)] = [andel1, andel2];
    const andel1IAndrePeriode = {
      ...andel1,
      fastsattBeløp: 50000,
      readOnlyBelop: 50000,
    };
    const andel2IAndrePeriode = {
      ...andel2,
      fastsattBeløp: 50000,
      readOnlyBelop: 50000,
    };
    values[getFieldNameKey(1)] = [andel1IAndrePeriode, andel2IAndrePeriode];
    const fastsattIForstePeriode = finnFastsattIForstePeriode(values, kanRedigereInntekt);
    expect(fastsattIForstePeriode).to.equal(10000);
  });

  it('skal finne fastsatt i forste periode når begge andeler kan redigeres og begge er ulik null', () => {
    const kanRedigereInntekt = () => true;
    const values = {};
    const andel1LocalCopy = {
      ...andel1,
      fastsattBeløp: 30000,
    };
    values[getFieldNameKey(0)] = [andel1LocalCopy, andel2];
    const andel1IAndrePeriode = {
      ...andel1,
      fastsattBeløp: 50000,
      readOnlyBelop: 50000,
    };
    const andel2IAndrePeriode = {
      ...andel2,
      fastsattBeløp: 50000,
      readOnlyBelop: 50000,
    };
    values[getFieldNameKey(1)] = [andel1IAndrePeriode, andel2IAndrePeriode];
    const fastsattIForstePeriode = finnFastsattIForstePeriode(values, kanRedigereInntekt);
    expect(fastsattIForstePeriode).to.equal(50000);
  });

  it('skal mappe andel til fastsatte verdier uten endring i refusjon', () => {
    const fastsatteVerdier = mapTilFastsatteVerdier(andel2);
    expect(fastsatteVerdier.fastsattBeløp).to.equal(20000);
    expect(fastsatteVerdier.refusjon).to.equal(null);
    expect(fastsatteVerdier.inntektskategori).to.equal('ARBEIDSTAKER');
  });

  it('skal mappe andel til fastsatte verdier med endring i refusjon', () => {
    const andel = { ...andel2, skalKunneEndreRefusjon: true };
    const fastsatteVerdier = mapTilFastsatteVerdier(andel);
    expect(fastsatteVerdier.fastsattBeløp).to.equal(20000);
    expect(fastsatteVerdier.refusjon).to.equal(10000);
    expect(fastsatteVerdier.inntektskategori).to.equal('ARBEIDSTAKER');
  });

  it('skal mappe verdier fra andel', () => {
    const verdier = mapAndel(false, null, null)(andel2);
    expect(verdier.fastsatteVerdier.fastsattBeløp).to.equal(20000);
    expect(verdier.fastsatteVerdier.refusjon).to.equal(null);
    expect(verdier.fastsatteVerdier.inntektskategori).to.equal('ARBEIDSTAKER');
    expect(verdier.lagtTilAvSaksbehandler).to.equal(false);
    expect(verdier.nyAndel).to.equal(false);
    expect(verdier.andel).to.equal('Sopra Steria AS (2342342348)');
    expect(verdier.arbeidsforholdId).to.equal('ri4j3f34rt3144');
  });

  it('skal finne alle andeler når periode har periodeårsak', () => {
    const values = {};
    values[getFieldNameKey(0)] = [andel1, andel2];
    values[getFieldNameKey(1)] = [andel1, andel2];
    const andeler = finnRedigerteAndeler(values, 1, true);
    expect(andeler.length).to.equal(2);
    expect(andeler[0]).to.equal(andel1);
    expect(andeler[1]).to.equal(andel2);
  });

  it('skal finne andeler som skal redigere inntekt når periode ikkje har periodeårsak', () => {
    const values = {};
    values[getFieldNameKey(0)] = [andel1, andel2];
    values[getFieldNameKey(1)] = [{ ...andel1, skalRedigereInntekt: false }, andel2];
    const andeler = finnRedigerteAndeler(values, 1, false);
    expect(andeler.length).to.equal(1);
    expect(andeler[0]).to.equal(andel2);
  });

  it('skal returnere true når man har periodeårsak', () => {
    const values = {};
    values[getFieldNameKey(0)] = [andel1, andel2];
    values[getFieldNameKey(1)] = [{ ...andel1, skalRedigereInntekt: false }, andel2];
    const shouldSubmit = shouldBeSubmitted(true, values, 1);
    expect(shouldSubmit).to.equal(true);
  });

  it('skal returnere true når man ikkje har periodeårsak, men minst ein andel skal redigeres', () => {
    const values = {};
    values[getFieldNameKey(0)] = [andel1, andel2];
    values[getFieldNameKey(1)] = [{ ...andel1, skalRedigereInntekt: false }, andel2];
    const shouldSubmit = shouldBeSubmitted(false, values, 1);
    expect(shouldSubmit).to.equal(true);
  });

  it('skal returnere false når man ikkje har periodeårsak, men ingen andel skal redigeres', () => {
    const values = {};
    values[getFieldNameKey(0)] = [andel1, andel2];
    values[getFieldNameKey(1)] = [{ ...andel1, skalRedigereInntekt: false }, { ...andel2, skalRedigereInntekt: false }];
    const shouldSubmit = shouldBeSubmitted(false, values, 1);
    expect(shouldSubmit).to.equal(false);
  });

  it('skal lage periode for submit', () => {
    const endringBGPerioder = [
      { fom: '2018-01-01', tom: '2018-06-01' },
      { fom: '2018-06-02', tom: null },
    ];
    const values = {};
    values[getFieldNameKey(0)] = [andel1, andel2];
    values[getFieldNameKey(1)] = [{ ...andel1, skalRedigereInntekt: false }, andel2];
    const periode = lagPeriodeForSubmit(values, 1, false, false, endringBGPerioder);
    expect(periode.fom).to.equal('2018-06-02');
    expect(periode.tom).to.equal(null);
    expect(periode.andeler.length).to.equal(1);
    expect(periode.andeler[0].fastsatteVerdier.fastsattBeløp).to.equal(20000);
    expect(periode.andeler[0].fastsatteVerdier.refusjon).to.equal(null);
    expect(periode.andeler[0].fastsatteVerdier.inntektskategori).to.equal('ARBEIDSTAKER');
    expect(periode.andeler[0].lagtTilAvSaksbehandler).to.equal(false);
    expect(periode.andeler[0].nyAndel).to.equal(false);
    expect(periode.andeler[0].andel).to.equal('Sopra Steria AS (2342342348)');
    expect(periode.andeler[0].arbeidsforholdId).to.equal('ri4j3f34rt3144');
  });

  it('skal transforme perioder for submit', () => {
    const endringBGPerioder = [
      { fom: '2018-01-01', tom: '2018-06-01', harPeriodeAarsakGraderingEllerRefusjon: false },
      { fom: '2018-06-02', tom: null, harPeriodeAarsakGraderingEllerRefusjon: true },
    ];
    const values = {};
    values[getFieldNameKey(0)] = [{ ...andel1, skalRedigereInntekt: false }, { ...andel2, skalRedigereInntekt: false }];
    values[getFieldNameKey(1)] = [{ ...andel1, skalRedigereInntekt: false, fastsattBeløp: '10 000' }, andel2];
    const perioder = transformPerioder(endringBGPerioder, values, false);
    expect(perioder.length).to.equal(1);
    expect(perioder[0].fom).to.equal('2018-06-02');
    expect(perioder[0].tom).to.equal(null);
    expect(perioder[0].andeler.length).to.equal(2);

    expect(perioder[0].andeler[0].fastsatteVerdier.fastsattBeløp).to.equal(10000);
    expect(perioder[0].andeler[0].fastsatteVerdier.refusjon).to.equal(null);
    expect(perioder[0].andeler[0].fastsatteVerdier.inntektskategori).to.equal('ARBEIDSTAKER');
    expect(perioder[0].andeler[0].lagtTilAvSaksbehandler).to.equal(false);
    expect(perioder[0].andeler[0].nyAndel).to.equal(false);
    expect(perioder[0].andeler[0].andel).to.equal('Sopra Steria AS (2342342348)');
    expect(perioder[0].andeler[0].arbeidsforholdId).to.equal(null);

    expect(perioder[0].andeler[1].fastsatteVerdier.fastsattBeløp).to.equal(20000);
    expect(perioder[0].andeler[1].fastsatteVerdier.refusjon).to.equal(null);
    expect(perioder[0].andeler[1].fastsatteVerdier.inntektskategori).to.equal('ARBEIDSTAKER');
    expect(perioder[0].andeler[1].lagtTilAvSaksbehandler).to.equal(false);
    expect(perioder[0].andeler[1].nyAndel).to.equal(false);
    expect(perioder[0].andeler[1].andel).to.equal('Sopra Steria AS (2342342348)');
    expect(perioder[0].andeler[1].arbeidsforholdId).to.equal('ri4j3f34rt3144');
  });
});

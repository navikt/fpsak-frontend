import { expect } from 'chai';
import aktivitetStatuser from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import periodeAarsak from '@fpsak-frontend/kodeverk/src/periodeAarsak';
import {
  EndringBeregningsgrunnlagForm, getFieldNameKey,
  mapTilFastsatteVerdier, mapAndel,
  transformPerioder, slaaSammenPerioder,
} from './EndringBeregningsgrunnlagForm';

const getKodeverknavn = () => ({});

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
  it('skal returnere liste med en periode om kun en periode i grunnlag', () => {
    const perioder = [{
      fom: '01-01-2019', tom: null, endringBeregningsgrunnlagAndeler: [{ andelsnr: 1 }], harPeriodeAarsakGraderingEllerRefusjon: true,
    }];
    const bgPerioder = [{
      beregningsgrunnlagPeriodeFom: '01-01-2019', beregningsgrunnlagPeriodeTom: null, periodeAarsaker: [periodeAarsak.ENDRING_I_REFUSJONSKRAV],
    }];
    const nyePerioder = slaaSammenPerioder(perioder, bgPerioder);
    expect(nyePerioder.length).to.equal(1);
    expect(nyePerioder[0].fom).to.equal('01-01-2019');
    expect(nyePerioder[0].tom).to.equal(null);
  });

  it('skal returnere liste med en periode om andre periode har naturalytelse tilkommet', () => {
    const perioder = [{
      fom: '01-01-2019', tom: '01-02-2019', endringBeregningsgrunnlagAndeler: [{ andelsnr: 1 }], harPeriodeAarsakGraderingEllerRefusjon: true,
    },
    {
      fom: '02-02-2019', tom: null, endringBeregningsgrunnlagAndeler: [{ andelsnr: 1 }], harPeriodeAarsakGraderingEllerRefusjon: true,
    }];
    const bgPerioder = [{
      beregningsgrunnlagPeriodeFom: '01-01-2019',
      beregningsgrunnlagPeriodeTom: '01-02-2019',
      periodeAarsaker: [periodeAarsak.ENDRING_I_REFUSJONSKRAV],
    },
    {
      beregningsgrunnlagPeriodeFom: '02-02-2019',
      beregningsgrunnlagPeriodeTom: null,
      periodeAarsaker: [periodeAarsak.NATURALYTELSE_TILKOMMER],
    }];
    const nyePerioder = slaaSammenPerioder(perioder, bgPerioder);
    expect(nyePerioder.length).to.equal(1);
    expect(nyePerioder[0].fom).to.equal('01-01-2019');
    expect(nyePerioder[0].tom).to.equal(null);
  });

  it('skal returnere liste med en periode om andre periode har naturalytelse bortfalt', () => {
    const perioder = [{
      fom: '01-01-2019', tom: '01-02-2019', endringBeregningsgrunnlagAndeler: [{ andelsnr: 1 }], harPeriodeAarsakGraderingEllerRefusjon: true,
    },
    {
      fom: '02-02-2019', tom: null, endringBeregningsgrunnlagAndeler: [{ andelsnr: 1 }], harPeriodeAarsakGraderingEllerRefusjon: true,
    }];
    const bgPerioder = [{
      beregningsgrunnlagPeriodeFom: '01-01-2019',
      beregningsgrunnlagPeriodeTom: '01-02-2019',
      periodeAarsaker: [periodeAarsak.ENDRING_I_REFUSJONSKRAV],
    },
    {
      beregningsgrunnlagPeriodeFom: '02-02-2019',
      beregningsgrunnlagPeriodeTom: null,
      periodeAarsaker: [periodeAarsak.NATURALYTELSE_BORTFALT],
    }];
    const nyePerioder = slaaSammenPerioder(perioder, bgPerioder);
    expect(nyePerioder.length).to.equal(1);
    expect(nyePerioder[0].fom).to.equal('01-01-2019');
    expect(nyePerioder[0].tom).to.equal(null);
  });

  it('skal returnere liste med en periode om andre periode har avsluttet arbeidsforhold uten endring i bruttoPrÅr', () => {
    const perioder = [{
      fom: '01-01-2019', tom: '01-02-2019', endringBeregningsgrunnlagAndeler: [{ andelsnr: 1 }], harPeriodeAarsakGraderingEllerRefusjon: true,
    },
    {
      fom: '02-02-2019', tom: null, endringBeregningsgrunnlagAndeler: [{ andelsnr: 1 }], harPeriodeAarsakGraderingEllerRefusjon: true,
    }];
    const bgPerioder = [{
      beregningsgrunnlagPeriodeFom: '01-01-2019',
      beregningsgrunnlagPeriodeTom: '01-02-2019',
      bruttoPrAar: 120000,
      periodeAarsaker: [periodeAarsak.ENDRING_I_REFUSJONSKRAV],
    },
    {
      beregningsgrunnlagPeriodeFom: '02-02-2019',
      beregningsgrunnlagPeriodeTom: null,
      bruttoPrAar: 120000,
      periodeAarsaker: [periodeAarsak.ARBEIDSFORHOLD_AVSLUTTET],
    }];
    const nyePerioder = slaaSammenPerioder(perioder, bgPerioder);
    expect(nyePerioder.length).to.equal(1);
    expect(nyePerioder[0].fom).to.equal('01-01-2019');
    expect(nyePerioder[0].tom).to.equal(null);
  });

  it('skal returnere liste med to perioder om andre periode har avsluttet arbeidsforhold med endring i bruttoPrÅr', () => {
    const perioder = [{
      fom: '01-01-2019', tom: '01-02-2019', endringBeregningsgrunnlagAndeler: [{ andelsnr: 1 }], harPeriodeAarsakGraderingEllerRefusjon: true,
    },
    {
      fom: '02-02-2019', tom: null, endringBeregningsgrunnlagAndeler: [{ andelsnr: 1 }], harPeriodeAarsakGraderingEllerRefusjon: true,
    }];
    const bgPerioder = [{
      beregningsgrunnlagPeriodeFom: '01-01-2019',
      beregningsgrunnlagPeriodeTom: '01-02-2019',
      bruttoPrAar: 120000,
      periodeAarsaker: [periodeAarsak.ENDRING_I_REFUSJONSKRAV],
    },
    {
      beregningsgrunnlagPeriodeFom: '02-02-2019',
      beregningsgrunnlagPeriodeTom: null,
      bruttoPrAar: 130000,
      periodeAarsaker: [periodeAarsak.ARBEIDSFORHOLD_AVSLUTTET],
    }];
    const nyePerioder = slaaSammenPerioder(perioder, bgPerioder);
    expect(nyePerioder.length).to.equal(2);
    expect(nyePerioder[0].fom).to.equal('01-01-2019');
    expect(nyePerioder[0].tom).to.equal('01-02-2019');
    expect(nyePerioder[1].fom).to.equal('02-02-2019');
    expect(nyePerioder[1].tom).to.equal(null);
  });

  it('skal returnere liste med to perioder om andre periode har opphør av gradering', () => {
    const perioder = [{
      fom: '01-01-2019', tom: '01-02-2019', endringBeregningsgrunnlagAndeler: [{ andelsnr: 1 }], harPeriodeAarsakGraderingEllerRefusjon: true,
    },
    {
      fom: '02-02-2019', tom: null, endringBeregningsgrunnlagAndeler: [{ andelsnr: 1 }], harPeriodeAarsakGraderingEllerRefusjon: false,
    }];
    const bgPerioder = [{
      beregningsgrunnlagPeriodeFom: '01-01-2019',
      beregningsgrunnlagPeriodeTom: '01-02-2019',
      bruttoPrAar: 120000,
      periodeAarsaker: [periodeAarsak.ENDRING_I_REFUSJONSKRAV],
    },
    {
      beregningsgrunnlagPeriodeFom: '02-02-2019',
      beregningsgrunnlagPeriodeTom: null,
      bruttoPrAar: 120000,
      periodeAarsaker: [periodeAarsak.GRADERING_OPPHOERER],
    }];
    const nyePerioder = slaaSammenPerioder(perioder, bgPerioder);
    expect(nyePerioder.length).to.equal(2);
    expect(nyePerioder[0].fom).to.equal('01-01-2019');
    expect(nyePerioder[0].tom).to.equal('01-02-2019');
    expect(nyePerioder[1].fom).to.equal('02-02-2019');
    expect(nyePerioder[1].tom).to.equal(null);
  });

  it('skal returnere liste med to perioder om andre periode har opphør av refusjon', () => {
    const perioder = [{
      fom: '01-01-2019', tom: '01-02-2019', endringBeregningsgrunnlagAndeler: [{ andelsnr: 1 }], harPeriodeAarsakGraderingEllerRefusjon: true,
    },
    {
      fom: '02-02-2019', tom: null, endringBeregningsgrunnlagAndeler: [{ andelsnr: 1 }], harPeriodeAarsakGraderingEllerRefusjon: false,
    }];
    const bgPerioder = [{
      beregningsgrunnlagPeriodeFom: '01-01-2019',
      beregningsgrunnlagPeriodeTom: '01-02-2019',
      bruttoPrAar: 120000,
      periodeAarsaker: [periodeAarsak.ENDRING_I_REFUSJONSKRAV],
    },
    {
      beregningsgrunnlagPeriodeFom: '02-02-2019',
      beregningsgrunnlagPeriodeTom: null,
      bruttoPrAar: 120000,
      periodeAarsaker: [periodeAarsak.REFUSJON_OPPHOERER],
    }];
    const nyePerioder = slaaSammenPerioder(perioder, bgPerioder);
    expect(nyePerioder.length).to.equal(2);
    expect(nyePerioder[0].fom).to.equal('01-01-2019');
    expect(nyePerioder[0].tom).to.equal('01-02-2019');
    expect(nyePerioder[1].fom).to.equal('02-02-2019');
    expect(nyePerioder[1].tom).to.equal(null);
  });

  it('skal returnere liste med to perioder om andre periode har endring i refusjon', () => {
    const perioder = [{
      fom: '01-01-2019', tom: '01-02-2019', endringBeregningsgrunnlagAndeler: [{ andelsnr: 1 }], harPeriodeAarsakGraderingEllerRefusjon: false,
    },
    {
      fom: '02-02-2019', tom: null, endringBeregningsgrunnlagAndeler: [{ andelsnr: 1 }], harPeriodeAarsakGraderingEllerRefusjon: true,
    }];
    const bgPerioder = [{
      beregningsgrunnlagPeriodeFom: '01-01-2019',
      beregningsgrunnlagPeriodeTom: '01-02-2019',
      bruttoPrAar: 120000,
      periodeAarsaker: [],
    },
    {
      beregningsgrunnlagPeriodeFom: '02-02-2019',
      beregningsgrunnlagPeriodeTom: null,
      bruttoPrAar: 120000,
      periodeAarsaker: [periodeAarsak.ENDRING_I_REFUSJONSKRAV],
    }];
    const nyePerioder = slaaSammenPerioder(perioder, bgPerioder);
    expect(nyePerioder.length).to.equal(2);
    expect(nyePerioder[0].fom).to.equal('01-01-2019');
    expect(nyePerioder[0].tom).to.equal('01-02-2019');
    expect(nyePerioder[1].fom).to.equal('02-02-2019');
    expect(nyePerioder[1].tom).to.equal(null);
  });

  it('skal returnere liste med to perioder om andre periode har gradering', () => {
    const perioder = [{
      fom: '01-01-2019', tom: '01-02-2019', endringBeregningsgrunnlagAndeler: [{ andelsnr: 1 }], harPeriodeAarsakGraderingEllerRefusjon: true,
    },
    {
      fom: '02-02-2019', tom: null, endringBeregningsgrunnlagAndeler: [{ andelsnr: 1 }], harPeriodeAarsakGraderingEllerRefusjon: true,
    }];
    const bgPerioder = [{
      beregningsgrunnlagPeriodeFom: '01-01-2019',
      beregningsgrunnlagPeriodeTom: '01-02-2019',
      bruttoPrAar: 120000,
      periodeAarsaker: [],
    },
    {
      beregningsgrunnlagPeriodeFom: '02-02-2019',
      beregningsgrunnlagPeriodeTom: null,
      bruttoPrAar: 120000,
      periodeAarsaker: [{ kode: periodeAarsak.GRADERING }],
    }];
    const nyePerioder = slaaSammenPerioder(perioder, bgPerioder);
    expect(nyePerioder.length).to.equal(2);
    expect(nyePerioder[0].fom).to.equal('01-01-2019');
    expect(nyePerioder[0].tom).to.equal('01-02-2019');
    expect(nyePerioder[1].fom).to.equal('02-02-2019');
    expect(nyePerioder[1].tom).to.equal(null);
  });


  it('skal ikkje validere om det ikkje finnes perioder', () => {
    const values = {};
    const endringBGPerioder = [];
    const beregningsgrunnlag = {};
    const errors = EndringBeregningsgrunnlagForm.validate(values, endringBGPerioder, beregningsgrunnlag, getKodeverknavn);
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
    const errors = EndringBeregningsgrunnlagForm.validate(values, endringBGPerioder, beregningsgrunnlag, getKodeverknavn);
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
    const errors = EndringBeregningsgrunnlagForm.validate(values, endringBGPerioder, beregningsgrunnlag, getKodeverknavn);
    expect(errors[getFieldNameKey(0)]).to.not.be.empty;
    expect(errors[getFieldNameKey(1)]).to.not.be.empty;
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
    const bgPerioder = [{
      beregningsgrunnlagPeriodeFom: '2018-01-01',
      beregningsgrunnlagPeriodeTom: '2018-06-01',
      periodeAarsaker: [],
    },
    {
      beregningsgrunnlagPeriodeFom: '2018-06-02',
      beregningsgrunnlagPeriodeTom: null,
      periodeAarsaker: [{ kode: periodeAarsak.ENDRING_I_REFUSJONSKRAV }],
    }];
    const endringBGPerioder = [
      { fom: '2018-01-01', tom: '2018-06-01', harPeriodeAarsakGraderingEllerRefusjon: false },
      { fom: '2018-06-02', tom: null, harPeriodeAarsakGraderingEllerRefusjon: true },
    ];
    const values = {};
    values[getFieldNameKey(0)] = [{ ...andel1 }, { ...andel2 }];
    values[getFieldNameKey(1)] = [{ ...andel1, fastsattBelop: '10 000' }, andel2];
    const perioder = transformPerioder(endringBGPerioder, values, bgPerioder);
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


  it('skal transforme perioder for submit når perioder er slått sammen', () => {
    const bgPerioder = [{
      beregningsgrunnlagPeriodeFom: '2018-01-01',
      beregningsgrunnlagPeriodeTom: '2018-06-01',
      periodeAarsaker: [{ kode: periodeAarsak.ENDRING_I_REFUSJONSKRAV }],
    },
    {
      beregningsgrunnlagPeriodeFom: '2018-06-02',
      beregningsgrunnlagPeriodeTom: '2018-10-01',
      periodeAarsaker: [{ kode: periodeAarsak.NATURALYTELSE_TILKOMMER }],
    },
    {
      beregningsgrunnlagPeriodeFom: '2018-10-02',
      beregningsgrunnlagPeriodeTom: null,
      periodeAarsaker: [{ kode: periodeAarsak.REFUSJON_OPPHOERER }],
    }];
    const endringBGPerioder = [
      { fom: '2018-01-01', tom: '2018-06-01', harPeriodeAarsakGraderingEllerRefusjon: true },
      { fom: '2018-06-02', tom: '2018-10-01', harPeriodeAarsakGraderingEllerRefusjon: true },
      { fom: '2018-10-02', tom: null, harPeriodeAarsakGraderingEllerRefusjon: false },

    ];
    const values = {};
    values[getFieldNameKey(0)] = [{ ...andel1, fastsattBelop: '10 000' }, andel2];
    values[getFieldNameKey(1)] = [{ ...andel1 }, { ...andel2 }];

    const perioder = transformPerioder(endringBGPerioder, values, bgPerioder);
    expect(perioder.length).to.equal(2);
    expect(perioder[0].fom).to.equal('2018-01-01');
    expect(perioder[0].tom).to.equal('2018-06-01');
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

    expect(perioder[1].fom).to.equal('2018-06-02');
    expect(perioder[1].tom).to.equal('2018-10-01');
    expect(perioder[1].andeler.length).to.equal(2);

    expect(perioder[1].andeler[0].fastsatteVerdier.fastsattÅrsbeløp).to.equal(10000);
    expect(perioder[1].andeler[0].fastsatteVerdier.refusjonPrÅr).to.equal(null);
    expect(perioder[1].andeler[0].fastsatteVerdier.inntektskategori).to.equal('ARBEIDSTAKER');
    expect(perioder[1].andeler[0].lagtTilAvSaksbehandler).to.equal(false);
    expect(perioder[1].andeler[0].nyAndel).to.equal(false);
    expect(perioder[1].andeler[0].andel).to.equal('Sopra Steria AS (2342342348)');
    expect(perioder[1].andeler[0].arbeidsforholdId).to.equal(null);

    expect(perioder[1].andeler[1].fastsatteVerdier.fastsattÅrsbeløp).to.equal(20000);
    expect(perioder[1].andeler[1].fastsatteVerdier.refusjonPrÅr).to.equal(null);
    expect(perioder[1].andeler[1].fastsatteVerdier.inntektskategori).to.equal('ARBEIDSTAKER');
    expect(perioder[1].andeler[1].lagtTilAvSaksbehandler).to.equal(false);
    expect(perioder[1].andeler[1].nyAndel).to.equal(false);
    expect(perioder[1].andeler[1].andel).to.equal('Sopra Steria AS (2342342348)');
    expect(perioder[1].andeler[1].arbeidsforholdId).to.equal('ri4j3f34rt3144');
  });


  it('skal transforme perioder for submit når periode er slått sammen og inkluderer siste periode', () => {
    const bgPerioder = [{
      beregningsgrunnlagPeriodeFom: '2018-01-01',
      beregningsgrunnlagPeriodeTom: '2018-06-01',
      periodeAarsaker: [],
    },
    {
      beregningsgrunnlagPeriodeFom: '2018-06-02',
      beregningsgrunnlagPeriodeTom: '2018-10-01',
      periodeAarsaker: [{ kode: periodeAarsak.ENDRING_I_REFUSJONSKRAV }],
    },
    {
      beregningsgrunnlagPeriodeFom: '2018-10-02',
      beregningsgrunnlagPeriodeTom: null,
      periodeAarsaker: [{ kode: periodeAarsak.NATURALYTELSE_TILKOMMER }],
    }];
    const endringBGPerioder = [
      { fom: '2018-01-01', tom: '2018-06-01', harPeriodeAarsakGraderingEllerRefusjon: false },
      { fom: '2018-06-02', tom: '2018-10-01', harPeriodeAarsakGraderingEllerRefusjon: true },
      { fom: '2018-10-02', tom: null, harPeriodeAarsakGraderingEllerRefusjon: true },

    ];
    const values = {};
    values[getFieldNameKey(0)] = [{ ...andel1 }, { ...andel2 }];
    values[getFieldNameKey(1)] = [{ ...andel1, fastsattBelop: '10 000' }, andel2];

    const perioder = transformPerioder(endringBGPerioder, values, bgPerioder);

    expect(perioder.length).to.equal(2);
    expect(perioder[0].fom).to.equal('2018-06-02');
    expect(perioder[0].tom).to.equal('2018-10-01');
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

    expect(perioder[1].fom).to.equal('2018-10-02');
    expect(perioder[1].tom).to.equal(null);
    expect(perioder[1].andeler.length).to.equal(2);

    expect(perioder[1].andeler[0].fastsatteVerdier.fastsattÅrsbeløp).to.equal(10000);
    expect(perioder[1].andeler[0].fastsatteVerdier.refusjonPrÅr).to.equal(null);
    expect(perioder[1].andeler[0].fastsatteVerdier.inntektskategori).to.equal('ARBEIDSTAKER');
    expect(perioder[1].andeler[0].lagtTilAvSaksbehandler).to.equal(false);
    expect(perioder[1].andeler[0].nyAndel).to.equal(false);
    expect(perioder[1].andeler[0].andel).to.equal('Sopra Steria AS (2342342348)');
    expect(perioder[1].andeler[0].arbeidsforholdId).to.equal(null);

    expect(perioder[1].andeler[1].fastsatteVerdier.fastsattÅrsbeløp).to.equal(20000);
    expect(perioder[1].andeler[1].fastsatteVerdier.refusjonPrÅr).to.equal(null);
    expect(perioder[1].andeler[1].fastsatteVerdier.inntektskategori).to.equal('ARBEIDSTAKER');
    expect(perioder[1].andeler[1].lagtTilAvSaksbehandler).to.equal(false);
    expect(perioder[1].andeler[1].nyAndel).to.equal(false);
    expect(perioder[1].andeler[1].andel).to.equal('Sopra Steria AS (2342342348)');
    expect(perioder[1].andeler[1].arbeidsforholdId).to.equal('ri4j3f34rt3144');
  });


  it('skal transforme perioder for submit når 2 perioder i midten er slått sammen, totalt 4 perioder', () => {
    const bgPerioder = [{
      beregningsgrunnlagPeriodeFom: '2018-01-01',
      beregningsgrunnlagPeriodeTom: '2018-06-01',
      periodeAarsaker: [],
    },
    {
      beregningsgrunnlagPeriodeFom: '2018-06-02',
      beregningsgrunnlagPeriodeTom: '2018-10-01',
      periodeAarsaker: [{ kode: periodeAarsak.ENDRING_I_REFUSJONSKRAV }],
    },
    {
      beregningsgrunnlagPeriodeFom: '2018-10-02',
      beregningsgrunnlagPeriodeTom: '2018-11-01',
      periodeAarsaker: [{ kode: periodeAarsak.NATURALYTELSE_TILKOMMER }],
    },
    {
      beregningsgrunnlagPeriodeFom: '2018-11-02',
      beregningsgrunnlagPeriodeTom: null,
      periodeAarsaker: [{ kode: periodeAarsak.REFUSJON_OPPHOERER }],
    }];
    const endringBGPerioder = [
      { fom: '2018-01-01', tom: '2018-06-01', harPeriodeAarsakGraderingEllerRefusjon: false },
      { fom: '2018-06-02', tom: '2018-10-01', harPeriodeAarsakGraderingEllerRefusjon: true },
      { fom: '2018-10-02', tom: '2018-11-01', harPeriodeAarsakGraderingEllerRefusjon: true },
      { fom: '2018-11-02', tom: null, harPeriodeAarsakGraderingEllerRefusjon: false },
    ];
    const values = {};
    values[getFieldNameKey(0)] = [{ ...andel1 }, { ...andel2 }];
    values[getFieldNameKey(1)] = [{ ...andel1, fastsattBelop: '10 000' }, andel2];

    const perioder = transformPerioder(endringBGPerioder, values, bgPerioder);

    expect(perioder.length).to.equal(2);
    expect(perioder[0].fom).to.equal('2018-06-02');
    expect(perioder[0].tom).to.equal('2018-10-01');
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

    expect(perioder[1].fom).to.equal('2018-10-02');
    expect(perioder[1].tom).to.equal('2018-11-01');
    expect(perioder[1].andeler.length).to.equal(2);

    expect(perioder[1].andeler[0].fastsatteVerdier.fastsattÅrsbeløp).to.equal(10000);
    expect(perioder[1].andeler[0].fastsatteVerdier.refusjonPrÅr).to.equal(null);
    expect(perioder[1].andeler[0].fastsatteVerdier.inntektskategori).to.equal('ARBEIDSTAKER');
    expect(perioder[1].andeler[0].lagtTilAvSaksbehandler).to.equal(false);
    expect(perioder[1].andeler[0].nyAndel).to.equal(false);
    expect(perioder[1].andeler[0].andel).to.equal('Sopra Steria AS (2342342348)');
    expect(perioder[1].andeler[0].arbeidsforholdId).to.equal(null);

    expect(perioder[1].andeler[1].fastsatteVerdier.fastsattÅrsbeløp).to.equal(20000);
    expect(perioder[1].andeler[1].fastsatteVerdier.refusjonPrÅr).to.equal(null);
    expect(perioder[1].andeler[1].fastsatteVerdier.inntektskategori).to.equal('ARBEIDSTAKER');
    expect(perioder[1].andeler[1].lagtTilAvSaksbehandler).to.equal(false);
    expect(perioder[1].andeler[1].nyAndel).to.equal(false);
    expect(perioder[1].andeler[1].andel).to.equal('Sopra Steria AS (2342342348)');
    expect(perioder[1].andeler[1].arbeidsforholdId).to.equal('ri4j3f34rt3144');
  });
});

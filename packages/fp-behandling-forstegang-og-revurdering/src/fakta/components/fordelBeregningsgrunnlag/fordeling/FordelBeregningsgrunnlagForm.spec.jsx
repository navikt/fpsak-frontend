import React from 'react';
import { expect } from 'chai';
import aktivitetStatuser from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import periodeAarsak from '@fpsak-frontend/kodeverk/src/periodeAarsak';
import { shallow } from 'enzyme';
import {
  FordelBeregningsgrunnlagForm,
  getFieldNameKey,
  mapAndel,
  mapTilFastsatteVerdier,
  slaaSammenPerioder,
  transformPerioder,
} from './FordelBeregningsgrunnlagForm';
import FordelBeregningsgrunnlagPeriodePanel from './FordelBeregningsgrunnlagPeriodePanel';

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

const arbeidsforhold1 = {
  arbeidsforholdId: null,
  arbeidsforholdType: { kode: 'ARBEID', kodeverk: 'OPPTJENING_AKTIVITET_TYPE' },
  arbeidsgiverId: '914555825',
  arbeidsgiverNavn: 'ARBEIDSGIVER1 AS',
  belopFraInntektsmeldingPrMnd: 41667,
  opphoersdato: '2019-06-01',
  organisasjonstype: { kode: 'VIRKSOMHET', kodeverk: 'ORGANISASJONSTYPE' },
  refusjonPrAar: 500004,
  startdato: '2016-08-01',
};

const arbeidsforhold2 = {
  arbeidsforholdId: 'd0101e6c-c54a-4db2-ac91-f5b0d86a6d3e',
  arbeidsforholdType: { kode: 'ARBEID', kodeverk: 'OPPTJENING_AKTIVITET_TYPE' },
  arbeidsgiverId: '996607852',
  arbeidsgiverNavn: 'ARBEIDSGIVER2 AS',
  belopFraInntektsmeldingPrMnd: 41667,
  organisasjonstype: { kode: 'VIRKSOMHET', kodeverk: 'ORGANISASJONSTYPE' },
  refusjonPrAar: 500004,
  startdato: '2019-06-02',
};

const fordelAndel = {
  aktivitetStatus: { kode: 'AT', kodeverk: 'AKTIVITET_STATUS' },
  andelIArbeid: [0],
  andelsnr: 1,
  arbeidsforhold: arbeidsforhold1,
  inntektskategori: { kode: 'ARBEIDSTAKER', kodeverk: 'INNTEKTSKATEGORI' },
  nyttArbeidsforhold: false,
};

const fordelAndel2 = {
  aktivitetStatus: { kode: 'AT', kodeverk: 'AKTIVITET_STATUS' },
  andelIArbeid: [0],
  andelsnr: 2,
  arbeidsforhold: arbeidsforhold2,
  inntektskategori: { kode: '-', kodeverk: 'INNTEKTSKATEGORI' },
  nyttArbeidsforhold: true,
};

describe('<FordelBeregningsgrunnlagForm>', () => {
  it('skal vise 2 perioder', () => {
    const bgAndel1 = {
      andelsnr: 1,
      aktivitetStatus: { kode: 'AT', kodeverk: 'AKTIVITET_STATUS' },
      arbeidsforhold: arbeidsforhold1,
      beregnetPrAar: 500004,
      bruttoPrAar: 500004,
      inntektskategori: { kode: 'ARBEIDSTAKER', kodeverk: 'INNTEKTSKATEGORI' },
    };

    const bgAndel2 = {
      aktivitetStatus: { kode: 'AT', kodeverk: 'AKTIVITET_STATUS' },
      andelsnr: 2,
      arbeidsforhold: arbeidsforhold2,
      beregnetPrAar: null,
      bruttoPrAar: null,
      inntektskategori: { kode: '-', kodeverk: 'INNTEKTSKATEGORI' },
    };

    const periode1 = {
      fordelBeregningsgrunnlagAndeler: [fordelAndel],
      fom: '2019-04-01',
      harPeriodeAarsakGraderingEllerRefusjon: false,
      skalKunneEndreRefusjon: false,
      tom: '2019-06-01',
    };
    const periode2 = {
      fordelBeregningsgrunnlagAndeler: [fordelAndel],
      fom: '2019-04-01',
      harPeriodeAarsakGraderingEllerRefusjon: false,
      skalKunneEndreRefusjon: false,
      tom: '2019-06-01',
    };
    const periode3 = {
      fordelBeregningsgrunnlagAndeler: [fordelAndel, fordelAndel2],
      fom: '2019-06-02',
      harPeriodeAarsakGraderingEllerRefusjon: true,
      skalKunneEndreRefusjon: false,
      tom: null,
    };

    const bgPeriode1 = {
      andelerLagtTilManueltIForrige: [],
      beregnetPrAar: 500004,
      beregningsgrunnlagPeriodeFom: '2019-03-30',
      beregningsgrunnlagPeriodeTom: '2019-03-31',
      periodeAarsaker: [],
      beregningsgrunnlagPrStatusOgAndel: [bgAndel1],
    };
    const bgPeriode2 = {
      andelerLagtTilManueltIForrige: [],
      beregnetPrAar: 500004,
      beregningsgrunnlagPeriodeFom: '2019-04-01',
      beregningsgrunnlagPeriodeTom: '2019-06-01',
      periodeAarsaker: [{ kode: 'NATURALYTELSE_BORTFALT', kodeverk: 'PERIODE_AARSAK' }],
      beregningsgrunnlagPrStatusOgAndel: [bgAndel1],
    };
    const bgPeriode3 = {
      andelerLagtTilManueltIForrige: [],
      beregnetPrAar: 500004,
      beregningsgrunnlagPeriodeFom: '2019-06-02',
      beregningsgrunnlagPeriodeTom: null,
      periodeAarsaker: [{ kode: 'ENDRING_I_REFUSJONSKRAV', kodeverk: 'PERIODE_AARSAK' }],
      beregningsgrunnlagPrStatusOgAndel: [bgAndel1, bgAndel2],
    };
    const perioder = [periode1, periode2, periode3];
    const bgPerioder = [bgPeriode1, bgPeriode2, bgPeriode3];

    const wrapper = shallow(<FordelBeregningsgrunnlagForm
      perioder={perioder}
      bgPerioder={bgPerioder}
      isAksjonspunktClosed={false}
      readOnly={false}
    />);

    const periodePanel = wrapper.find(FordelBeregningsgrunnlagPeriodePanel);
    expect(periodePanel.length).to.equal(2);
    const fieldName1 = periodePanel.get(0).props.fordelBGFieldArrayName;
    const fom1 = periodePanel.get(0).props.fom;
    const andeler1 = perioder.find(({ fom }) => fom === fom1).fordelBeregningsgrunnlagAndeler;
    const fieldName2 = periodePanel.get(1).props.fordelBGFieldArrayName;
    const fom2 = periodePanel.get(1).props.fom;
    const andeler2 = perioder.find(({ fom }) => fom === fom2).fordelBeregningsgrunnlagAndeler;

    const bg = {
      aktivitetStatus: [{ kode: 'AT', kodeverk: 'AKTIVITET_STATUS' }],
      beregningsgrunnlagPeriode: [bgPeriode1, bgPeriode2, bgPeriode3],
      skjaeringstidspunktBeregning: '2019-03-30',
    };

    const initialValues = FordelBeregningsgrunnlagForm.buildInitialValues(perioder, bg, getKodeverknavn);
    expect(initialValues[fieldName1].length).to.equal(andeler1.length);
    expect(initialValues[fieldName2].length).to.equal(andeler2.length);


    const values = {};
    values[getFieldNameKey(0)] = initialValues[fieldName1];
    values[getFieldNameKey(1)] = initialValues[fieldName2];
    const errors = FordelBeregningsgrunnlagForm.validate(values, perioder, bg, getKodeverknavn);
    expect(errors[getFieldNameKey(0)]).to.equal(null);
    expect(errors[getFieldNameKey(1)]).to.not.be.empty;
  });


  it('skal returnere liste med en periode om kun en periode i grunnlag', () => {
    const perioder = [{
      fom: '01-01-2019', tom: null, fordelBeregningsgrunnlagAndeler: [fordelAndel], harPeriodeAarsakGraderingEllerRefusjon: true,
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
      fom: '01-01-2019', tom: '01-02-2019', fordelBeregningsgrunnlagAndeler: [fordelAndel], harPeriodeAarsakGraderingEllerRefusjon: true,
    },
    {
      fom: '02-02-2019', tom: null, fordelBeregningsgrunnlagAndeler: [fordelAndel], harPeriodeAarsakGraderingEllerRefusjon: true,
    }];
    const bgPerioder = [{
      beregningsgrunnlagPeriodeFom: '01-01-2019',
      beregningsgrunnlagPeriodeTom: '01-02-2019',
      periodeAarsaker: [{ kode: periodeAarsak.ENDRING_I_REFUSJONSKRAV }],
    },
    {
      beregningsgrunnlagPeriodeFom: '02-02-2019',
      beregningsgrunnlagPeriodeTom: null,
      periodeAarsaker: [{ kode: periodeAarsak.NATURALYTELSE_TILKOMMER }],
    }];
    const nyePerioder = slaaSammenPerioder(perioder, bgPerioder);
    expect(nyePerioder.length).to.equal(1);
    expect(nyePerioder[0].fom).to.equal('01-01-2019');
    expect(nyePerioder[0].tom).to.equal(null);
  });

  it('skal returnere liste med en periode om andre periode har naturalytelse bortfalt', () => {
    const perioder = [{
      fom: '01-01-2019', tom: '01-02-2019', fordelBeregningsgrunnlagAndeler: [fordelAndel], harPeriodeAarsakGraderingEllerRefusjon: true,
    },
    {
      fom: '02-02-2019', tom: null, fordelBeregningsgrunnlagAndeler: [fordelAndel], harPeriodeAarsakGraderingEllerRefusjon: true,
    }];
    const bgPerioder = [{
      beregningsgrunnlagPeriodeFom: '01-01-2019',
      beregningsgrunnlagPeriodeTom: '01-02-2019',
      periodeAarsaker: [{ kode: periodeAarsak.ENDRING_I_REFUSJONSKRAV }],
    },
    {
      beregningsgrunnlagPeriodeFom: '02-02-2019',
      beregningsgrunnlagPeriodeTom: null,
      periodeAarsaker: [{ kode: periodeAarsak.NATURALYTELSE_BORTFALT }],
    }];
    const nyePerioder = slaaSammenPerioder(perioder, bgPerioder);
    expect(nyePerioder.length).to.equal(1);
    expect(nyePerioder[0].fom).to.equal('01-01-2019');
    expect(nyePerioder[0].tom).to.equal(null);
  });

  it('skal returnere liste med en periode om andre periode har avsluttet arbeidsforhold uten endring i bruttoPrÅr', () => {
    const perioder = [{
      fom: '01-01-2019', tom: '01-02-2019', fordelBeregningsgrunnlagAndeler: [fordelAndel], harPeriodeAarsakGraderingEllerRefusjon: true,
    },
    {
      fom: '02-02-2019', tom: null, fordelBeregningsgrunnlagAndeler: [fordelAndel], harPeriodeAarsakGraderingEllerRefusjon: true,
    }];
    const bgPerioder = [{
      beregningsgrunnlagPeriodeFom: '01-01-2019',
      beregningsgrunnlagPeriodeTom: '01-02-2019',
      bruttoPrAar: 120000,
      periodeAarsaker: [{ kode: periodeAarsak.ENDRING_I_REFUSJONSKRAV }],
    },
    {
      beregningsgrunnlagPeriodeFom: '02-02-2019',
      beregningsgrunnlagPeriodeTom: null,
      bruttoPrAar: 120000,
      periodeAarsaker: [{ kode: periodeAarsak.ARBEIDSFORHOLD_AVSLUTTET }],
    }];
    const nyePerioder = slaaSammenPerioder(perioder, bgPerioder);
    expect(nyePerioder.length).to.equal(1);
    expect(nyePerioder[0].fom).to.equal('01-01-2019');
    expect(nyePerioder[0].tom).to.equal(null);
  });

  it('skal returnere liste med to perioder om andre periode har avsluttet arbeidsforhold med endring i bruttoPrÅr', () => {
    const perioder = [{
      fom: '01-01-2019', tom: '01-02-2019', fordelBeregningsgrunnlagAndeler: [fordelAndel], harPeriodeAarsakGraderingEllerRefusjon: true,
    },
    {
      fom: '02-02-2019', tom: null, fordelBeregningsgrunnlagAndeler: [fordelAndel], harPeriodeAarsakGraderingEllerRefusjon: true,
    }];
    const bgPerioder = [{
      beregningsgrunnlagPeriodeFom: '01-01-2019',
      beregningsgrunnlagPeriodeTom: '01-02-2019',
      bruttoPrAar: 120000,
      periodeAarsaker: [{ kode: periodeAarsak.ENDRING_I_REFUSJONSKRAV }],
    },
    {
      beregningsgrunnlagPeriodeFom: '02-02-2019',
      beregningsgrunnlagPeriodeTom: null,
      bruttoPrAar: 130000,
      periodeAarsaker: [{ kode: periodeAarsak.ARBEIDSFORHOLD_AVSLUTTET }],
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
      fom: '01-01-2019', tom: '01-02-2019', fordelBeregningsgrunnlagAndeler: [fordelAndel], harPeriodeAarsakGraderingEllerRefusjon: true,
    },
    {
      fom: '02-02-2019', tom: null, fordelBeregningsgrunnlagAndeler: [fordelAndel], harPeriodeAarsakGraderingEllerRefusjon: false,
    }];
    const bgPerioder = [{
      beregningsgrunnlagPeriodeFom: '01-01-2019',
      beregningsgrunnlagPeriodeTom: '01-02-2019',
      bruttoPrAar: 120000,
      periodeAarsaker: [{ kode: periodeAarsak.ENDRING_I_REFUSJONSKRAV }],
    },
    {
      beregningsgrunnlagPeriodeFom: '02-02-2019',
      beregningsgrunnlagPeriodeTom: null,
      bruttoPrAar: 120000,
      periodeAarsaker: [{ kode: periodeAarsak.GRADERING_OPPHOERER }],
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
      fom: '01-01-2019', tom: '01-02-2019', fordelBeregningsgrunnlagAndeler: [fordelAndel], harPeriodeAarsakGraderingEllerRefusjon: true,
    },
    {
      fom: '02-02-2019', tom: null, fordelBeregningsgrunnlagAndeler: [fordelAndel], harPeriodeAarsakGraderingEllerRefusjon: false,
    }];
    const bgPerioder = [{
      beregningsgrunnlagPeriodeFom: '01-01-2019',
      beregningsgrunnlagPeriodeTom: '01-02-2019',
      bruttoPrAar: 120000,
      periodeAarsaker: [{ kode: periodeAarsak.ENDRING_I_REFUSJONSKRAV }],
    },
    {
      beregningsgrunnlagPeriodeFom: '02-02-2019',
      beregningsgrunnlagPeriodeTom: null,
      bruttoPrAar: 120000,
      periodeAarsaker: [{ kode: periodeAarsak.REFUSJON_OPPHOERER }],
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
      fom: '01-01-2019', tom: '01-02-2019', fordelBeregningsgrunnlagAndeler: [fordelAndel], harPeriodeAarsakGraderingEllerRefusjon: false,
    },
    {
      fom: '02-02-2019', tom: null, fordelBeregningsgrunnlagAndeler: [fordelAndel], harPeriodeAarsakGraderingEllerRefusjon: true,
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
      periodeAarsaker: [{ kode: periodeAarsak.ENDRING_I_REFUSJONSKRAV }],
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
      fom: '01-01-2019', tom: '01-02-2019', fordelBeregningsgrunnlagAndeler: [fordelAndel], harPeriodeAarsakGraderingEllerRefusjon: true,
    },
    {
      fom: '02-02-2019', tom: null, fordelBeregningsgrunnlagAndeler: [fordelAndel], harPeriodeAarsakGraderingEllerRefusjon: true,
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
    const fordelBGPerioder = [];
    const beregningsgrunnlag = {};
    const errors = FordelBeregningsgrunnlagForm.validate(values, fordelBGPerioder, beregningsgrunnlag, getKodeverknavn);
    expect(errors).to.be.empty;
  });

  it('skal validere 1 periode', () => {
    const values = {};
    values[getFieldNameKey(0)] = [andel1, andel2];
    const fordelBGPerioder = [{ fom: '2018-01-01', tom: null }];
    const beregningsgrunnlag = {
      beregningsgrunnlagPeriode: [{
        periodeAarsaker: [],
        beregningsgrunnlagPeriodeFom: '2018-01-01',
        beregningsgrunnlagPrStatusOgAndel: [],
      }],
    };
    const errors = FordelBeregningsgrunnlagForm.validate(values, fordelBGPerioder, beregningsgrunnlag, getKodeverknavn);
    expect(errors[getFieldNameKey(0)]).to.not.be.empty;
  });

  it('skal validere 2 perioder', () => {
    const values = {};
    values[getFieldNameKey(0)] = [andel1, andel2];
    values[getFieldNameKey(1)] = [andel1, andel2];
    const fordelBGPerioder = [{ fom: '2018-01-01', tom: '2018-07-01' }, { fom: '2018-07-02', tom: null }];
    const beregningsgrunnlag = {
      beregningsgrunnlagPeriode: [{
        periodeAarsaker: [],
        beregningsgrunnlagPeriodeFom: '2018-01-01',
        beregningsgrunnlagPrStatusOgAndel: [],
      },
      {
        periodeAarsaker: [{ kode: periodeAarsak.ENDRING_I_REFUSJONSKRAV }],
        beregningsgrunnlagPeriodeFom: '2018-07-02',
        beregningsgrunnlagPrStatusOgAndel: [],
      }],
    };
    const errors = FordelBeregningsgrunnlagForm.validate(values, fordelBGPerioder, beregningsgrunnlag, getKodeverknavn);
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
    const fordelBGPerioder = [
      { fom: '2018-01-01', tom: '2018-06-01', harPeriodeAarsakGraderingEllerRefusjon: false },
      { fom: '2018-06-02', tom: null, harPeriodeAarsakGraderingEllerRefusjon: true },
    ];
    const values = {};
    values[getFieldNameKey(0)] = [{ ...andel1 }, { ...andel2 }];
    values[getFieldNameKey(1)] = [{ ...andel1, fastsattBelop: '10 000' }, andel2];
    const perioder = transformPerioder(fordelBGPerioder, values, bgPerioder);
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
    const fordelBGPerioder = [
      { fom: '2018-01-01', tom: '2018-06-01', harPeriodeAarsakGraderingEllerRefusjon: true },
      { fom: '2018-06-02', tom: '2018-10-01', harPeriodeAarsakGraderingEllerRefusjon: true },
      { fom: '2018-10-02', tom: null, harPeriodeAarsakGraderingEllerRefusjon: false },

    ];
    const values = {};
    values[getFieldNameKey(0)] = [{ ...andel1, fastsattBelop: '10 000' }, andel2];
    values[getFieldNameKey(1)] = [{ ...andel1 }, { ...andel2 }];

    const perioder = transformPerioder(fordelBGPerioder, values, bgPerioder);
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
    const fordelBGPerioder = [
      { fom: '2018-01-01', tom: '2018-06-01', harPeriodeAarsakGraderingEllerRefusjon: false },
      { fom: '2018-06-02', tom: '2018-10-01', harPeriodeAarsakGraderingEllerRefusjon: true },
      { fom: '2018-10-02', tom: null, harPeriodeAarsakGraderingEllerRefusjon: true },

    ];
    const values = {};
    values[getFieldNameKey(0)] = [{ ...andel1 }, { ...andel2 }];
    values[getFieldNameKey(1)] = [{ ...andel1, fastsattBelop: '10 000' }, andel2];

    const perioder = transformPerioder(fordelBGPerioder, values, bgPerioder);

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
    const fordelBGPerioder = [
      { fom: '2018-01-01', tom: '2018-06-01', harPeriodeAarsakGraderingEllerRefusjon: false },
      { fom: '2018-06-02', tom: '2018-10-01', harPeriodeAarsakGraderingEllerRefusjon: true },
      { fom: '2018-10-02', tom: '2018-11-01', harPeriodeAarsakGraderingEllerRefusjon: true },
      { fom: '2018-11-02', tom: null, harPeriodeAarsakGraderingEllerRefusjon: false },
    ];
    const values = {};
    values[getFieldNameKey(0)] = [{ ...andel1 }, { ...andel2 }];
    values[getFieldNameKey(1)] = [{ ...andel1, fastsattBelop: '10 000' }, andel2];

    const perioder = transformPerioder(fordelBGPerioder, values, bgPerioder);

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

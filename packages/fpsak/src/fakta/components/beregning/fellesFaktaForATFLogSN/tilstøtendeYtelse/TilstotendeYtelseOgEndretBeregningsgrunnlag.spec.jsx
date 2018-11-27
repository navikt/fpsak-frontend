import { expect } from 'chai';
import { isRequiredMessage } from 'utils/validation/messages';
import { fordelingAvBruttoBGFieldArrayName } from './FordelingAvBruttoBeregningsgrunnlagPanel';
import TilstotendeYtelseOgEndretBeregningsgrunnlag, {
  getFieldNameKey,
  harPerioderMedAarsakEtterForstePeriode,
} from './TilstotendeYtelseOgEndretBeregningsgrunnlag';
import { skalVereLikFordelingMessage, ulikeAndelerErrorMessage } from '../ValidateAndelerUtils';


describe('<TilstotendeYtelseOgEndretBeregningsgrunnlag>', () => {
  it('skal returnere false om ingen perioder', () => {
    const harPerioderMedAarsakEtterForste = harPerioderMedAarsakEtterForstePeriode([]);
    expect(harPerioderMedAarsakEtterForste).to.equal(false);
  });


  it('skal returnere false om kun 1 periode', () => {
    const endringBGPerioder = [{ fom: '2018-08-01', tom: null, harPeriodeAarsakGraderingEllerRefusjon: true }];
    const harPerioderMedAarsakEtterForste = harPerioderMedAarsakEtterForstePeriode(endringBGPerioder);
    expect(harPerioderMedAarsakEtterForste).to.equal(false);
  });

  it('skal returnere false om ingen årsak etter første periode', () => {
    const endringBGPerioder = [{ fom: '2018-08-01', tom: '2018-09-01', harPeriodeAarsakGraderingEllerRefusjon: true },
      { fom: '2018-09-02', tom: null, harPeriodeAarsakGraderingEllerRefusjon: false }];
    const harPerioderMedAarsakEtterForste = harPerioderMedAarsakEtterForstePeriode(endringBGPerioder);
    expect(harPerioderMedAarsakEtterForste).to.equal(false);
  });


  it('skal returnere true om årsak etter første periode', () => {
    const endringBGPerioder = [{ fom: '2018-08-01', tom: '2018-09-01', harPeriodeAarsakGraderingEllerRefusjon: true },
      { fom: '2018-09-02', tom: null, harPeriodeAarsakGraderingEllerRefusjon: true }];
    const harPerioderMedAarsakEtterForste = harPerioderMedAarsakEtterForstePeriode(endringBGPerioder);
    expect(harPerioderMedAarsakEtterForste).to.equal(true);
  });

  it('skal returnere true om årsak etter første periode, først periode har ikkje årsak', () => {
    const endringBGPerioder = [{ fom: '2018-08-01', tom: '2018-09-01', harPeriodeAarsakGraderingEllerRefusjon: false },
      { fom: '2018-09-02', tom: null, harPeriodeAarsakGraderingEllerRefusjon: true }];
    const harPerioderMedAarsakEtterForste = harPerioderMedAarsakEtterForstePeriode(endringBGPerioder);
    expect(harPerioderMedAarsakEtterForste).to.equal(true);
  });

  it('skal ikkje validere om values er udefinert', () => {
    const errors = TilstotendeYtelseOgEndretBeregningsgrunnlag.validate(undefined, []);
    expect(errors).to.equal(null);
  });

  it('skal ikkje validere om det kun er 1 periode', () => {
    const values = {};
    const endringBGPerioder = [{ fom: '2018-08-01', tom: null, harPeriodeAarsakGraderingEllerRefusjon: false }];
    const errors = TilstotendeYtelseOgEndretBeregningsgrunnlag.validate(values, endringBGPerioder);
    expect(errors).to.equal(null);
  });

  it('skal ikkje validere om det kun er 1 periode', () => {
    const values = {};
    const endringBGPerioder = [{ fom: '2018-08-01', tom: null, harPeriodeAarsakGraderingEllerRefusjon: false }];
    const errors = TilstotendeYtelseOgEndretBeregningsgrunnlag.validate(values, endringBGPerioder);
    expect(errors).to.equal(null);
  });

  it('skal ikkje validere om kun første periode har årsak', () => {
    const values = {};
    const endringBGPerioder = [{ fom: '2018-08-01', tom: '2018-09-01', harPeriodeAarsakGraderingEllerRefusjon: true },
      { fom: '2018-09-02', tom: '2018-10-01', harPeriodeAarsakGraderingEllerRefusjon: false },
      { fom: '2018-10-02', tom: '2018-11-01', harPeriodeAarsakGraderingEllerRefusjon: false },
      { fom: '2018-11-02', tom: null, harPeriodeAarsakGraderingEllerRefusjon: false }];
    const errors = TilstotendeYtelseOgEndretBeregningsgrunnlag.validate(values, endringBGPerioder);
    expect(errors).to.equal(null);
  });


  it('skal ikkje returnere errors når ingen feil', () => {
    const values = {};
    values[fordelingAvBruttoBGFieldArrayName] = [
      { fastsattBeløp: '100 000' },
    ];
    values[getFieldNameKey(0)] = [{
      refusjonskrav: '10 000',
      fastsattBeløp: '100 000',
      belopFraInntektsmelding: 100000,
      skalKunneEndreRefusjon: false,
      aktivitetstatus: 'ARBEIDSTAKER',
      andel: 'Visningsnavn for virksomhet',
      harPeriodeAarsakGraderingEllerRefusjon: true,
      inntektskategori: 'ARBEIDSTAKER',
      refusjonskravFraInntektsmelding: 10000,
    }];
    const endringBGPerioder = [{ fom: '2018-08-01', tom: '2018-10-01', harPeriodeAarsakGraderingEllerRefusjon: false },
      { fom: '2018-10-02', tom: null, harPeriodeAarsakGraderingEllerRefusjon: true }];
    const errors = TilstotendeYtelseOgEndretBeregningsgrunnlag.validate(values, endringBGPerioder);
    expect(errors[getFieldNameKey(0)]).to.equal(null);
  });

  it('skal returnere errors når fastsattBeløp mangler', () => {
    const values = {};
    values[fordelingAvBruttoBGFieldArrayName] = [
      { fastsattBeløp: '100 000' },
    ];
    values[getFieldNameKey(0)] = [{
      refusjonskrav: '10 000',
      fastsattBeløp: '',
      belopFraInntektsmelding: 100000,
      skalKunneEndreRefusjon: false,
      aktivitetstatus: 'ARBEIDSTAKER',
      andel: 'Visningsnavn for virksomhet',
      harPeriodeAarsakGraderingEllerRefusjon: true,
      inntektskategori: 'ARBEIDSTAKER',
      refusjonskravFraInntektsmelding: 10000,
    }];
    const endringBGPerioder = [{ fom: '2018-08-01', tom: '2018-10-01', harPeriodeAarsakGraderingEllerRefusjon: false },
      { fom: '2018-10-02', tom: 'null', harPeriodeAarsakGraderingEllerRefusjon: true }];
    const errors = TilstotendeYtelseOgEndretBeregningsgrunnlag.validate(values, endringBGPerioder);
    expect(errors[getFieldNameKey(0)]).to.have.length(1);
    expect(errors[getFieldNameKey(0)][0].fastsattBeløp).to.have.length(1);
    expect(errors[getFieldNameKey(0)][0].fastsattBeløp[0].id).to.equal(isRequiredMessage()[0].id);
    expect(errors[getFieldNameKey(0)][0].inntektskategori).to.equal(undefined);
  });

  it('skal returnere errors når inntektskategori mangler', () => {
    const values = {};
    values[fordelingAvBruttoBGFieldArrayName] = [
      { fastsattBeløp: '100 000' },
    ];
    values[getFieldNameKey(0)] = [{
      refusjonskrav: '10 000',
      fastsattBeløp: '',
      belopFraInntektsmelding: 100000,
      skalKunneEndreRefusjon: false,
      aktivitetstatus: 'ARBEIDSTAKER',
      andel: 'Visningsnavn for virksomhet',
      harPeriodeAarsakGraderingEllerRefusjon: true,
      inntektskategori: '',
      refusjonskravFraInntektsmelding: 10000,
    }];
    const endringBGPerioder = [{ fom: '2018-08-01', tom: '2018-10-01', harPeriodeAarsakGraderingEllerRefusjon: false },
      { fom: '2018-10-02', tom: 'null', harPeriodeAarsakGraderingEllerRefusjon: true }];
    const errors = TilstotendeYtelseOgEndretBeregningsgrunnlag.validate(values, endringBGPerioder);
    expect(errors[getFieldNameKey(0)]).to.have.length(1);
    expect(errors[getFieldNameKey(0)][0].fastsattBeløp).to.have.length(1);
    expect(errors[getFieldNameKey(0)][0].fastsattBeløp[0].id).to.equal(isRequiredMessage()[0].id);
    expect(errors[getFieldNameKey(0)][0].inntektskategori).to.have.length(1);
    expect(errors[getFieldNameKey(0)][0].inntektskategori[0].id).to.equal(isRequiredMessage()[0].id);
  });

  it('skal ikkje validere på refusjon når den ikkje skal kunne endres', () => {
    const values = {};
    values[fordelingAvBruttoBGFieldArrayName] = [
      { fastsattBeløp: '100 000' },
    ];
    values[getFieldNameKey(0)] = [{
      refusjonskrav: '',
      fastsattBeløp: '',
      belopFraInntektsmelding: 100000,
      skalKunneEndreRefusjon: false,
      aktivitetstatus: 'ARBEIDSTAKER',
      andel: 'Visningsnavn for virksomhet',
      harPeriodeAarsakGraderingEllerRefusjon: true,
      inntektskategori: '',
      refusjonskravFraInntektsmelding: 10000,
    }];
    const endringBGPerioder = [{ fom: '2018-08-01', tom: '2018-10-01', harPeriodeAarsakGraderingEllerRefusjon: false },
      { fom: '2018-10-02', tom: 'null', harPeriodeAarsakGraderingEllerRefusjon: true }];
    const errors = TilstotendeYtelseOgEndretBeregningsgrunnlag.validate(values, endringBGPerioder);
    expect(errors[getFieldNameKey(0)]).to.have.length(1);
    expect(errors[getFieldNameKey(0)][0].refusjonskrav).to.equal(undefined);
  });

  it('skal returnere errors når refusjon mangler', () => {
    const values = {};
    values[fordelingAvBruttoBGFieldArrayName] = [
      { fastsattBeløp: '100 000' },
    ];
    values[getFieldNameKey(0)] = [{
      refusjonskrav: '',
      fastsattBeløp: '',
      belopFraInntektsmelding: 100000,
      skalKunneEndreRefusjon: true,
      aktivitetstatus: 'ARBEIDSTAKER',
      andel: 'Visningsnavn for virksomhet',
      harPeriodeAarsakGraderingEllerRefusjon: true,
      inntektskategori: '',
      refusjonskravFraInntektsmelding: 10000,
    }];
    const endringBGPerioder = [{ fom: '2018-08-01', tom: '2018-10-01', harPeriodeAarsakGraderingEllerRefusjon: false },
      { fom: '2018-10-02', tom: 'null', harPeriodeAarsakGraderingEllerRefusjon: true }];
    const errors = TilstotendeYtelseOgEndretBeregningsgrunnlag.validate(values, endringBGPerioder);
    expect(errors[getFieldNameKey(0)]).to.have.length(1);
    expect(errors[getFieldNameKey(0)][0].refusjonskrav).to.have.length(1);
    expect(errors[getFieldNameKey(0)][0].refusjonskrav[0].id).to.equal(isRequiredMessage()[0].id);
  });

  it('skal returnere errors når andel mangler', () => {
    const values = {};
    values[fordelingAvBruttoBGFieldArrayName] = [
      { fastsattBeløp: '100 000' },
    ];
    values[getFieldNameKey(0)] = [{
      refusjonskrav: '',
      fastsattBeløp: '',
      belopFraInntektsmelding: 100000,
      skalKunneEndreRefusjon: true,
      aktivitetstatus: 'ARBEIDSTAKER',
      andel: '',
      harPeriodeAarsakGraderingEllerRefusjon: true,
      inntektskategori: '',
      refusjonskravFraInntektsmelding: 10000,
    }];
    const endringBGPerioder = [{ fom: '2018-08-01', tom: '2018-10-01', harPeriodeAarsakGraderingEllerRefusjon: false },
      { fom: '2018-10-02', tom: 'null', harPeriodeAarsakGraderingEllerRefusjon: true }];
    const errors = TilstotendeYtelseOgEndretBeregningsgrunnlag.validate(values, endringBGPerioder);
    expect(errors[getFieldNameKey(0)]).to.have.length(1);
    expect(errors[getFieldNameKey(0)][0].andel).to.have.length(1);
    expect(errors[getFieldNameKey(0)][0].andel[0].id).to.equal(isRequiredMessage()[0].id);
  });

  it('skal returnere felt-errors før validering på sum', () => {
    const values = {};
    values[fordelingAvBruttoBGFieldArrayName] = [
      { fastsattBeløp: '100 000' },
    ];
    values[getFieldNameKey(0)] = [{
      refusjonskrav: '',
      fastsattBeløp: '120 000',
      belopFraInntektsmelding: 100000,
      skalKunneEndreRefusjon: true,
      aktivitetstatus: 'ARBEIDSTAKER',
      andel: '',
      harPeriodeAarsakGraderingEllerRefusjon: true,
      inntektskategori: '',
      refusjonskravFraInntektsmelding: 10000,
    }];
    const endringBGPerioder = [{ fom: '2018-08-01', tom: '2018-10-01', harPeriodeAarsakGraderingEllerRefusjon: false },
      { fom: '2018-10-02', tom: 'null', harPeriodeAarsakGraderingEllerRefusjon: true }];
    const errors = TilstotendeYtelseOgEndretBeregningsgrunnlag.validate(values, endringBGPerioder);
    expect(errors[getFieldNameKey(0)]).to.have.length(1);
    expect(errors[getFieldNameKey(0)][0].andel).to.have.length(1);
    expect(errors[getFieldNameKey(0)][0].andel[0].id).to.equal(isRequiredMessage()[0].id);
    /* eslint no-underscore-dangle: ["error", { "allow": ["_error"] }] */
    expect(errors[getFieldNameKey(0)]._error).to.equal(undefined);
  });


  it('skal returnere validering på sum', () => {
    const values = {};
    values[fordelingAvBruttoBGFieldArrayName] = [
      { fastsattBeløp: '90 000' },
    ];
    values[getFieldNameKey(0)] = [{
      refusjonskrav: '10 000',
      fastsattBeløp: '100 000',
      belopFraInntektsmelding: 100000,
      skalKunneEndreRefusjon: true,
      aktivitetstatus: 'ARBEIDSTAKER',
      andel: 'Visningsnavn',
      harPeriodeAarsakGraderingEllerRefusjon: true,
      inntektskategori: 'ARBEIDSTAKER',
      refusjonskravFraInntektsmelding: 10000,
    }];
    const endringBGPerioder = [{ fom: '2018-08-01', tom: '2018-10-01', harPeriodeAarsakGraderingEllerRefusjon: false },
      { fom: '2018-10-02', tom: 'null', harPeriodeAarsakGraderingEllerRefusjon: true }];
    const errors = TilstotendeYtelseOgEndretBeregningsgrunnlag.validate(values, endringBGPerioder);
    /* eslint no-underscore-dangle: ["error", { "allow": ["_error"] }] */
    expect(errors[getFieldNameKey(0)]._error[0].id).to.equal(skalVereLikFordelingMessage()[0].id);
    expect(errors[getFieldNameKey(0)]._error[1].fordeling).to.equal('90 000');
  });

  const getAndel = (andelsnr, andelsinfo, inntektskategori) => ({
    andelsnr,
    refusjonskrav: '10 000',
    fastsattBeløp: '10 000',
    belopFraInntektsmelding: 15000,
    skalKunneEndreRefusjon: true,
    aktivitetstatus: 'ARBEIDSTAKER',
    andel: andelsinfo || `Visningsnavn ${andelsnr}`,
    harPeriodeAarsakGraderingEllerRefusjon: true,
    inntektskategori: inntektskategori || 'ARBEIDSTAKER',
    refusjonskravFraInntektsmelding: 10000,
    nyAndel: !!andelsinfo,
    lagtTilAvSaksbehandler: !!andelsinfo,
  });

  it('skal returnere validering på sum for fleire andeler', () => {
    const values = {};
    values[fordelingAvBruttoBGFieldArrayName] = [
      { andelsnr: 1, fastsattBeløp: '10 000' }, { andelsnr: 2, fastsattBeløp: '10 000' },
      { andelsnr: 3, fastsattBeløp: '10 000' }, { andelsnr: 4, fastsattBeløp: '10 000' },
    ];

    values[getFieldNameKey(0)] = [getAndel(1), getAndel(2), getAndel(3), getAndel(4), getAndel(undefined, '1', 'SJØMANN')];
    const endringBGPerioder = [{ fom: '2018-08-01', tom: '2018-10-01', harPeriodeAarsakGraderingEllerRefusjon: false },
      { fom: '2018-10-02', tom: 'null', harPeriodeAarsakGraderingEllerRefusjon: true }];
    const errors = TilstotendeYtelseOgEndretBeregningsgrunnlag.validate(values, endringBGPerioder);
    /* eslint no-underscore-dangle: ["error", { "allow": ["_error"] }] */
    expect(errors[getFieldNameKey(0)]._error[0].id).to.equal(skalVereLikFordelingMessage()[0].id);
    expect(errors[getFieldNameKey(0)]._error[1].fordeling).to.equal('40 000');
  });

  it('skal ikkje returnere errors når sum er lik sum i første periode for fleire andeler', () => {
    const values = {};
    values[fordelingAvBruttoBGFieldArrayName] = [
      { andelsnr: 1, fastsattBeløp: '10 000' }, { andelsnr: 2, fastsattBeløp: '10 000' },
      { andelsnr: 3, fastsattBeløp: '10 000' }, { andelsnr: 4, fastsattBeløp: '10 000' },
    ];
    values[getFieldNameKey(0)] = [getAndel(1), getAndel(2), getAndel(3), { ...getAndel(4), ...{ fastsattBeløp: '5 000' } },
      { ...getAndel(undefined, '1', 'SJØMANN'), ...{ fastsattBeløp: '5 000' } }];
    const endringBGPerioder = [{ fom: '2018-08-01', tom: '2018-10-01', harPeriodeAarsakGraderingEllerRefusjon: false },
      { fom: '2018-10-02', tom: 'null', harPeriodeAarsakGraderingEllerRefusjon: true }];
    const errors = TilstotendeYtelseOgEndretBeregningsgrunnlag.validate(values, endringBGPerioder);
    expect(errors[getFieldNameKey(0)]).to.equal(null);
  });


  it('skal returnere errors når det finnes 2 andeler for samme virksomhet med samme inntektskategori', () => {
    const values = {};
    values[fordelingAvBruttoBGFieldArrayName] = [
      { andelsnr: 1, fastsattBeløp: '10 000' }, { andelsnr: 2, fastsattBeløp: '10 000' },
      { andelsnr: 3, fastsattBeløp: '10 000' }, { andelsnr: 4, fastsattBeløp: '10 000' },
    ];
    values[getFieldNameKey(0)] = [getAndel(1), getAndel(2), getAndel(3), { ...getAndel(4), ...{ fastsattBeløp: '5 000' } },
      { ...getAndel(undefined, '1', undefined), ...{ fastsattBeløp: '5 000' } }];
    const endringBGPerioder = [{ fom: '2018-08-01', tom: '2018-10-01', harPeriodeAarsakGraderingEllerRefusjon: false },
      { fom: '2018-10-02', tom: 'null', harPeriodeAarsakGraderingEllerRefusjon: true }];
    const errors = TilstotendeYtelseOgEndretBeregningsgrunnlag.validate(values, endringBGPerioder);
    /* eslint no-underscore-dangle: ["error", { "allow": ["_error"] }] */
    expect(errors[getFieldNameKey(0)]._error[0].id).to.equal(ulikeAndelerErrorMessage()[0].id);
  });

  it('skal ikkje bygge initial values når tilstøtende ytelse dto ikkje er definert', () => {
    const initialValues = TilstotendeYtelseOgEndretBeregningsgrunnlag.buildInitialValues(undefined, [], []);
    expect(initialValues).is.empty;
  });

  it('skal ikkje bygge initial values når endring perioder dto ikkje er definert', () => {
    const initialValues = TilstotendeYtelseOgEndretBeregningsgrunnlag.buildInitialValues({ tilstøtendeYtelseAndeler: [] }, undefined, []);
    expect(initialValues).is.empty;
  });

  it('skal ikkje bygge initial values når endring perioder er tom', () => {
    const initialValues = TilstotendeYtelseOgEndretBeregningsgrunnlag.buildInitialValues({ tilstøtendeYtelseAndeler: [] }, [], []);
    expect(initialValues).is.empty;
  });

  const arbeidsforhold = {
    arbeidsgiverNavn: 'Virksomheten',
    arbeidsgiverId: '2312423523',
    arbeidsforholdId: 'esfesi34437u3n4',
    stardato: '2017-01-01',
    opphoersdato: null,
  };
  const tyAndel = {
    arbeidsforhold,
    andelsnr: 1,
    aktivitetStatus: { kode: 'ARBEIDSTAKER' },
    lagtTilAvSaksbehandler: false,
    fordelingForrigeYtelse: 200000,
    fastsattPrAar: null,
    refusjonskrav: null,
    inntektskategori: { kode: 'ARBEIDSTAKER' },
    andelIArbeid: [0],
  };
  const tilstotendeYtelse = {
    tilstøtendeYtelseAndeler: [tyAndel],
  };
  const endretBGAndeler = [{
    arbeidsforhold,
    andelsnr: 1,
    belopFraInntektsmelding: 100000,
    refusjonskravFraInntektsmelding: 100000,
    refusjonskrav: 0,
    inntektskategori: { kode: 'ARBEIDSTAKER' },
    lagtTilAvSaksbehandler: false,
    andelIArbeid: [0],
    aktivitetStatus: { kode: 'ARBEIDSTAKER' },
  }];
  const periode1 = {
    skalKunneEndreRefusjon: true,
    fom: '2018-08-01',
    tom: '2018-10-01',
    harPeriodeAarsakGraderingEllerRefusjon: true,
    endringBeregningsgrunnlagAndeler: endretBGAndeler,
  };
  const periode2 = {
    skalKunneEndreRefusjon: false,
    fom: '2018-10-02',
    tom: null,
    harPeriodeAarsakGraderingEllerRefusjon: false,
    endringBeregningsgrunnlagAndeler: endretBGAndeler,
  };

  it('skal kun bygge initial values for TY når ingen perioder etter første periode har årsaker', () => {
    const endringBGPerioder = [periode1, periode2];
    const initialValues = TilstotendeYtelseOgEndretBeregningsgrunnlag
      .buildInitialValues(tilstotendeYtelse, endringBGPerioder, [{ kode: 'ARBEIDSTAKER', navn: 'Arbeidstaker' }]);
    expect(initialValues[fordelingAvBruttoBGFieldArrayName]).to.have.length(1);
    expect(initialValues[fordelingAvBruttoBGFieldArrayName][0].andelsnr).to.equal(1);
    expect(initialValues[fordelingAvBruttoBGFieldArrayName][0].fordelingForrigeYtelse).to.equal('200 000');
    expect(initialValues[fordelingAvBruttoBGFieldArrayName][0].belopFraInntektsmelding).to.equal(100000 * 12);
    expect(initialValues[fordelingAvBruttoBGFieldArrayName][0].refusjonskravFraInntektsmelding).to.equal(100000 * 12);
    expect(initialValues[fordelingAvBruttoBGFieldArrayName][0].skalKunneEndreRefusjon).to.equal(true);
    expect(initialValues[getFieldNameKey(0)]).to.equal(undefined);
  });

  it('skal kun bygge initial values for TY og endret bg perioder når perioder etter første periode har årsaker', () => {
    periode2.harPeriodeAarsakGraderingEllerRefusjon = true;
    periode2.skalKunneEndreRefusjon = true;
    const endringBGPerioder = [periode1, periode2];
    const initialValues = TilstotendeYtelseOgEndretBeregningsgrunnlag
      .buildInitialValues(tilstotendeYtelse, endringBGPerioder, [{ kode: 'ARBEIDSTAKER', navn: 'Arbeidstaker' }]);
    expect(initialValues[fordelingAvBruttoBGFieldArrayName]).to.have.length(1);
    expect(initialValues[getFieldNameKey(0)]).to.have.length(1);
    expect(initialValues[getFieldNameKey(0)][0].andelsnr).to.equal(1);
    expect(initialValues[getFieldNameKey(0)][0].fordelingForrigeYtelse).to.equal('200 000');
    expect(initialValues[getFieldNameKey(0)][0].belopFraInntektsmelding).to.equal(100000 * 12);
    expect(initialValues[getFieldNameKey(0)][0].refusjonskravFraInntektsmelding).to.equal(100000 * 12);
    expect(initialValues[getFieldNameKey(0)][0].skalKunneEndreRefusjon).to.equal(true);
    expect(initialValues[getFieldNameKey(0)][0].andelIArbeid).to.equal('0.00');
  });

  const lagPeriode = (harPeriodeAarsakGraderingEllerRefusjon, fom, tom) => ({ harPeriodeAarsakGraderingEllerRefusjon, fom, tom });

  it('skal transform values med kun første periode med årsaker', () => {
    const faktor = 1;
    const gjelderBesteberegning = false;
    const values = {};
    values[fordelingAvBruttoBGFieldArrayName] = [{
      andel: 'Espens byggevarer (1231432) ...3243fes434r',
      nyAndel: false,
      andelsnr: 1,
      arbeidsforholdId: '21313243fes434r',
      skalKunneEndreRefusjon: false,
      fastsattBeløp: '100 000',
      inntektskategori: 'ARBEIDSTAKER',
      lagtTilAvSaksbehandler: false,
    }];

    const endringBGPerioder = [lagPeriode(true, '2018-08-01', '2018-09-01'), lagPeriode(false, '2018-09-02', null)];

    const transVal = TilstotendeYtelseOgEndretBeregningsgrunnlag.transformValues(values, faktor, gjelderBesteberegning, endringBGPerioder);
    expect(transVal.tilstotendeYtelseOgEndretBG.perioder).to.have.length(1);
    expect(transVal.tilstotendeYtelseOgEndretBG.perioder[0].fom).to.equal('2018-08-01');
    expect(transVal.tilstotendeYtelseOgEndretBG.perioder[0].andeler).to.have.length(1);
    expect(transVal.tilstotendeYtelseOgEndretBG.perioder[0].andeler[0].andelsnr).to.equal(1);
    expect(transVal.tilstotendeYtelseOgEndretBG.perioder[0].andeler[0].refusjonskravPrAar).to.equal(null);
    expect(transVal.tilstotendeYtelseOgEndretBG.perioder[0].andeler[0].fastsattBeløp).to.equal(100000);
    expect(transVal.tilstotendeYtelseOgEndretBG.perioder[0].andeler[0].inntektskategori).to.equal('ARBEIDSTAKER');
  });


  it('skal transform values med fleire perioder med årsaker', () => {
    const faktor = 1;
    const gjelderBesteberegning = false;
    const values = {};
    values[fordelingAvBruttoBGFieldArrayName] = [{
      andel: 'Espens byggevarer (1231432) ...3243fes434r',
      nyAndel: false,
      andelsnr: 1,
      arbeidsforholdId: '21313243fes434r',
      skalKunneEndreRefusjon: false,
      fastsattBeløp: '100 000',
      inntektskategori: 'ARBEIDSTAKER',
      lagtTilAvSaksbehandler: false,
    }];

    values[getFieldNameKey(0)] = [{
      andel: 'Espens byggevarer (1231432) ...3243fes434r',
      nyAndel: false,
      andelsnr: 1,
      arbeidsforholdId: '21313243fes434r',
      skalKunneEndreRefusjon: true,
      refusjonskrav: '10 000',
      fastsattBeløp: '100 000',
      inntektskategori: 'ARBEIDSTAKER',
      lagtTilAvSaksbehandler: false,
    }];

    const endringBGPerioder = [lagPeriode(true, '2018-08-01', '2018-09-01'), lagPeriode(true, '2018-09-02', null)];

    const transVal = TilstotendeYtelseOgEndretBeregningsgrunnlag.transformValues(values, faktor, gjelderBesteberegning, endringBGPerioder);
    expect(transVal.tilstotendeYtelseOgEndretBG.perioder).to.have.length(2);
    expect(transVal.tilstotendeYtelseOgEndretBG.perioder[0].fom).to.equal('2018-08-01');
    expect(transVal.tilstotendeYtelseOgEndretBG.perioder[0].andeler).to.have.length(1);
    expect(transVal.tilstotendeYtelseOgEndretBG.perioder[0].andeler[0].andelsnr).to.equal(1);
    expect(transVal.tilstotendeYtelseOgEndretBG.perioder[0].andeler[0].refusjonskravPrAar).to.equal(null);
    expect(transVal.tilstotendeYtelseOgEndretBG.perioder[0].andeler[0].fastsattBeløp).to.equal(100000);
    expect(transVal.tilstotendeYtelseOgEndretBG.perioder[0].andeler[0].inntektskategori).to.equal('ARBEIDSTAKER');
    expect(transVal.tilstotendeYtelseOgEndretBG.perioder[1].fom).to.equal('2018-09-02');
    expect(transVal.tilstotendeYtelseOgEndretBG.perioder[1].andeler).to.have.length(1);
    expect(transVal.tilstotendeYtelseOgEndretBG.perioder[1].andeler[0].andelsnr).to.equal(1);
    expect(transVal.tilstotendeYtelseOgEndretBG.perioder[1].andeler[0].refusjonskravPrAar).to.equal(10000);
    expect(transVal.tilstotendeYtelseOgEndretBG.perioder[1].andeler[0].fastsattBeløp).to.equal(100000);
    expect(transVal.tilstotendeYtelseOgEndretBG.perioder[1].andeler[0].inntektskategori).to.equal('ARBEIDSTAKER');
  });
});

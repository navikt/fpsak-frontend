import { expect } from 'chai';
import { isRequiredMessage } from 'utils/validation/messages';
import { skalIkkjeVereHogareEnnInntektmeldingMessage, skalVereLikFordelingMessage } from '../ValidateAndelerUtils';
import RenderEndringBGFieldArray from './RenderEndringBGFieldArray';

describe('<RenderEndringBGFieldArray>', () => {
  it('skal validere eksisterende andeler uten errors', () => {
    const values = [];
    const andel1 = {
      refusjonskrav: '10 000',
      fastsattBeløp: '100 000',
      belopFraInntektsmelding: 100000,
      skalKunneEndreRefusjon: false,
      aktivitetstatus: 'ARBEIDSTAKER',
      andel: 'Visningsnavn for virksomhet',
      harPeriodeAarsakGraderingEllerRefusjon: true,
      inntektskategori: 'ARBEIDSTAKER',
      refusjonskravFraInntektsmelding: 10000,
    };
    values.push(andel1);
    const errors = RenderEndringBGFieldArray.validate(values);
    expect(errors).to.equal(null);
  });


  it('skal returnerer ingen errors for ingen refusjonskrav når skalKunneEndreRefusjon er false', () => {
    const values = [];
    const andel1 = {
      refusjonskrav: '',
      fastsattBeløp: '100 000',
      belopFraInntektsmelding: 100000,
      skalKunneEndreRefusjon: false,
      aktivitetstatus: 'ARBEIDSTAKER',
      andel: 'Visningsnavn for virksomhet',
      harPeriodeAarsakGraderingEllerRefusjon: true,
      inntektskategori: 'ARBEIDSTAKER',
      refusjonskravFraInntektsmelding: 10000,
    };
    values.push(andel1);
    const errors = RenderEndringBGFieldArray.validate(values);
    expect(errors).to.equal(null);
  });

  it('skal returnerer ingen errors for ingen refusjonskrav når skalKunneEndreRefusjon er false', () => {
    const values = [];
    const andel1 = {
      refusjonskrav: '0',
      fastsattBeløp: '100 000',
      belopFraInntektsmelding: 100000,
      skalKunneEndreRefusjon: false,
      aktivitetstatus: 'ARBEIDSTAKER',
      andel: 'Visningsnavn for virksomhet',
      harPeriodeAarsakGraderingEllerRefusjon: true,
      inntektskategori: 'ARBEIDSTAKER',
      refusjonskravFraInntektsmelding: 10000,
    };
    values.push(andel1);
    const errors = RenderEndringBGFieldArray.validate(values);
    expect(errors).to.equal(null);
  });

  it('skal returnerer errors for ingen refusjonskrav når skalKunneEndreRefusjon er true', () => {
    const values = [];
    const andel1 = {
      refusjonskrav: '',
      fastsattBeløp: '100 000',
      belopFraInntektsmelding: 100000,
      skalKunneEndreRefusjon: true,
      aktivitetstatus: 'ARBEIDSTAKER',
      andel: 'Visningsnavn for virksomhet',
      harPeriodeAarsakGraderingEllerRefusjon: true,
      inntektskategori: 'ARBEIDSTAKER',
      refusjonskravFraInntektsmelding: 10000,
    };
    values.push(andel1);
    const errors = RenderEndringBGFieldArray.validate(values);
    expect(errors[0].refusjonskrav).to.have.length(1);
    expect(errors[0].refusjonskrav[0].id).to.equal(isRequiredMessage()[0].id);
  });

  it('skal returnerer errors for ingen refusjonskrav når skalKunneEndreRefusjon er true', () => {
    const values = [];
    const andel1 = {
      refusjonskrav: '',
      fastsattBeløp: '100 000',
      belopFraInntektsmelding: 100000,
      skalKunneEndreRefusjon: true,
      aktivitetstatus: 'ARBEIDSTAKER',
      andel: 'Visningsnavn for virksomhet',
      harPeriodeAarsakGraderingEllerRefusjon: true,
      inntektskategori: 'ARBEIDSTAKER',
      refusjonskravFraInntektsmelding: null,
    };
    values.push(andel1);
    const errors = RenderEndringBGFieldArray.validate(values);
    expect(errors[0].refusjonskrav).to.have.length(1);
    expect(errors[0].refusjonskrav[0].id).to.equal(isRequiredMessage()[0].id);
  });

  it('skal returnerer errors for refusjonskrav når det ikkje er mottatt refusjonskrav i inntektsmelding', () => {
    const values = [];
    const andel1 = {
      refusjonskrav: '10 000',
      fastsattBeløp: '100 000',
      belopFraInntektsmelding: 100000,
      skalKunneEndreRefusjon: true,
      aktivitetstatus: 'ARBEIDSTAKER',
      andel: 'Visningsnavn for virksomhet',
      harPeriodeAarsakGraderingEllerRefusjon: true,
      inntektskategori: 'ARBEIDSTAKER',
      refusjonskravFraInntektsmelding: null,
    };
    values.push(andel1);
    const errors = RenderEndringBGFieldArray.validate(values);
    expect(errors[0].refusjonskrav).to.have.length(1);
    expect(errors[0].refusjonskrav[0].id).to.equal(skalIkkjeVereHogareEnnInntektmeldingMessage()[0].id);
  });

  it('skal returnerer errors for refusjonskrav når refusjonskrav er 0 i inntektsmelding', () => {
    const values = [];
    const andel1 = {
      refusjonskrav: '10 000',
      fastsattBeløp: '100 000',
      belopFraInntektsmelding: 100000,
      skalKunneEndreRefusjon: true,
      aktivitetstatus: 'ARBEIDSTAKER',
      andel: 'Visningsnavn for virksomhet',
      harPeriodeAarsakGraderingEllerRefusjon: true,
      inntektskategori: 'ARBEIDSTAKER',
      refusjonskravFraInntektsmelding: 0,
    };
    values.push(andel1);
    const errors = RenderEndringBGFieldArray.validate(values);
    expect(errors[0].refusjonskrav).to.have.length(1);
    expect(errors[0].refusjonskrav[0].id).to.equal(skalIkkjeVereHogareEnnInntektmeldingMessage()[0].id);
  });

  it('skal returnerer errors for fastsattbeløp når ikkje oppgitt', () => {
    const values = [];
    const andel1 = {
      refusjonskrav: '10 000',
      fastsattBeløp: '',
      belopFraInntektsmelding: 100000,
      skalKunneEndreRefusjon: true,
      aktivitetstatus: 'ARBEIDSTAKER',
      andel: 'Visningsnavn for virksomhet',
      harPeriodeAarsakGraderingEllerRefusjon: true,
      inntektskategori: 'ARBEIDSTAKER',
      refusjonskravFraInntektsmelding: 10000,
    };
    values.push(andel1);
    const errors = RenderEndringBGFieldArray.validate(values);
    expect(errors[0].fastsattBeløp).to.have.length(1);
    expect(errors[0].fastsattBeløp[0].id).to.equal(isRequiredMessage()[0].id);
  });

  it('skal returnerer errors for fastsattbeløp når oppgitt høgare enn beløp frå inntektsmelding', () => {
    const values = [];
    const andel1 = {
      refusjonskrav: '10 000',
      fastsattBeløp: '100 001',
      belopFraInntektsmelding: 100000,
      skalKunneEndreRefusjon: true,
      aktivitetstatus: 'ARBEIDSTAKER',
      andel: 'Visningsnavn for virksomhet',
      harPeriodeAarsakGraderingEllerRefusjon: true,
      inntektskategori: 'ARBEIDSTAKER',
      refusjonskravFraInntektsmelding: 10000,
    };
    values.push(andel1);
    const errors = RenderEndringBGFieldArray.validate(values);
    expect(errors[0].fastsattBeløp).to.have.length(1);
    expect(errors[0].fastsattBeløp[0].id).to.equal(skalIkkjeVereHogareEnnInntektmeldingMessage()[0].id);
  });

  it('skal ikkje returnerer errors for fastsattbeløp når oppgitt og det ikkje er mottatt inntektsmelding', () => {
    const values = [];
    const andel1 = {
      refusjonskrav: '10 000',
      fastsattBeløp: '100 001',
      belopFraInntektsmelding: null,
      skalKunneEndreRefusjon: true,
      aktivitetstatus: 'ARBEIDSTAKER',
      andel: 'Visningsnavn for virksomhet',
      harPeriodeAarsakGraderingEllerRefusjon: true,
      inntektskategori: 'ARBEIDSTAKER',
      refusjonskravFraInntektsmelding: 10000,
    };
    values.push(andel1);
    const errors = RenderEndringBGFieldArray.validate(values);
    expect(errors).to.equal(null);
  });

  it('skal ikkje returnerer errors for fastsattbeløp når oppgitt og det ikkje er mottatt inntektsmelding', () => {
    const values = [];
    const andel1 = {
      refusjonskrav: '10 000',
      fastsattBeløp: '100 001',
      belopFraInntektsmelding: null,
      skalKunneEndreRefusjon: true,
      aktivitetstatus: 'ARBEIDSTAKER',
      andel: 'Visningsnavn for virksomhet',
      harPeriodeAarsakGraderingEllerRefusjon: true,
      inntektskategori: 'ARBEIDSTAKER',
      refusjonskravFraInntektsmelding: 10000,
    };
    values.push(andel1);
    const errors = RenderEndringBGFieldArray.validate(values);
    expect(errors).to.equal(null);
  });

  it('skal gi error om inntektkategori ikkje er oppgitt', () => {
    const values = [];
    const andel1 = {
      refusjonskrav: '10 000',
      fastsattBeløp: '100 000',
      belopFraInntektsmelding: 100000,
      skalKunneEndreRefusjon: true,
      aktivitetstatus: 'ARBEIDSTAKER',
      andel: 'Visningsnavn for virksomhet',
      harPeriodeAarsakGraderingEllerRefusjon: true,
      inntektskategori: '',
      refusjonskravFraInntektsmelding: 10000,
    };
    values.push(andel1);
    const errors = RenderEndringBGFieldArray.validate(values);
    expect(errors[0].inntektskategori).to.have.length(1);
    expect(errors[0].inntektskategori[0].id).to.equal(isRequiredMessage()[0].id);
  });

  it('skal gi error om andel ikkje er valgt for nye andeler', () => {
    const values = [];
    const andel1 = {
      refusjonskrav: '10 000',
      fastsattBeløp: '100 000',
      belopFraInntektsmelding: 100000,
      skalKunneEndreRefusjon: true,
      aktivitetstatus: 'ARBEIDSTAKER',
      andel: '',
      harPeriodeAarsakGraderingEllerRefusjon: true,
      inntektskategori: '',
      refusjonskravFraInntektsmelding: 10000,
      nyAndel: true,
    };
    values.push(andel1);
    const errors = RenderEndringBGFieldArray.validate(values);
    expect(errors[0].andel).to.have.length(1);
    expect(errors[0].andel[0].id).to.equal(isRequiredMessage()[0].id);
  });

  it('skal ikkje gi error for perioder som ikkje krever manuell behandling', () => {
    const values = [];
    const andel1 = {
      refusjonskrav: '10 000',
      fastsattBeløp: '100 000',
      belopFraInntektsmelding: 100000,
      skalKunneEndreRefusjon: true,
      aktivitetstatus: 'ARBEIDSTAKER',
      andel: '',
      harPeriodeAarsakGraderingEllerRefusjon: false,
      inntektskategori: '',
      refusjonskravFraInntektsmelding: 10000,
      nyAndel: true,
    };
    values.push(andel1);
    const errors = RenderEndringBGFieldArray.validate(values);
    expect(errors).to.equal(null);
  });


  it('skal gi error når sum av fastsatt er ulik fordeling forrige behandling', () => {
    const values = [{
      andelsnr: 1,
      lagtTilAvSaksbehandler: false,
      refusjonskrav: '5 000',
      belopFraInntektsmelding: 10000,
      skalKunneEndreRefusjon: true,
      aktivitetstatus: 'ARBEIDSTAKER',
      andel: 'Visningsnavn 1',
      harPeriodeAarsakGraderingEllerRefusjon: true,
      inntektskategori: 'ARBEIDSTAKER',
      refusjonskravFraInntektsmelding: 5000,
      fastsattBeløp: '10 000',
      nyAndel: false,
      fordelingForrigeBehandling: 10000,
    },
    {
      andelsnr: 2,
      fordelingForrigeBehandling: 20000,
      lagtTilAvSaksbehandler: false,
      refusjonskrav: '2 000',
      belopFraInntektsmelding: 150000,
      skalKunneEndreRefusjon: true,
      aktivitetstatus: 'ARBEIDSTAKER',
      andel: 'Visningsnavn 2',
      harPeriodeAarsakGraderingEllerRefusjon: true,
      inntektskategori: 'ARBEIDSTAKER',
      refusjonskravFraInntektsmelding: 20000,
      fastsattBeløp: '20 000',
      nyAndel: false,
    },
    {
      andelsnr: 3,
      fordelingForrigeBehandling: 20000,
      lagtTilAvSaksbehandler: false,
      refusjonskrav: '10 000',
      belopFraInntektsmelding: 20000,
      skalKunneEndreRefusjon: true,
      aktivitetstatus: 'ARBEIDSTAKER',
      andel: 'Visningsnavn 3',
      harPeriodeAarsakGraderingEllerRefusjon: true,
      inntektskategori: 'ARBEIDSTAKER',
      refusjonskravFraInntektsmelding: 10000,
      fastsattBeløp: '20 000',
      nyAndel: false,
    },
    {
      andelsnr: undefined,
      refusjonskrav: '0',
      skalKunneEndreRefusjon: true,
      aktivitetstatus: 'ARBEIDSTAKER',
      andel: '3',
      harPeriodeAarsakGraderingEllerRefusjon: true,
      inntektskategori: 'SJØMANN',
      fastsattBeløp: '10 000',
      nyAndel: true,
      fordelingForrigeBehandling: 0,
      lagtTilAvSaksbehandler: true,
      refusjonskravFraInntektsmelding: 0,
      belopFraInntektsmelding: null,
    }];

    const fordelingForstePeriode = 400000;

    const errors = RenderEndringBGFieldArray.validate(values, fordelingForstePeriode);
    /* eslint no-underscore-dangle: ["error", { "allow": ["_error"] }] */
    expect(errors._error[0].id).to.equal(skalVereLikFordelingMessage()[0].id);
    expect(errors._error[1].fordeling).to.equal('50 000');
  });

  it('skal ikkje gi error når sum av fastsatt er lik fordeling forrige behandling', () => {
    const values = [{
      andelsnr: 1,
      lagtTilAvSaksbehandler: false,
      refusjonskrav: '5 000',
      belopFraInntektsmelding: 10000,
      skalKunneEndreRefusjon: true,
      aktivitetstatus: 'ARBEIDSTAKER',
      andel: 'Visningsnavn 1',
      harPeriodeAarsakGraderingEllerRefusjon: true,
      inntektskategori: 'ARBEIDSTAKER',
      refusjonskravFraInntektsmelding: 5000,
      fastsattBeløp: '5 000',
      nyAndel: false,
      fordelingForrigeBehandling: 10000,
    },
    {
      andelsnr: 2,
      fordelingForrigeBehandling: 20000,
      lagtTilAvSaksbehandler: false,
      refusjonskrav: '2 000',
      belopFraInntektsmelding: 150000,
      skalKunneEndreRefusjon: true,
      aktivitetstatus: 'ARBEIDSTAKER',
      andel: 'Visningsnavn 2',
      harPeriodeAarsakGraderingEllerRefusjon: true,
      inntektskategori: 'ARBEIDSTAKER',
      refusjonskravFraInntektsmelding: 20000,
      fastsattBeløp: '20 000',
      nyAndel: false,
    },
    {
      andelsnr: 3,
      fordelingForrigeBehandling: 20000,
      lagtTilAvSaksbehandler: false,
      refusjonskrav: '10 000',
      belopFraInntektsmelding: 20000,
      skalKunneEndreRefusjon: true,
      aktivitetstatus: 'ARBEIDSTAKER',
      andel: 'Visningsnavn 3',
      harPeriodeAarsakGraderingEllerRefusjon: true,
      inntektskategori: 'ARBEIDSTAKER',
      refusjonskravFraInntektsmelding: 10000,
      fastsattBeløp: '20 000',
      nyAndel: false,
    },
    {
      andelsnr: undefined,
      refusjonskrav: '0',
      skalKunneEndreRefusjon: true,
      aktivitetstatus: 'ARBEIDSTAKER',
      andel: '3',
      harPeriodeAarsakGraderingEllerRefusjon: true,
      inntektskategori: 'SJØMANN',
      fastsattBeløp: '5 000',
      nyAndel: true,
      fordelingForrigeBehandling: 0,
      lagtTilAvSaksbehandler: true,
      refusjonskravFraInntektsmelding: 0,
      belopFraInntektsmelding: null,
    }];

    const fordelingForstePeriode = 400000;
    const errors = RenderEndringBGFieldArray.validate(values, fordelingForstePeriode);
    expect(errors).to.equal(null);
  });
});

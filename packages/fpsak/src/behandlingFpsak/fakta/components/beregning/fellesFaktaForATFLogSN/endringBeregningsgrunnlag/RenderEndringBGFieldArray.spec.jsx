import React from 'react';
import { expect } from 'chai';
import { isRequiredMessage } from '@fpsak-frontend/utils';
import { intlMock, shallowWithIntl } from '@fpsak-frontend/assets/testHelpers//intl-enzyme-test-helper';
import { MockFieldsWithContent } from '@fpsak-frontend/assets/testHelpers//redux-form-test-helper';
import { SelectField } from '@fpsak-frontend/form';
import beregningsgrunnlagAndeltyper from '@fpsak-frontend/kodeverk/src/beregningsgrunnlagAndeltyper';
import {
  skalIkkjeVereHogareEnnInntektmeldingMessage, skalIkkjeVereHoegereEnnRefusjonFraInntektsmelding, skalVereLikFordelingMessage,
} from '../ValidateAndelerUtils';
import RenderEndringBGFieldArray, { RenderEndringBGFieldArrayImpl } from './RenderEndringBGFieldArray';

const inntektskategorier = [
  {
    kode: 'ARBEIDSTAKER',
    navn: 'Arbeidstaker',
  },
  {
    kode: 'SELVSTENDIG_NÆRINGSDRIVENDE',
    navn: 'Selvstendig næringsdrivende',
  },
];

const andel = {
  nyAndel: true,
  fordelingForrigeBehandling: 0,
  fastsattBeløp: '0',
  lagtTilAvSaksbehandler: true,
  refusjonskravFraInntektsmelding: 0,
  belopFraInntektsmelding: null,
  harPeriodeAarsakGraderingEllerRefusjon: true,
};
const fields = new MockFieldsWithContent('endringPeriode0', [andel]);
const arbeidstakerNavn = 'Hansens bil og brems AS';
const siste4SifferIArbeidsforholdId = '4352';
const arbeidstakerAndelsnr = 1;
const arbeidsgiverId = '12338';
const arbeidsforholdList = [
  {
    arbeidsgiverNavn: arbeidstakerNavn,
    arbeidsgiverId,
    startDato: '2016-01-01',
    opphoersdato: '2018-04-01',
    arbeidsforholdId: `12142${siste4SifferIArbeidsforholdId}`,
    andelsnr: arbeidstakerAndelsnr,
  },
];

describe('<RenderEndringBGFieldArray>', () => {
  it('skal ha selectvalues med Ytelse når kun ytelse', () => {
    const forventetArbeidstakerString = `${arbeidstakerNavn} (${arbeidsgiverId}) ...${siste4SifferIArbeidsforholdId}`;
    const wrapper = shallowWithIntl(<RenderEndringBGFieldArrayImpl
      fields={fields}
      intl={intlMock}
      meta={{}}
      inntektskategoriKoder={inntektskategorier}
      arbeidsforholdList={arbeidsforholdList}
      readOnly={false}
      isAksjonspunktClosed={false}
      periodeUtenAarsak={false}
      harKunYtelse
    />);

    const selectFields = wrapper.find(SelectField);
    expect(selectFields).has.length(2);
    const selectValuesArbeidsforhold = selectFields.first().prop('selectValues');
    expect(selectValuesArbeidsforhold).has.length(2);
    expect(selectValuesArbeidsforhold[0].props.value).to.equal(arbeidstakerAndelsnr.toString());
    expect(selectValuesArbeidsforhold[0].props.children).to.equal(forventetArbeidstakerString);
    expect(selectValuesArbeidsforhold[1].props.value).to.equal(beregningsgrunnlagAndeltyper.BRUKERS_ANDEL);
    expect(selectValuesArbeidsforhold[1].props.children).to.equal('Ytelse');
  });

  it('skal ikkje selectvalues med Ytelse når ikkje kun ytelse', () => {
    const forventetArbeidstakerString = `${arbeidstakerNavn} (${arbeidsgiverId}) ...${siste4SifferIArbeidsforholdId}`;
    const wrapper = shallowWithIntl(<RenderEndringBGFieldArrayImpl
      fields={fields}
      intl={intlMock}
      meta={{}}
      inntektskategoriKoder={inntektskategorier}
      arbeidsforholdList={arbeidsforholdList}
      readOnly={false}
      isAksjonspunktClosed={false}
      harKunYtelse={false}
      periodeUtenAarsak={false}
    />);

    const selectFields = wrapper.find(SelectField);
    expect(selectFields).has.length(2);
    const selectValuesArbeidsforhold = selectFields.first().prop('selectValues');
    expect(selectValuesArbeidsforhold).has.length(1);
    expect(selectValuesArbeidsforhold[0].props.value).to.equal(arbeidstakerAndelsnr.toString());
    expect(selectValuesArbeidsforhold[0].props.children).to.equal(forventetArbeidstakerString);
  });

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

  const arbeidsgiverInfo = {
    arbeidsgiverNavn: 'Test',
    arbeidsgiverId: '14235235235',
    arbeidsforholdId: '82389r32fe9343tr',
  };

  const arbeidsgiverstring = 'Test (14235235235) ...43tr';


  it('skal returnerer errors for refusjonskrav når det ikkje er mottatt refusjonskrav i inntektsmelding', () => {
    const values = [];
    const andel1 = {
      ...arbeidsgiverInfo,
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
    const expected = skalIkkjeVereHoegereEnnRefusjonFraInntektsmelding(arbeidsgiverstring);
    /* eslint no-underscore-dangle: ["error", { "allow": ["_error"] }] */
    expect(errors._error[0].id).to.equal(expected[0].id);
    expect(errors._error[1].arbeidsgiver).to.equal(arbeidsgiverstring);
  });

  it('skal returnerer errors for refusjonskrav når refusjonskrav er 0 i inntektsmelding', () => {
    const values = [];
    const andel1 = {
      ...arbeidsgiverInfo,
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
    const expected = skalIkkjeVereHoegereEnnRefusjonFraInntektsmelding(arbeidsgiverstring);
    /* eslint no-underscore-dangle: ["error", { "allow": ["_error"] }] */
    expect(errors._error[0].id).to.equal(expected[0].id);
    expect(errors._error[1].arbeidsgiver).to.equal(arbeidsgiverstring);
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

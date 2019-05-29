import React from 'react';
import { expect } from 'chai';
import { isRequiredMessage } from '@fpsak-frontend/utils';
import { intlMock, shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { MockFieldsWithContent } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import { SelectField } from '@fpsak-frontend/form';
import { TableRow } from '@fpsak-frontend/shared-components';
import { Element } from 'nav-frontend-typografi';
import beregningsgrunnlagAndeltyper from '@fpsak-frontend/kodeverk/src/beregningsgrunnlagAndeltyper';
import { skalIkkjeVereHoegereEnnRefusjonFraInntektsmelding } from '../ValidateAndelerUtils';
import RenderEndringBGFieldArray, { RenderEndringBGFieldArrayImpl, lagBelopKolonne } from './RenderEndringBGFieldArray';

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

const getKodeverknavn = () => undefined;

const skalValidereMotBeregningsgrunnlagPrAar = () => true;

const skjaeringstidspunktBeregning = '2018-01-01';

const andel = {
  nyAndel: true,
  fordelingForrigeBehandling: 0,
  fastsattBelop: '0',
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
      erRevurdering={false}
      skjaeringstidspunktBeregning={skjaeringstidspunktBeregning}
      getKodeverknavn={getKodeverknavn}
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
      erRevurdering={false}
      skjaeringstidspunktBeregning={skjaeringstidspunktBeregning}
      getKodeverknavn={getKodeverknavn}
    />);

    const selectFields = wrapper.find(SelectField);
    expect(selectFields).has.length(2);
    const selectValuesArbeidsforhold = selectFields.first().prop('selectValues');
    expect(selectValuesArbeidsforhold).has.length(1);
    expect(selectValuesArbeidsforhold[0].props.value).to.equal(arbeidstakerAndelsnr.toString());
    expect(selectValuesArbeidsforhold[0].props.children).to.equal(forventetArbeidstakerString);
  });


  it('skal ikkje vise rapportert inntekt om minst en andel som tilkommer før stp ikkje har register opplysning tilgjengelig', () => {
    const andelMedRapportertInntekt = {
      nyAndel: false,
      fordelingForrigeBehandling: 0,
      fastsattBelop: '0',
      lagtTilAvSaksbehandler: true,
      refusjonskravFraInntektsmelding: 0,
      belopFraInntektsmelding: null,
      harPeriodeAarsakGraderingEllerRefusjon: true,
      registerInntekt: '10 000',
      arbeidsperiodeFom: '2016-01-01',
    };
    const andelUtenRapportertInntekt = {
      nyAndel: false,
      fordelingForrigeBehandling: 0,
      fastsattBelop: '0',
      lagtTilAvSaksbehandler: true,
      refusjonskravFraInntektsmelding: 0,
      belopFraInntektsmelding: null,
      harPeriodeAarsakGraderingEllerRefusjon: true,
      registerInntekt: '',
      arbeidsperiodeFom: '2016-01-01',
    };
    const fields2 = new MockFieldsWithContent('endringPeriode1', [andelMedRapportertInntekt, andelUtenRapportertInntekt]);
    const wrapper = shallowWithIntl(<RenderEndringBGFieldArrayImpl
      fields={fields2}
      intl={intlMock}
      meta={{}}
      inntektskategoriKoder={inntektskategorier}
      arbeidsforholdList={arbeidsforholdList}
      readOnly={false}
      isAksjonspunktClosed={false}
      harKunYtelse={false}
      periodeUtenAarsak={false}
      erRevurdering={false}
      skjaeringstidspunktBeregning={skjaeringstidspunktBeregning}
      getKodeverknavn={getKodeverknavn}
    />);

    const rows = wrapper.find(TableRow);
    const elements = rows.find(Element);
    expect(elements.first().props().children).to.equal('');
  });


  it('skal vise beregningsgrunnlagPrAar', () => {
    const andelMedRapportertInntekt = {
      nyAndel: false,
      fordelingForrigeBehandling: 0,
      fastsattBelop: '0',
      lagtTilAvSaksbehandler: true,
      refusjonskravFraInntektsmelding: 0,
      belopFraInntektsmelding: null,
      harPeriodeAarsakGraderingEllerRefusjon: true,
      beregningsgrunnlagPrAar: '10 000',
      arbeidsperiodeFom: '2016-01-01',
    };
    const andelMedRapportertInntekt2 = {
      nyAndel: false,
      fordelingForrigeBehandling: 0,
      fastsattBelop: '0',
      lagtTilAvSaksbehandler: true,
      refusjonskravFraInntektsmelding: 0,
      belopFraInntektsmelding: null,
      harPeriodeAarsakGraderingEllerRefusjon: true,
      beregningsgrunnlagPrAar: '20 000',
      arbeidsperiodeFom: '2016-01-01',
    };
    const fields2 = new MockFieldsWithContent('endringPeriode1', [andelMedRapportertInntekt, andelMedRapportertInntekt2]);
    const wrapper = shallowWithIntl(<RenderEndringBGFieldArrayImpl
      fields={fields2}
      intl={intlMock}
      meta={{}}
      inntektskategoriKoder={inntektskategorier}
      arbeidsforholdList={arbeidsforholdList}
      readOnly={false}
      isAksjonspunktClosed={false}
      harKunYtelse={false}
      periodeUtenAarsak={false}
      erRevurdering={false}
      skjaeringstidspunktBeregning={skjaeringstidspunktBeregning}
      getKodeverknavn={getKodeverknavn}
    />);

    const rows = wrapper.find(TableRow);
    const elements = rows.find(Element);
    expect(elements.first().props().children).to.equal('30 000');
  });

  it('skal vise sum av beregningsgrunnlagPrAar', () => {
    const andelMedBeregningsgrunnlagPrAar = {
      nyAndel: false,
      fordelingForrigeBehandling: 0,
      fastsattBelop: '0',
      lagtTilAvSaksbehandler: true,
      refusjonskravFraInntektsmelding: 0,
      belopFraInntektsmelding: null,
      harPeriodeAarsakGraderingEllerRefusjon: true,
      beregningsgrunnlagPrAar: '10 000',
      arbeidsperiodeFom: '2016-01-01',
    };
    const andelMedBeregningsgrunnlagPrAar2 = {
      nyAndel: false,
      fordelingForrigeBehandling: 0,
      fastsattBelop: '0',
      lagtTilAvSaksbehandler: true,
      refusjonskravFraInntektsmelding: 0,
      belopFraInntektsmelding: null,
      harPeriodeAarsakGraderingEllerRefusjon: true,
      beregningsgrunnlagPrAar: '20 000',
      arbeidsperiodeFom: '2016-01-01',
    };

    const andelUtenBeregningsgrunnlagPrAar = {
      nyAndel: true,
      fordelingForrigeBehandling: 0,
      fastsattBelop: '0',
      lagtTilAvSaksbehandler: true,
      refusjonskravFraInntektsmelding: 0,
      belopFraInntektsmelding: null,
      harPeriodeAarsakGraderingEllerRefusjon: true,
      beregningsgrunnlagPrAar: '',
      arbeidsperiodeFom: '2016-01-01',
    };

    const fields2 = new MockFieldsWithContent('endringPeriode1', [andelMedBeregningsgrunnlagPrAar,
      andelMedBeregningsgrunnlagPrAar2, andelUtenBeregningsgrunnlagPrAar]);
    const wrapper = shallowWithIntl(<RenderEndringBGFieldArrayImpl
      fields={fields2}
      intl={intlMock}
      meta={{}}
      inntektskategoriKoder={inntektskategorier}
      arbeidsforholdList={arbeidsforholdList}
      readOnly={false}
      isAksjonspunktClosed={false}
      harKunYtelse={false}
      periodeUtenAarsak={false}
      erRevurdering={false}
      skjaeringstidspunktBeregning={skjaeringstidspunktBeregning}
      getKodeverknavn={getKodeverknavn}
    />);

    const rows = wrapper.find(TableRow);
    const elements = rows.find(Element);
    expect(elements.first().props().children).to.equal('30 000');
  });


  it('skal validere eksisterende andeler uten errors', () => {
    const values = [];
    const andel1 = {
      refusjonskrav: '10 000',
      fastsattBelop: '100 000',
      belopFraInntektsmelding: 100000,
      skalKunneEndreRefusjon: false,
      aktivitetstatus: 'ARBEIDSTAKER',
      andel: 'Visningsnavn for virksomhet',
      harPeriodeAarsakGraderingEllerRefusjon: true,
      inntektskategori: 'ARBEIDSTAKER',
      refusjonskravFraInntektsmelding: 10000,
    };
    values.push(andel1);
    const errors = RenderEndringBGFieldArray.validate(values, 100000,
      skalValidereMotBeregningsgrunnlagPrAar, getKodeverknavn);
    expect(errors).to.equal(null);
  });


  it('skal returnerer ingen errors for ingen refusjonskrav når skalKunneEndreRefusjon er false', () => {
    const values = [];
    const andel1 = {
      refusjonskrav: '',
      fastsattBelop: '100 000',
      belopFraInntektsmelding: 100000,
      skalKunneEndreRefusjon: false,
      aktivitetstatus: 'ARBEIDSTAKER',
      andel: 'Visningsnavn for virksomhet',
      harPeriodeAarsakGraderingEllerRefusjon: true,
      inntektskategori: 'ARBEIDSTAKER',
      refusjonskravFraInntektsmelding: 10000,
    };
    values.push(andel1);
    const errors = RenderEndringBGFieldArray.validate(values, 100000,
      skalValidereMotBeregningsgrunnlagPrAar, getKodeverknavn);
    expect(errors).to.equal(null);
  });

  it('skal returnerer ingen errors for ingen refusjonskrav når skalKunneEndreRefusjon er false', () => {
    const values = [];
    const andel1 = {
      refusjonskrav: '0',
      fastsattBelop: '100 000',
      belopFraInntektsmelding: 100000,
      skalKunneEndreRefusjon: false,
      aktivitetstatus: 'ARBEIDSTAKER',
      andel: 'Visningsnavn for virksomhet',
      harPeriodeAarsakGraderingEllerRefusjon: true,
      inntektskategori: 'ARBEIDSTAKER',
      refusjonskravFraInntektsmelding: 10000,
    };
    values.push(andel1);
    const errors = RenderEndringBGFieldArray.validate(values, 100000,
      skalValidereMotBeregningsgrunnlagPrAar, getKodeverknavn);
    expect(errors).to.equal(null);
  });

  it('skal returnerer errors for ingen refusjonskrav når skalKunneEndreRefusjon er true', () => {
    const values = [];
    const andel1 = {
      refusjonskrav: '',
      fastsattBelop: '100 000',
      belopFraInntektsmelding: 100000,
      skalKunneEndreRefusjon: true,
      aktivitetstatus: 'ARBEIDSTAKER',
      andel: 'Visningsnavn for virksomhet',
      harPeriodeAarsakGraderingEllerRefusjon: true,
      inntektskategori: 'ARBEIDSTAKER',
      refusjonskravFraInntektsmelding: 10000,
    };
    values.push(andel1);
    const errors = RenderEndringBGFieldArray.validate(values, 100000,
      skalValidereMotBeregningsgrunnlagPrAar, getKodeverknavn);
    expect(errors[0].refusjonskrav).to.have.length(1);
    expect(errors[0].refusjonskrav[0].id).to.equal(isRequiredMessage()[0].id);
  });

  it('skal returnerer errors for ingen refusjonskrav når skalKunneEndreRefusjon er true', () => {
    const values = [];
    const andel1 = {
      refusjonskrav: '',
      fastsattBelop: '100 000',
      belopFraInntektsmelding: 100000,
      skalKunneEndreRefusjon: true,
      aktivitetstatus: 'ARBEIDSTAKER',
      andel: 'Visningsnavn for virksomhet',
      harPeriodeAarsakGraderingEllerRefusjon: true,
      inntektskategori: 'ARBEIDSTAKER',
      refusjonskravFraInntektsmelding: null,
    };
    values.push(andel1);
    const errors = RenderEndringBGFieldArray.validate(values, 100000,
      skalValidereMotBeregningsgrunnlagPrAar, getKodeverknavn);
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
      fastsattBelop: '100 000',
      belopFraInntektsmelding: 100000,
      skalKunneEndreRefusjon: true,
      aktivitetstatus: 'ARBEIDSTAKER',
      andel: 'Visningsnavn for virksomhet',
      harPeriodeAarsakGraderingEllerRefusjon: true,
      inntektskategori: 'ARBEIDSTAKER',
      refusjonskravFraInntektsmelding: null,
    };
    values.push(andel1);
    const errors = RenderEndringBGFieldArray.validate(values, 100000,
      skalValidereMotBeregningsgrunnlagPrAar, getKodeverknavn);
    const expected = skalIkkjeVereHoegereEnnRefusjonFraInntektsmelding(arbeidsgiverstring);
    /* eslint no-underscore-dangle: ["error", { "allow": ["_error"] }] */
    expect(errors._error.props.id).to.equal(expected[0].id);
    expect(errors._error.props.values.arbeidsgiver).to.equal(arbeidsgiverstring);
  });

  it('skal returnerer errors for refusjonskrav når refusjonskrav er 0 i inntektsmelding', () => {
    const values = [];
    const andel1 = {
      ...arbeidsgiverInfo,
      refusjonskrav: '10 000',
      fastsattBelop: '100 000',
      belopFraInntektsmelding: 100000,
      skalKunneEndreRefusjon: true,
      aktivitetstatus: 'ARBEIDSTAKER',
      andel: 'Visningsnavn for virksomhet',
      harPeriodeAarsakGraderingEllerRefusjon: true,
      inntektskategori: 'ARBEIDSTAKER',
      refusjonskravFraInntektsmelding: 0,
    };
    values.push(andel1);
    const errors = RenderEndringBGFieldArray.validate(values, 100000,
      skalValidereMotBeregningsgrunnlagPrAar, getKodeverknavn);
    const expected = skalIkkjeVereHoegereEnnRefusjonFraInntektsmelding(arbeidsgiverstring);
    /* eslint no-underscore-dangle: ["error", { "allow": ["_error"] }] */
    expect(errors._error.props.id).to.equal(expected[0].id);
    expect(errors._error.props.values.arbeidsgiver).to.equal(arbeidsgiverstring);
  });

  it('skal returnerer errors for fastsattbeløp når ikkje oppgitt', () => {
    const values = [];
    const andel1 = {
      refusjonskrav: '10 000',
      fastsattBelop: '',
      belopFraInntektsmelding: 100000,
      skalKunneEndreRefusjon: true,
      aktivitetstatus: 'ARBEIDSTAKER',
      andel: 'Visningsnavn for virksomhet',
      harPeriodeAarsakGraderingEllerRefusjon: true,
      inntektskategori: 'ARBEIDSTAKER',
      refusjonskravFraInntektsmelding: 10000,
      nyttArbeidsforhold: false,
    };
    values.push(andel1);
    const errors = RenderEndringBGFieldArray.validate(values, 100000,
      skalValidereMotBeregningsgrunnlagPrAar, getKodeverknavn);
    expect(errors[0].fastsattBelop).to.have.length(1);
    expect(errors[0].fastsattBelop[0].id).to.equal(isRequiredMessage()[0].id);
  });

  it('skal gi error om inntektkategori ikkje er oppgitt', () => {
    const values = [];
    const andel1 = {
      refusjonskrav: '10 000',
      fastsattBelop: '100 000',
      belopFraInntektsmelding: 100000,
      skalKunneEndreRefusjon: true,
      aktivitetstatus: 'ARBEIDSTAKER',
      andel: 'Visningsnavn for virksomhet',
      harPeriodeAarsakGraderingEllerRefusjon: true,
      inntektskategori: '',
      refusjonskravFraInntektsmelding: 10000,
    };
    values.push(andel1);
    const errors = RenderEndringBGFieldArray.validate(values, 100000,
      skalValidereMotBeregningsgrunnlagPrAar, getKodeverknavn);
    expect(errors[0].inntektskategori).to.have.length(1);
    expect(errors[0].inntektskategori[0].id).to.equal(isRequiredMessage()[0].id);
  });

  it('skal gi error om andel ikkje er valgt for nye andeler', () => {
    const values = [];
    const andel1 = {
      refusjonskrav: '10 000',
      fastsattBelop: '100 000',
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
    const errors = RenderEndringBGFieldArray.validate(values, 100000,
      skalValidereMotBeregningsgrunnlagPrAar, getKodeverknavn);
    expect(errors[0].andel).to.have.length(1);
    expect(errors[0].andel[0].id).to.equal(isRequiredMessage()[0].id);
  });

  it('skal ikkje gi error for perioder som ikkje krever manuell behandling', () => {
    const values = [];
    const andel1 = {
      refusjonskrav: '10 000',
      fastsattBelop: '100 000',
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
    const errors = RenderEndringBGFieldArray.validate(values, 100000,
    skalValidereMotBeregningsgrunnlagPrAar, getKodeverknavn);
    expect(errors).to.equal(null);
  });

  it('lagBelopKolonne skal gi readOnly beløp om andel ikke skal redigere inntekt og det er ikkje er readOnly', () => {
    const belopKolonne = lagBelopKolonne('test', false, true, false);
    expect(belopKolonne.props.className).to.equal(undefined);
    expect(belopKolonne.props.children.props.name).to.equal('test.readOnlyBelop');
    expect(belopKolonne.props.children.props.isEdited).to.equal(false);
  });

  it('lagBelopKolonne skal ikkje gi readOnly beløp om andel ikke skal redigere inntekt og det er readOnly', () => {
    const belopKolonne = lagBelopKolonne('test', true, true, false);
    expect(belopKolonne.props.className).to.equal(undefined);
    expect(belopKolonne.props.children.props.name).to.equal('test.fastsattBelop');
    expect(belopKolonne.props.children.props.isEdited).to.equal(false);
    expect(belopKolonne.props.children.props.readOnly).to.equal(true);
  });


  it('lagBelopKolonne skal ikkje gi readOnly beløp om andel skal redigere inntekt i uten readOnly', () => {
    const belopKolonne = lagBelopKolonne('test', false, false, false);
    expect(belopKolonne.props.className).to.equal(undefined);
    expect(belopKolonne.props.children.props.name).to.equal('test.fastsattBelop');
    expect(belopKolonne.props.children.props.isEdited).to.equal(false);
    expect(belopKolonne.props.children.props.readOnly).to.equal(false);
  });

  it('lagBelopKolonne skal gi fastsattBeløp med isEdited true om andel skal redigere inntekt i readOnly med aksjonspunkt lukket', () => {
    const belopKolonne = lagBelopKolonne('test', true, false, true);
    expect(belopKolonne.props.className).to.equal(undefined);
    expect(belopKolonne.props.children.props.name).to.equal('test.fastsattBelop');
    expect(belopKolonne.props.children.props.isEdited).to.equal(true);
    expect(belopKolonne.props.children.props.readOnly).to.equal(true);
  });

  it('lagBelopKolonne skal gi fastsattBeløp versjon med isEdited false om andel ikkje skal redigere inntekt i readOnly med aksjonspunkt lukket', () => {
    const belopKolonne = lagBelopKolonne('test', true, true, true);
    expect(belopKolonne.props.className).to.equal(undefined);
    expect(belopKolonne.props.children.props.name).to.equal('test.fastsattBelop');
    expect(belopKolonne.props.children.props.isEdited).to.equal(false);
    expect(belopKolonne.props.children.props.readOnly).to.equal(true);
  });
});

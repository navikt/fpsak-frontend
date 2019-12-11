import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { FormattedMessage } from 'react-intl';
import { isRequiredMessage } from '@fpsak-frontend/utils';
import { RadioGroupField } from '@fpsak-frontend/form';
import { createVisningsnavnForAktivitet } from '@fpsak-frontend/fp-felles';
import faktaOmBeregningTilfelle from '@fpsak-frontend/kodeverk/src/faktaOmBeregningTilfelle';
import VurderMottarYtelseForm, {
  frilansMedAndreFrilanstilfeller,
  frilansUtenAndreFrilanstilfeller,
  mottarYtelseForArbeidMsg,
  VurderMottarYtelseFormImpl,
} from './VurderMottarYtelseForm';
import { finnFrilansFieldName, utledArbeidsforholdFieldName } from './VurderMottarYtelseUtils';

const requiredMessageId = isRequiredMessage()[0].id;

const beregningsgrunnlag = {
  beregningsgrunnlagPeriode: [{
    beregningsgrunnlagPrStatusOgAndel: [
      { andelsnr: 1, aktivitetStatus: { kode: 'AT' } },
      { andelsnr: 2, aktivitetStatus: { kode: 'AT' } },
      { andelsnr: 3, aktivitetStatus: { kode: 'AT' } },
      { andelsnr: 4, aktivitetStatus: { kode: 'FL' } },
    ],
  }],
};

const arbeidsforhold = {
  arbeidsgiverNavn: 'Virksomheten',
  arbeidsgiverId: '3284788923',
  arbeidsforholdId: '321378huda7e2',
  startdato: '2017-01-01',
  opphoersdato: '2018-01-01',
};

const arbeidsforhold2 = {
  arbeidsgiverNavn: 'Virksomheten2',
  arbeidsgiverId: '843597943435',
  arbeidsforholdId: 'jjisefoosfe',
  startdato: '2017-01-01',
  opphoersdato: '2018-01-01',
};

const arbeidsforhold3 = {
  arbeidsgiverNavn: 'Virksomheten2',
  arbeidsgiverId: '843597943435',
  arbeidsforholdId: '5465465464',
  startdato: '2017-01-01',
  opphoersdato: '2018-01-01',
};

const andel = {
  andelsnr: 1,
  inntektPrMnd: 25000,
  arbeidsforhold,
};

const andel2 = {
  andelsnr: 2,
  inntektPrMnd: 25000,
  arbeidsforhold: arbeidsforhold2,
};

const andel3 = {
  andelsnr: 3,
  inntektPrMnd: 25000,
  arbeidsforhold: arbeidsforhold3,
};

const arbeidstakerAndelerUtenIM = [
  { ...andel, mottarYtelse: null },
  { ...andel2, mottarYtelse: false },
  { ...andel3, mottarYtelse: true },
];

const alleKodeverk = {};

describe('<VurderMottarYtelseForm>', () => {
  it('skal teste at initial values bygges korrekt uten dto til stede', () => {
    const initialValues = VurderMottarYtelseForm.buildInitialValues(undefined);
    expect(initialValues).to.equal(null);
  });

  it('skal teste at initial values bygges korrekt med frilans uten definert mottar ytelse', () => {
    const mottarYtelse = {
      erFrilans: true,
      frilansMottarYtelse: null,
    };
    const initialValues = VurderMottarYtelseForm.buildInitialValues(mottarYtelse);
    expect(initialValues[finnFrilansFieldName()]).to.equal(null);
  });

  it('skal teste at initial values bygges korrekt med frilans med mottar ytelse', () => {
    const mottarYtelse = {
      erFrilans: true,
      frilansMottarYtelse: true,
    };
    const initialValues = VurderMottarYtelseForm.buildInitialValues(mottarYtelse);
    expect(initialValues[finnFrilansFieldName()]).to.equal(true);
  });

  it('skal teste at initial values bygges korrekt med frilans uten mottar ytelse', () => {
    const mottarYtelse = {
      erFrilans: true,
      frilansMottarYtelse: false,
    };
    const initialValues = VurderMottarYtelseForm.buildInitialValues(mottarYtelse);
    expect(initialValues[finnFrilansFieldName()]).to.equal(false);
  });


  it('skal teste at initial values bygges korrekt med frilans og arbeidsforhold uten inntektsmelding', () => {
    const mottarYtelse = {
      erFrilans: true,
      frilansMottarYtelse: false,
      arbeidstakerAndelerUtenIM,
    };
    const initialValues = VurderMottarYtelseForm.buildInitialValues(mottarYtelse);
    expect(initialValues[finnFrilansFieldName()]).to.equal(false);
    expect(initialValues[utledArbeidsforholdFieldName(andel)]).to.equal(null);
    expect(initialValues[utledArbeidsforholdFieldName(andel2)]).to.equal(false);
    expect(initialValues[utledArbeidsforholdFieldName(andel3)]).to.equal(true);
  });


  it('skal ikkje returnere errors', () => {
    const mottarYtelse = {
      erFrilans: true,
      frilansMottarYtelse: false,
      arbeidstakerAndelerUtenIM,
    };
    const values = {};
    values[finnFrilansFieldName()] = false;
    values[utledArbeidsforholdFieldName(andel)] = false;
    values[utledArbeidsforholdFieldName(andel2)] = false;
    values[utledArbeidsforholdFieldName(andel3)] = false;
    const errors = VurderMottarYtelseForm.validate(values, mottarYtelse);
    expect(errors[finnFrilansFieldName()]).to.equal(undefined);
    expect(errors[utledArbeidsforholdFieldName(andel)]).to.equal(undefined);
    expect(errors[utledArbeidsforholdFieldName(andel2)]).to.equal(undefined);
    expect(errors[utledArbeidsforholdFieldName(andel3)]).to.equal(undefined);
  });

  it('skal returnere required errors', () => {
    const mottarYtelse = {
      erFrilans: true,
      frilansMottarYtelse: false,
      arbeidstakerAndelerUtenIM,
    };
    const values = {};
    values[finnFrilansFieldName()] = null;
    values[utledArbeidsforholdFieldName(andel)] = null;
    values[utledArbeidsforholdFieldName(andel2)] = null;
    values[utledArbeidsforholdFieldName(andel3)] = null;
    const errors = VurderMottarYtelseForm.validate(values, mottarYtelse);
    expect(errors[finnFrilansFieldName()][0].id).to.equal(requiredMessageId);
    expect(errors[utledArbeidsforholdFieldName(andel)][0].id).to.equal(requiredMessageId);
    expect(errors[utledArbeidsforholdFieldName(andel2)][0].id).to.equal(requiredMessageId);
    expect(errors[utledArbeidsforholdFieldName(andel3)][0].id).to.equal(requiredMessageId);
  });

  it('skal vise radioknapp for frilans uten andre frilanstilfeller', () => {
    const wrapper = shallow(<VurderMottarYtelseFormImpl
      readOnly={false}
      isAksjonspunktClosed={false}
      tilfeller={[]}
      erFrilans
      arbeidsforholdUtenIM={[]}
      alleKodeverk={alleKodeverk}
    />);
    const flRadio = wrapper.find(RadioGroupField);
    expect(flRadio).to.have.length(1);
    expect(flRadio.prop('name')).to.equal(finnFrilansFieldName());
    const formattedMsg = wrapper.find(FormattedMessage);
    expect(formattedMsg).to.have.length(1);
    expect(formattedMsg.prop('id')).to.equal(frilansUtenAndreFrilanstilfeller());
  });

  it('skal vise radioknapp for frilans med andre frilanstilfeller', () => {
    const wrapper = shallow(<VurderMottarYtelseFormImpl
      readOnly={false}
      isAksjonspunktClosed={false}
      tilfeller={[faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL]}
      erFrilans
      arbeidsforholdUtenIM={[]}
      alleKodeverk={alleKodeverk}
    />);
    const flRadio = wrapper.find(RadioGroupField);
    expect(flRadio).to.have.length(1);
    expect(flRadio.prop('name')).to.equal(finnFrilansFieldName());
    const formattedMsg = wrapper.find(FormattedMessage);
    expect(formattedMsg).to.have.length(1);
    expect(formattedMsg.prop('id')).to.equal(frilansMedAndreFrilanstilfeller());
  });


  it('skal vise radioknapper for AT uten inntektsmelding', () => {
    const wrapper = shallow(<VurderMottarYtelseFormImpl
      readOnly={false}
      isAksjonspunktClosed={false}
      tilfeller={[faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL]}
      erFrilans={false}
      arbeidsforholdUtenIM={arbeidstakerAndelerUtenIM}
      alleKodeverk={alleKodeverk}
    />);
    const atRadio = wrapper.find(RadioGroupField);
    expect(atRadio).to.have.length(3);
    atRadio.forEach((radio, index) => expect(radio.prop('name')).to.equal(utledArbeidsforholdFieldName(arbeidstakerAndelerUtenIM[index])));
    const formattedMsg = wrapper.find(FormattedMessage);
    expect(formattedMsg).to.have.length(3);
    formattedMsg.forEach((msg, index) => {
      expect(msg.prop('id')).to.equal(mottarYtelseForArbeidMsg());
      expect(msg.prop('values').arbeid).to.equal(createVisningsnavnForAktivitet(arbeidstakerAndelerUtenIM[index].arbeidsforhold, alleKodeverk));
    });
  });

  it('skal transform values og sende ned FASTSETT_MAANEDSLONN_ARBEIDSTAKER_UTEN_INNTEKTSMELDING ved mottar ytelse for AT uten inntektsmelding', () => {
    const tilfeller = [faktaOmBeregningTilfelle.VURDER_LONNSENDRING, faktaOmBeregningTilfelle.VURDER_MOTTAR_YTELSE];
    const inntektPrMnd = [
      { andelsnr: andel.andelsnr, fastsattBelop: 10000 },
      { andelsnr: andel3.andelsnr, fastsattBelop: 20000 },
    ];
    const faktaOmBeregning = {
      faktaOmBeregningTilfeller: tilfeller.map((kode) => ({ kode })),
      vurderMottarYtelse: {
        erFrilanser: false,
        arbeidstakerAndelerUtenIM,
      },
    };
    const values = {};
    values[utledArbeidsforholdFieldName(andel)] = true;
    values[utledArbeidsforholdFieldName(andel2)] = false;
    values[utledArbeidsforholdFieldName(andel3)] = true;
    const fastsatteAndelsnr = [];
    const transformed = VurderMottarYtelseForm.transformValues(values, inntektPrMnd, faktaOmBeregning, beregningsgrunnlag, fastsatteAndelsnr);
    const fastsatteInntekter = transformed.fastsattUtenInntektsmelding.andelListe;
    expect(fastsatteAndelsnr.length).to.equal(2);
    expect(fastsatteAndelsnr.find((nr) => nr === andel.andelsnr) === undefined).to.equal(false);
    expect(fastsatteAndelsnr.find((nr) => nr === andel3.andelsnr) === undefined).to.equal(false);
    expect(fastsatteInntekter.length).to.equal(2);
    expect(fastsatteInntekter[0].andelsnr).to.equal(1);
    expect(fastsatteInntekter[0].fastsattBeløp).to.equal(10000);
    expect(fastsatteInntekter[1].andelsnr).to.equal(3);
    expect(fastsatteInntekter[1].fastsattBeløp).to.equal(20000);
    const fastsatteTilfeller = transformed.faktaOmBeregningTilfeller;
    expect(fastsatteTilfeller.length).to.equal(2);
    expect(fastsatteTilfeller[0]).to.equal(faktaOmBeregningTilfelle.VURDER_MOTTAR_YTELSE);
    expect(fastsatteTilfeller[1]).to.equal(faktaOmBeregningTilfelle.FASTSETT_MAANEDSLONN_ARBEIDSTAKER_UTEN_INNTEKTSMELDING);
  });

  it('skal kunne sette beløp til 0', () => {
    const tilfeller = [faktaOmBeregningTilfelle.VURDER_LONNSENDRING, faktaOmBeregningTilfelle.VURDER_MOTTAR_YTELSE];
    const inntektPrMnd = [
      { andelsnr: andel.andelsnr, fastsattBelop: 0 },
      { andelsnr: andel3.andelsnr, fastsattBelop: 0 },
    ];
    const faktaOmBeregning = {
      faktaOmBeregningTilfeller: tilfeller.map((kode) => ({ kode })),
      vurderMottarYtelse: {
        erFrilanser: false,
        arbeidstakerAndelerUtenIM,
      },
    };
    const values = {};
    values[utledArbeidsforholdFieldName(andel)] = true;
    values[utledArbeidsforholdFieldName(andel2)] = false;
    values[utledArbeidsforholdFieldName(andel3)] = true;
    const fastsatteAndelsnr = [];
    const transformed = VurderMottarYtelseForm.transformValues(values, inntektPrMnd, faktaOmBeregning, beregningsgrunnlag, fastsatteAndelsnr);
    const fastsatteInntekter = transformed.fastsattUtenInntektsmelding.andelListe;
    expect(fastsatteAndelsnr.length).to.equal(2);
    expect(fastsatteAndelsnr.find((nr) => nr === andel.andelsnr) === undefined).to.equal(false);
    expect(fastsatteAndelsnr.find((nr) => nr === andel3.andelsnr) === undefined).to.equal(false);
    expect(fastsatteInntekter.length).to.equal(2);
    expect(fastsatteInntekter[0].andelsnr).to.equal(1);
    expect(fastsatteInntekter[0].fastsattBeløp).to.equal(0);
    expect(fastsatteInntekter[1].andelsnr).to.equal(3);
    expect(fastsatteInntekter[1].fastsattBeløp).to.equal(0);
    const fastsatteTilfeller = transformed.faktaOmBeregningTilfeller;
    expect(fastsatteTilfeller.length).to.equal(2);
    expect(fastsatteTilfeller[0]).to.equal(faktaOmBeregningTilfelle.VURDER_MOTTAR_YTELSE);
    expect(fastsatteTilfeller[1]).to.equal(faktaOmBeregningTilfelle.FASTSETT_MAANEDSLONN_ARBEIDSTAKER_UTEN_INNTEKTSMELDING);
  });

  it('skal transform values og sende ned FASTSETT_MAANEDSINNTEKT_FL ved mottar ytelse for Frilans', () => {
    const tilfeller = [faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL, faktaOmBeregningTilfelle.VURDER_MOTTAR_YTELSE];
    const inntektPrMnd = [
      { andelsnr: 4, fastsattBelop: 10000, aktivitetStatus: 'FL' },
    ];
    const faktaOmBeregning = {
      faktaOmBeregningTilfeller: tilfeller.map((kode) => ({ kode })),
      vurderMottarYtelse: {
        erFrilanser: true,
        arbeidstakerAndelerUtenIM: [],
      },
    };
    const values = {};
    values[finnFrilansFieldName()] = true;
    const fastsatteAndelsnr = [];
    const transformed = VurderMottarYtelseForm.transformValues(values, inntektPrMnd, faktaOmBeregning, beregningsgrunnlag, fastsatteAndelsnr);
    const fastsattInntekt = transformed.fastsettMaanedsinntektFL.maanedsinntekt;
    expect(fastsatteAndelsnr.length).to.equal(1);
    expect(fastsattInntekt).to.equal(10000);
    const fastsatteTilfeller = transformed.faktaOmBeregningTilfeller;
    expect(fastsatteTilfeller.length).to.equal(2);
    expect(fastsatteTilfeller[0]).to.equal(faktaOmBeregningTilfelle.VURDER_MOTTAR_YTELSE);
    expect(fastsatteTilfeller[1]).to.equal(faktaOmBeregningTilfelle.FASTSETT_MAANEDSINNTEKT_FL);
  });


  it('skal transform values ved mottar ytelse for Frilans og arbeidstaker uten inntektsmelding', () => {
    const tilfeller = [faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL, faktaOmBeregningTilfelle.VURDER_LONNSENDRING,
      faktaOmBeregningTilfelle.VURDER_MOTTAR_YTELSE];
    const inntektPrMnd = [
      { andelsnr: andel.andelsnr, fastsattBelop: 10000 },
      { andelsnr: andel3.andelsnr, fastsattBelop: 20000 },
      { andelsnr: 4, fastsattBelop: 10000, aktivitetStatus: 'FL' },
    ];
    const faktaOmBeregning = {
      faktaOmBeregningTilfeller: tilfeller.map((kode) => ({ kode })),
      vurderMottarYtelse: {
        erFrilanser: true,
        arbeidstakerAndelerUtenIM,
      },
    };
    const fastsatteAndelsnr = [];
    const values = {};
    values[finnFrilansFieldName()] = true;
    values[utledArbeidsforholdFieldName(andel)] = true;
    values[utledArbeidsforholdFieldName(andel2)] = false;
    values[utledArbeidsforholdFieldName(andel3)] = true;


    const transformed = VurderMottarYtelseForm.transformValues(values, inntektPrMnd, faktaOmBeregning, beregningsgrunnlag, fastsatteAndelsnr);
    expect(fastsatteAndelsnr.length).to.equal(3);
    const fastsattFrilansinntekt = transformed.fastsettMaanedsinntektFL.maanedsinntekt;
    expect(fastsattFrilansinntekt).to.equal(10000);

    const fastsatteArbeidsinntekter = transformed.fastsattUtenInntektsmelding.andelListe;
    expect(fastsatteArbeidsinntekter.length).to.equal(2);
    expect(fastsatteArbeidsinntekter[0].andelsnr).to.equal(1);
    expect(fastsatteArbeidsinntekter[0].fastsattBeløp).to.equal(10000);
    expect(fastsatteArbeidsinntekter[1].andelsnr).to.equal(3);
    expect(fastsatteArbeidsinntekter[1].fastsattBeløp).to.equal(20000);
    const fastsatteTilfeller = transformed.faktaOmBeregningTilfeller;
    expect(fastsatteTilfeller.length).to.equal(3);
    expect(fastsatteTilfeller[0]).to.equal(faktaOmBeregningTilfelle.VURDER_MOTTAR_YTELSE);
    expect(fastsatteTilfeller[2]).to.equal(faktaOmBeregningTilfelle.FASTSETT_MAANEDSINNTEKT_FL);
    expect(fastsatteTilfeller[1]).to.equal(faktaOmBeregningTilfelle.FASTSETT_MAANEDSLONN_ARBEIDSTAKER_UTEN_INNTEKTSMELDING);
  });

  it('skal ikkje transform values mottar ytelse for AT uten inntektsmelding visst inntekt allerede er lagt til', () => {
    const tilfeller = [faktaOmBeregningTilfelle.VURDER_LONNSENDRING, faktaOmBeregningTilfelle.FASTSETT_MAANEDSLONN_ARBEIDSTAKER_UTEN_INNTEKTSMELDING,
      faktaOmBeregningTilfelle.VURDER_MOTTAR_YTELSE];
    const inntektPrMnd = [
      { andelsnr: andel.andelsnr, fastsattBelop: 10000 },
      { andelsnr: andel3.andelsnr, fastsattBelop: 20000 },
    ];
    const faktaOmBeregning = {
      faktaOmBeregningTilfeller: tilfeller.map((kode) => ({ kode })),
      vurderMottarYtelse: {
        erFrilanser: false,
        arbeidstakerAndelerUtenIM,
      },
    };
    const fastsatteAndelsnr = [andel.andelsnr, andel3.andelsnr];
    const values = {};
    values[utledArbeidsforholdFieldName(andel)] = true;
    values[utledArbeidsforholdFieldName(andel2)] = false;
    values[utledArbeidsforholdFieldName(andel3)] = true;

    const transformed = VurderMottarYtelseForm.transformValues(values, inntektPrMnd, faktaOmBeregning, beregningsgrunnlag, fastsatteAndelsnr);
    expect(transformed.fastsattUtenInntektsmelding).to.be.equal(undefined);
  });


  it('skal ikkje transform values mottar ytelse for frilans visst inntekt allerede er lagt til', () => {
    const tilfeller = [faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL, faktaOmBeregningTilfelle.FASTSETT_MAANEDSINNTEKT_FL,
      faktaOmBeregningTilfelle.VURDER_MOTTAR_YTELSE];
    const inntektPrMnd = [
      { andelsnr: 4, fastsattBelop: 10000, aktivitetStatus: 'FL' },
    ];
    const faktaOmBeregning = {
      faktaOmBeregningTilfeller: tilfeller.map((kode) => ({ kode })),
      vurderMottarYtelse: {
        erFrilanser: true,
        arbeidstakerAndelerUtenIM: [],
      },
    };
    const fastsatteAndelsnr = [4];
    const values = {};
    values[finnFrilansFieldName()] = true;
    const transformed = VurderMottarYtelseForm.transformValues(values, inntektPrMnd, faktaOmBeregning, beregningsgrunnlag, fastsatteAndelsnr);
    expect(transformed.fastsettMaanedsinntektFL).to.equal(undefined);
  });
});

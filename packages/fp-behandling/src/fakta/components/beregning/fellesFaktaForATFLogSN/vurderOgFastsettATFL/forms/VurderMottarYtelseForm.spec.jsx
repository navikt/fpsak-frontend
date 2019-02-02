import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { FormattedMessage } from 'react-intl';
import { isRequiredMessage, createVisningsnavnForAktivitet } from '@fpsak-frontend/utils';
import { RadioGroupField } from '@fpsak-frontend/form';
import faktaOmBeregningTilfelle from '@fpsak-frontend/kodeverk/src/faktaOmBeregningTilfelle';
import {
  VurderMottarYtelseFormImpl, frilansUtenAndreFrilanstilfeller, frilansMedAndreFrilanstilfeller, mottarYtelseForArbeidMsg,
} from './VurderMottarYtelseForm';
import {
  finnFrilansFieldName, utledArbeidsforholdFieldName,
} from './VurderMottarYtelseUtils';
import { createInputfieldKeyAT, createInputfieldKeyFL } from './FastsettATFLInntektForm';

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

describe('<VurderMottarYtelseForm>', () => {
  it('skal teste at initial values bygges korrekt uten dto til stede', () => {
    const initialValues = VurderMottarYtelseFormImpl.buildInitialValues(undefined);
    expect(initialValues).to.equal(null);
  });

  it('skal teste at initial values bygges korrekt med frilans uten definert mottar ytelse', () => {
    const mottarYtelse = {
      erFrilans: true,
      frilansMottarYtelse: null,
    };
    const initialValues = VurderMottarYtelseFormImpl.buildInitialValues(mottarYtelse);
    expect(initialValues[finnFrilansFieldName()]).to.equal(null);
  });

  it('skal teste at initial values bygges korrekt med frilans med mottar ytelse', () => {
    const mottarYtelse = {
      erFrilans: true,
      frilansMottarYtelse: true,
    };
    const initialValues = VurderMottarYtelseFormImpl.buildInitialValues(mottarYtelse);
    expect(initialValues[finnFrilansFieldName()]).to.equal(true);
  });

  it('skal teste at initial values bygges korrekt med frilans uten mottar ytelse', () => {
    const mottarYtelse = {
      erFrilans: true,
      frilansMottarYtelse: false,
    };
    const initialValues = VurderMottarYtelseFormImpl.buildInitialValues(mottarYtelse);
    expect(initialValues[finnFrilansFieldName()]).to.equal(false);
  });


  it('skal teste at initial values bygges korrekt med frilans og arbeidsforhold uten inntektsmelding', () => {
    const mottarYtelse = {
      erFrilans: true,
      frilansMottarYtelse: false,
      arbeidstakerAndelerUtenIM,
    };
    const initialValues = VurderMottarYtelseFormImpl.buildInitialValues(mottarYtelse);
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
    const errors = VurderMottarYtelseFormImpl.validate(values, mottarYtelse);
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
    const errors = VurderMottarYtelseFormImpl.validate(values, mottarYtelse);
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
    />);
    const atRadio = wrapper.find(RadioGroupField);
    expect(atRadio).to.have.length(3);
    atRadio.forEach((radio, index) => expect(radio.prop('name')).to.equal(utledArbeidsforholdFieldName(arbeidstakerAndelerUtenIM[index])));
    const formattedMsg = wrapper.find(FormattedMessage);
    expect(formattedMsg).to.have.length(3);
    formattedMsg.forEach((msg, index) => {
      expect(msg.prop('id')).to.equal(mottarYtelseForArbeidMsg());
      expect(msg.prop('values').arbeid).to.equal(createVisningsnavnForAktivitet(arbeidstakerAndelerUtenIM[index].arbeidsforhold));
    });
  });

  it('skal transform values og sende ned FASTSETT_MAANEDSLONN_ARBEIDSTAKER_UTEN_INNTEKTSMELDING ved mottar ytelse for AT uten inntektsmelding', () => {
    const tilfeller = [faktaOmBeregningTilfelle.VURDER_LONNSENDRING, faktaOmBeregningTilfelle.VURDER_MOTTAR_YTELSE];
    const transformedValues = {
      vurdertLonnsendring: { erLønnsendringIBeregningsperioden: true },
      faktaOmBeregningTilfeller: tilfeller,
    };
    const faktaOmBeregning = {
      vurderMottarYtelse: {
        erFrilanser: false,
        arbeidstakerAndelerUtenIM,
      },
    };
    const values = {};
    values[utledArbeidsforholdFieldName(andel)] = true;
    values[utledArbeidsforholdFieldName(andel2)] = false;
    values[utledArbeidsforholdFieldName(andel3)] = true;
    values[createInputfieldKeyAT(andel.arbeidsforhold)] = '10 000';
    values[createInputfieldKeyAT(andel3.arbeidsforhold)] = '20 000';

    const transformed = VurderMottarYtelseFormImpl.transformValues(values, faktaOmBeregning, tilfeller, transformedValues, beregningsgrunnlag);
    const fastsatteInntekter = transformed.fastsattUtenInntektsmelding.andelListe;
    expect(fastsatteInntekter.length).to.equal(2);
    expect(fastsatteInntekter[0].andelsnr).to.equal(1);
    expect(fastsatteInntekter[0].arbeidsinntekt).to.equal(10000);
    expect(fastsatteInntekter[1].andelsnr).to.equal(3);
    expect(fastsatteInntekter[1].arbeidsinntekt).to.equal(20000);
    const fastsatteTilfeller = transformed.faktaOmBeregningTilfeller;
    expect(fastsatteTilfeller.length).to.equal(3);
    expect(fastsatteTilfeller[0]).to.equal(faktaOmBeregningTilfelle.VURDER_LONNSENDRING);
    expect(fastsatteTilfeller[1]).to.equal(faktaOmBeregningTilfelle.VURDER_MOTTAR_YTELSE);
    expect(fastsatteTilfeller[2]).to.equal(faktaOmBeregningTilfelle.FASTSETT_MAANEDSLONN_ARBEIDSTAKER_UTEN_INNTEKTSMELDING);
  });


  it('skal transform values og sende ned FASTSETT_MAANEDSINNTEKT_FL ved mottar ytelse for Frilans', () => {
    const tilfeller = [faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL, faktaOmBeregningTilfelle.VURDER_MOTTAR_YTELSE];
    const transformedValues = {
      vurderNyoppstartetFL: { erNyoppstartetFL: true },
      faktaOmBeregningTilfeller: tilfeller,
    };
    const faktaOmBeregning = {
      vurderMottarYtelse: {
        erFrilanser: true,
        arbeidstakerAndelerUtenIM: [],
      },
    };
    const values = {};
    values[finnFrilansFieldName()] = true;
    values[createInputfieldKeyFL()] = '10 000';

    const transformed = VurderMottarYtelseFormImpl.transformValues(values, faktaOmBeregning, tilfeller, transformedValues, beregningsgrunnlag);
    const fastsattInntekt = transformed.fastsettMaanedsinntektFL.maanedsinntekt;
    expect(fastsattInntekt).to.equal(10000);
    const fastsatteTilfeller = transformed.faktaOmBeregningTilfeller;
    expect(fastsatteTilfeller.length).to.equal(3);
    expect(fastsatteTilfeller[0]).to.equal(faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL);
    expect(fastsatteTilfeller[1]).to.equal(faktaOmBeregningTilfelle.VURDER_MOTTAR_YTELSE);
    expect(fastsatteTilfeller[2]).to.equal(faktaOmBeregningTilfelle.FASTSETT_MAANEDSINNTEKT_FL);
  });


  it('skal transform values ved mottar ytelse for Frilans og arbeidstaker uten inntektsmelding', () => {
    const tilfeller = [faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL, faktaOmBeregningTilfelle.VURDER_LONNSENDRING,
      faktaOmBeregningTilfelle.VURDER_MOTTAR_YTELSE];
    const transformedValues = {
      vurderNyoppstartetFL: { erNyoppstartetFL: true },
      vurdertLonnsendring: { erLønnsendringIBeregningsperioden: true },
      faktaOmBeregningTilfeller: tilfeller,
    };
    const faktaOmBeregning = {
      vurderMottarYtelse: {
        erFrilanser: true,
        arbeidstakerAndelerUtenIM,
      },
    };
    const values = {};
    values[finnFrilansFieldName()] = true;
    values[utledArbeidsforholdFieldName(andel)] = true;
    values[utledArbeidsforholdFieldName(andel2)] = false;
    values[utledArbeidsforholdFieldName(andel3)] = true;
    values[createInputfieldKeyFL()] = '10 000';
    values[createInputfieldKeyAT(andel.arbeidsforhold)] = '10 000';
    values[createInputfieldKeyAT(andel3.arbeidsforhold)] = '20 000';


    const transformed = VurderMottarYtelseFormImpl.transformValues(values, faktaOmBeregning, tilfeller, transformedValues, beregningsgrunnlag);
    const fastsattFrilansinntekt = transformed.fastsettMaanedsinntektFL.maanedsinntekt;
    expect(fastsattFrilansinntekt).to.equal(10000);

    const fastsatteArbeidsinntekter = transformed.fastsattUtenInntektsmelding.andelListe;
    expect(fastsatteArbeidsinntekter.length).to.equal(2);
    expect(fastsatteArbeidsinntekter[0].andelsnr).to.equal(1);
    expect(fastsatteArbeidsinntekter[0].arbeidsinntekt).to.equal(10000);
    expect(fastsatteArbeidsinntekter[1].andelsnr).to.equal(3);
    expect(fastsatteArbeidsinntekter[1].arbeidsinntekt).to.equal(20000);
    const fastsatteTilfeller = transformed.faktaOmBeregningTilfeller;
    expect(fastsatteTilfeller.length).to.equal(5);
    expect(fastsatteTilfeller[0]).to.equal(faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL);
    expect(fastsatteTilfeller[1]).to.equal(faktaOmBeregningTilfelle.VURDER_LONNSENDRING);
    expect(fastsatteTilfeller[2]).to.equal(faktaOmBeregningTilfelle.VURDER_MOTTAR_YTELSE);
    expect(fastsatteTilfeller[4]).to.equal(faktaOmBeregningTilfelle.FASTSETT_MAANEDSINNTEKT_FL);
    expect(fastsatteTilfeller[3]).to.equal(faktaOmBeregningTilfelle.FASTSETT_MAANEDSLONN_ARBEIDSTAKER_UTEN_INNTEKTSMELDING);
  });

  it('skal ikkje transform values mottar ytelse for AT uten inntektsmelding visst inntekt allerede er lagt til', () => {
    const tilfeller = [faktaOmBeregningTilfelle.VURDER_LONNSENDRING, faktaOmBeregningTilfelle.FASTSETT_MAANEDSLONN_ARBEIDSTAKER_UTEN_INNTEKTSMELDING,
      faktaOmBeregningTilfelle.VURDER_MOTTAR_YTELSE];
    const transformedValues = {
      vurdertLonnsendring: { erLønnsendringIBeregningsperioden: true },
      fastsattUtenInntektsmelding: { andelListe: [{ andelsnr: 1, arbeidsinntekt: 10000 }, { andelsnr: 2, arbeidsinntekt: 20000 }] },
      faktaOmBeregningTilfeller: tilfeller,
    };
    const faktaOmBeregning = {
      vurderMottarYtelse: {
        erFrilanser: false,
        arbeidstakerAndelerUtenIM,
      },
    };
    const values = {};
    values[utledArbeidsforholdFieldName(andel)] = true;
    values[utledArbeidsforholdFieldName(andel2)] = false;
    values[utledArbeidsforholdFieldName(andel3)] = true;
    values[createInputfieldKeyAT(andel.arbeidsforhold)] = '10 000';
    values[createInputfieldKeyAT(andel3.arbeidsforhold)] = '20 000';

    const transformed = VurderMottarYtelseFormImpl.transformValues(values, faktaOmBeregning, tilfeller, transformedValues);
    expect(transformed.fastsattUtenInntektsmelding).to.be.equal(undefined);
  });


  it('skal ikkje transform values mottar ytelse for frilans visst inntekt allerede er lagt til', () => {
    const tilfeller = [faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL, faktaOmBeregningTilfelle.FASTSETT_MAANEDSINNTEKT_FL,
      faktaOmBeregningTilfelle.VURDER_MOTTAR_YTELSE];
    const transformedValues = {
      vurderNyoppstartetFL: { erNyoppstartetFL: true },
      fastsettMaanedsinntektFL: { maanedsinntekt: 10000 },
      faktaOmBeregningTilfeller: tilfeller,
    };
    const faktaOmBeregning = {
      vurderMottarYtelse: {
        erFrilanser: true,
        arbeidstakerAndelerUtenIM: [],
      },
    };
    const values = {};
    values[finnFrilansFieldName()] = true;
    values[createInputfieldKeyFL()] = '10 000';

    const transformed = VurderMottarYtelseFormImpl.transformValues(values, faktaOmBeregning, tilfeller, transformedValues);
    expect(transformed.fastsettMaanedsinntektFL).to.equal(undefined);
  });
});

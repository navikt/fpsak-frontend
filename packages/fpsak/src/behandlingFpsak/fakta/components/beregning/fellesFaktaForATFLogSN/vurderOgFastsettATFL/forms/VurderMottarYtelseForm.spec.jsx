import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { FormattedMessage } from 'react-intl';
import { isRequiredMessage, createVisningsnavnForAktivitet } from '@fpsak-frontend/utils';
import { RadioGroupField } from '@fpsak-frontend/form';
import faktaOmBeregningTilfelle from '@fpsak-frontend/kodeverk/src/faktaOmBeregningTilfelle';
import {
  VurderMottarYtelseFormImpl, finnFrilansFieldName, utledArbeidsforholdFieldName, kanIkkeGaaVidereErrorMessage,
  frilansUtenAndreFrilanstilfeller, frilansMedAndreFrilanstilfeller, mottarYtelseForArbeidMsg,
} from './VurderMottarYtelseForm';

const requiredMessageId = isRequiredMessage()[0].id;
const kanIkkeGaaVidereMessageId = kanIkkeGaaVidereErrorMessage()[0].id;

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
      arbeidstakerAndelerUtenIM: [
        { ...arbeidsforhold, mottarYtelse: null },
        { ...arbeidsforhold2, mottarYtelse: false },
        { ...arbeidsforhold3, mottarYtelse: true },
      ],
    };
    const initialValues = VurderMottarYtelseFormImpl.buildInitialValues(mottarYtelse);
    expect(initialValues[finnFrilansFieldName()]).to.equal(false);
    expect(initialValues[utledArbeidsforholdFieldName(arbeidsforhold)]).to.equal(null);
    expect(initialValues[utledArbeidsforholdFieldName(arbeidsforhold2)]).to.equal(false);
    expect(initialValues[utledArbeidsforholdFieldName(arbeidsforhold3)]).to.equal(true);
  });


  it('skal ikkje returnere errors', () => {
    const mottarYtelse = {
      erFrilans: true,
      frilansMottarYtelse: false,
      arbeidstakerAndelerUtenIM: [
        { ...arbeidsforhold, mottarYtelse: null },
        { ...arbeidsforhold2, mottarYtelse: false },
        { ...arbeidsforhold3, mottarYtelse: true },
      ],
    };
    const values = {};
    values[finnFrilansFieldName()] = false;
    values[utledArbeidsforholdFieldName(arbeidsforhold)] = false;
    values[utledArbeidsforholdFieldName(arbeidsforhold2)] = false;
    values[utledArbeidsforholdFieldName(arbeidsforhold3)] = false;
    const errors = VurderMottarYtelseFormImpl.validate(values, mottarYtelse);
    expect(errors[finnFrilansFieldName()]).to.equal(null);
    expect(errors[utledArbeidsforholdFieldName(arbeidsforhold)]).to.equal(null);
    expect(errors[utledArbeidsforholdFieldName(arbeidsforhold2)]).to.equal(null);
    expect(errors[utledArbeidsforholdFieldName(arbeidsforhold3)]).to.equal(null);
  });

  it('skal returnere required errors', () => {
    const mottarYtelse = {
      erFrilans: true,
      frilansMottarYtelse: false,
      arbeidstakerAndelerUtenIM: [
        { ...arbeidsforhold, mottarYtelse: null },
        { ...arbeidsforhold2, mottarYtelse: false },
        { ...arbeidsforhold3, mottarYtelse: true },
      ],
    };
    const values = {};
    values[finnFrilansFieldName()] = null;
    values[utledArbeidsforholdFieldName(arbeidsforhold)] = null;
    values[utledArbeidsforholdFieldName(arbeidsforhold2)] = null;
    values[utledArbeidsforholdFieldName(arbeidsforhold3)] = null;
    const errors = VurderMottarYtelseFormImpl.validate(values, mottarYtelse);
    expect(errors[finnFrilansFieldName()][0].id).to.equal(requiredMessageId);
    expect(errors[utledArbeidsforholdFieldName(arbeidsforhold)][0].id).to.equal(requiredMessageId);
    expect(errors[utledArbeidsforholdFieldName(arbeidsforhold2)][0].id).to.equal(requiredMessageId);
    expect(errors[utledArbeidsforholdFieldName(arbeidsforhold3)][0].id).to.equal(requiredMessageId);
  });

  it('skal returnere errors om valgt ja', () => {
    const mottarYtelse = {
      erFrilans: true,
      frilansMottarYtelse: false,
      arbeidstakerAndelerUtenIM: [
        { ...arbeidsforhold, mottarYtelse: null },
        { ...arbeidsforhold2, mottarYtelse: false },
        { ...arbeidsforhold3, mottarYtelse: true },
      ],
    };
    const values = {};
    values[finnFrilansFieldName()] = true;
    values[utledArbeidsforholdFieldName(arbeidsforhold)] = true;
    values[utledArbeidsforholdFieldName(arbeidsforhold2)] = true;
    values[utledArbeidsforholdFieldName(arbeidsforhold3)] = true;
    const errors = VurderMottarYtelseFormImpl.validate(values, mottarYtelse);
    expect(errors[finnFrilansFieldName()][0].id).to.equal(kanIkkeGaaVidereMessageId);
    expect(errors[utledArbeidsforholdFieldName(arbeidsforhold)][0].id).to.equal(kanIkkeGaaVidereMessageId);
    expect(errors[utledArbeidsforholdFieldName(arbeidsforhold2)][0].id).to.equal(kanIkkeGaaVidereMessageId);
    expect(errors[utledArbeidsforholdFieldName(arbeidsforhold3)][0].id).to.equal(kanIkkeGaaVidereMessageId);
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
    const arbeidstakerAndelerUtenIM = [
      { ...arbeidsforhold, mottarYtelse: null },
      { ...arbeidsforhold2, mottarYtelse: false },
      { ...arbeidsforhold3, mottarYtelse: true },
    ];
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
      expect(msg.prop('arbeid')).to.equal(createVisningsnavnForAktivitet(arbeidstakerAndelerUtenIM[index]));
    });
  });
});

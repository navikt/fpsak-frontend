import React from 'react';
import { expect } from 'chai';
import { shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { Normaltekst } from 'nav-frontend-typografi';
import { CheckboxField, DatepickerField } from '@fpsak-frontend/form';
import { FieldArray } from 'redux-form';
import { TilretteleggingArbeidsforholdSection } from './TilretteleggingArbeidsforholdSection';

describe('<TilretteleggingArbeidsforholdSection>', () => {
  it('skal rendre tilrettelegginger korrekt når visTilrettelegginer er true', () => {
    const wrapper = shallowWithIntl(<TilretteleggingArbeidsforholdSection
      readOnly={false}
      arbeidsforhold={{
        arbeidsgiverNavn: 'ARB_NAVN_1',
        arbeidsgiverIdent: '111',
        arbeidsforholdReferanse: '222444',
      }}
      formSectionName="ARB_NAVN"
      visTilrettelegginger
    />);
    const normaltekst = wrapper.find(Normaltekst);
    expect(normaltekst).has.length(1);
    expect(normaltekst.props().children).to.eq('ARB_NAVN_1 (111)....2444');
    const checkboxField = wrapper.find(CheckboxField);
    expect(checkboxField).has.length(1);
    const datepickerField = wrapper.find(DatepickerField);
    expect(datepickerField).has.length(1);
    const fieldArray = wrapper.find(FieldArray);
    expect(fieldArray).has.length(1);
  });
  it('skal rendre tilrettelegginger korrekt når visTilrettelegginer er false', () => {
    const wrapper = shallowWithIntl(<TilretteleggingArbeidsforholdSection
      readOnly={false}
      arbeidsforhold={{
        arbeidsgiverNavn: 'FRILANSER',
        arbeidsgiverIdent: '',
        arbeidsforholdReferanse: '',
      }}
      formSectionName="ARB_NAVN"
      visTilrettelegginger={false}
    />);
    const normaltekst = wrapper.find(Normaltekst);
    expect(normaltekst).has.length(1);
    expect(normaltekst.props().children).to.eq('FRILANSER');
    const checkboxField = wrapper.find(CheckboxField);
    expect(checkboxField).has.length(1);
    const datepickerField = wrapper.find(DatepickerField);
    expect(datepickerField).has.length(0);
    const fieldArray = wrapper.find(FieldArray);
    expect(fieldArray).has.length(0);
  });
});

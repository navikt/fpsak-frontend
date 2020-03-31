import React from 'react';
import { expect } from 'chai';
import { FieldArray } from 'redux-form';
import { Normaltekst } from 'nav-frontend-typografi';

import { CheckboxField, DatepickerField } from '@fpsak-frontend/form';

import Arbeidsforhold from '../../types/arbeidsforholdTsType';
import { TilretteleggingArbeidsforholdSection } from './TilretteleggingArbeidsforholdSection';
import shallowWithIntl from '../../../i18n/intl-enzyme-test-helper-fakta-fodsel-og-tilrettelegging';

describe('<TilretteleggingArbeidsforholdSection>', () => {
  it('skal rendre tilrettelegginger korrekt når visTilrettelegginer er true', () => {
    const wrapper = shallowWithIntl(<TilretteleggingArbeidsforholdSection
      readOnly={false}
      arbeidsforhold={{
        arbeidsgiverNavn: 'ARB_NAVN_1',
        arbeidsgiverIdent: '111222333',
        arbeidsgiverIdentVisning: '111222333',
        eksternArbeidsforholdReferanse: 'ARB001-001',
      } as Arbeidsforhold}
      formSectionName="ARB_NAVN"
      visTilrettelegginger
      behandlingId={1}
      behandlingVersjon={1}
      erOverstyrer
      changeField={() => undefined}
      stillingsprosentArbeidsforhold={40}
      setOverstyrtUtbetalingsgrad={() => undefined}
    />);
    const normaltekst = wrapper.find(Normaltekst);
    expect(normaltekst).has.length(2);
    expect(normaltekst.at(0).props().children).to.eq('ARB_NAVN_1 (111222333)....-001');
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
        eksternArbeidsforholdReferanse: '',
      } as Arbeidsforhold}
      formSectionName="ARB_NAVN"
      visTilrettelegginger={false}
      behandlingId={1}
      behandlingVersjon={1}
      erOverstyrer
      changeField={() => undefined}
      stillingsprosentArbeidsforhold={40}
      setOverstyrtUtbetalingsgrad={() => undefined}
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

import React from 'react';
import { expect } from 'chai';
import { FormattedMessage } from 'react-intl';

import { shallowWithIntl, intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';

import {
  DatepickerField, CheckboxField, DecimalField,
} from '@fpsak-frontend/form';
import { ArrowBox } from '@fpsak-frontend/shared-components';
import { ArbeidsforholdCheckboxes } from './ArbeidsforholdCheckboxes';

describe('<ArbeidsforholdCheckboxes>', () => {
  it('skal vise checkboxer når ingen valgt', () => {
    const wrapper = shallowWithIntl(<ArbeidsforholdCheckboxes
      intl={intlMock}
      kanGjennomfores={false}
      kanIkkeGjennomfores={false}
      redusertArbeid={false}
      readOnly={false}
    />);
    const checkbox = wrapper.find(CheckboxField);
    expect(checkbox).has.length(3);
    expect(checkbox.first().prop('name')).to.eql('kanGjennomfores');
    expect(checkbox.at(1).prop('name')).to.eql('redusertArbeid');
    expect(checkbox.at(2).prop('name')).to.eql('kanIkkeGjennomfores');
    const arrowBox = wrapper.find(ArrowBox);
    expect(arrowBox).has.length(0);
    const datepicker = wrapper.find(DatepickerField);
    expect(datepicker).has.length(0);
    const stillingsprosent = wrapper.find(DecimalField);
    expect(stillingsprosent).has.length(0);
  });
  it('skal vise checkboxer når ingen kan gjennomfores er valgt', () => {
    const wrapper = shallowWithIntl(<ArbeidsforholdCheckboxes
      intl={intlMock}
      kanGjennomfores
      kanIkkeGjennomfores={false}
      redusertArbeid={false}
      readOnly={false}
    />);
    const checkbox = wrapper.find(CheckboxField);
    expect(checkbox).has.length(3);
    const arrowBox = wrapper.find(ArrowBox);
    expect(arrowBox).has.length(1);
    const datepicker = wrapper.find(DatepickerField);
    expect(datepicker).has.length(1);
    const stillingsprosent = wrapper.find(DecimalField);
    expect(stillingsprosent).has.length(0);
    const warning = wrapper.find(FormattedMessage);
    expect(warning).has.length(0);
  });
  it('skal vise checkboxer når ingen kan gjennomfores og redusert arbeid er valgt', () => {
    const wrapper = shallowWithIntl(<ArbeidsforholdCheckboxes
      intl={intlMock}
      kanGjennomfores
      kanIkkeGjennomfores={false}
      redusertArbeid
      readOnly={false}
    />);
    const checkbox = wrapper.find(CheckboxField);
    expect(checkbox).has.length(3);
    const arrowBox = wrapper.find(ArrowBox);
    expect(arrowBox).has.length(2);
    const datepicker = wrapper.find(DatepickerField);
    expect(datepicker).has.length(2);
    const stillingsprosent = wrapper.find(DecimalField);
    expect(stillingsprosent).has.length(1);
  });
  it('skal vise checkboxer når alle tre valgt', () => {
    const wrapper = shallowWithIntl(<ArbeidsforholdCheckboxes
      intl={intlMock}
      kanGjennomfores
      kanIkkeGjennomfores
      redusertArbeid
      readOnly={false}
    />);
    const checkbox = wrapper.find(CheckboxField);
    expect(checkbox).has.length(3);
    const arrowBox = wrapper.find(ArrowBox);
    expect(arrowBox).has.length(3);
    const datepicker = wrapper.find(DatepickerField);
    expect(datepicker).has.length(3);
    const stillingsprosent = wrapper.find(DecimalField);
    expect(stillingsprosent).has.length(1);
  });
  it('skal vise warning når ingen checkboxer er valgt', () => {
    const wrapper = shallowWithIntl(<ArbeidsforholdCheckboxes
      intl={intlMock}
      kanGjennomfores={false}
      kanIkkeGjennomfores={false}
      redusertArbeid={false}
      readOnly={false}
      warning={{ permisjonsWarning: <FormattedMessage id="ArbeidsforholdInnhold.TilretteleggingWarning" /> }}
    />);
    const checkbox = wrapper.find(CheckboxField);
    expect(checkbox).has.length(3);
    const div = wrapper.find('div');
    expect(div).has.length(2);
    const warning = wrapper.find(FormattedMessage);
    expect(warning).has.length(1);
  });
});

import React from 'react';
import { expect } from 'chai';
import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';

import { SelectField } from 'form/Fields';
import PersonNyttEllerErstattArbeidsforholdPanel from './PersonNyttEllerErstattArbeidsforholdPanel';

describe('<PersonNyttEllerErstattArbeidsforholdPanel>', () => {
  it('skal vise dropdown med tidligere arbeidsforhold når en har valgt å erstatte gammelt med nytt', () => {
    const wrapper = shallowWithIntl(<PersonNyttEllerErstattArbeidsforholdPanel.WrappedComponent
      intl={intlMock}
      readOnly
      isErstattArbeidsforhold
      arbeidsforholdList={[{
        id: '1',
        navn: 'Svendsen Eksos',
        arbeidsgiverIdentifikator: '123456789',
        arbeidsgiverIdentifiktorGUI: '123456789',
        arbeidsforholdId: '1234-1232',
        fomDato: '2019-10-10',
      }]}
      formName="form"
      showContent
    />);

    const select = wrapper.find(SelectField);
    expect(select).has.length(1);
    expect(select.prop('selectValues').map(v => v.props.children)).to.eql(['Svendsen Eksos(123456789)...1232']);
  });

  it('skal ikke vise dropdown når en ikke har valgt å erstatte gammelt med nytt', () => {
    const wrapper = shallowWithIntl(<PersonNyttEllerErstattArbeidsforholdPanel.WrappedComponent
      intl={intlMock}
      readOnly
      isErstattArbeidsforhold={false}
      arbeidsforholdList={[{
        id: '1',
        navn: 'Svendsen Eksos',
        arbeidsgiverIdentifikator: '123456789',
        arbeidsgiverIdentifiktorGUI: '123456789',
        arbeidsforholdId: '1234-1232',
        fomDato: '2019-10-10',
      }]}
      formName="form"
      showContent
    />);
    expect(wrapper.find(SelectField)).has.length(0);
  });
});

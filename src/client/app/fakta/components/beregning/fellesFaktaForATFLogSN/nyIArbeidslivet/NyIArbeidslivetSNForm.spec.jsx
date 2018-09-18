import React from 'react';
import { expect } from 'chai';
import { shallowWithIntl } from 'testHelpers/intl-enzyme-test-helper';

import NyIArbeidslivetSNForm from './NyIArbeidslivetSNForm';

describe('<NyIArbeidslivetSNForm>', () => {
  it('skal teste at korrekt antall radioknapper vises med korrekte props', () => {
    const wrapper = shallowWithIntl(<NyIArbeidslivetSNForm
      readOnly={false}
      isAksjonspunktClosed={false}
    />);
    const radios = wrapper.find('RadioOption');
    expect(radios).to.have.length(2);
    expect(radios.last().prop('disabled')).is.eql(false);
  });
});

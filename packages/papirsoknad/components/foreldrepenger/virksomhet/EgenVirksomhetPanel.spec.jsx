import React from 'react';
import { expect } from 'chai';
import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';

import { EgenVirksomhetPanel } from './EgenVirksomhetPanel';

describe('<EgenVirksomhetPanel>', () => {
  it('skal rendre korrekt ved default props', () => {
    const wrapper = shallowWithIntl(<EgenVirksomhetPanel
      intl={intlMock}
      form="form"
    />);

    const undertittel = wrapper.find('Undertittel');
    expect(undertittel).to.have.length(1);

    const radios = wrapper.find('RadioOption');
    expect(radios).to.have.length(2);

    const fieldarray = wrapper.find('FieldArray');
    expect(fieldarray).to.have.length(0);
  });

  it('skal rendre korrekt når har arbeidet i egen virksomhet', () => {
    const wrapper = shallowWithIntl(<EgenVirksomhetPanel
      harArbeidetIEgenVirksomhet
      intl={intlMock}
      form="form"
    />);

    const fieldarray = wrapper.find('FieldArray');
    expect(fieldarray).to.have.length(1);
  });
});

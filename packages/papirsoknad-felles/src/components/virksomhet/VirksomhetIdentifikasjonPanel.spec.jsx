import React from 'react';
import { expect } from 'chai';

import { intlMock, shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';

import { VirksomhetIdentifikasjonPanel } from './VirksomhetIdentifikasjonPanel';

describe('<VirksomhetIdentifikasjonPanel>', () => {
  it('skal rendre korrekt ved default props', () => {
    const wrapper = shallowWithIntl(<VirksomhetIdentifikasjonPanel
      intl={intlMock}
      countryCodes={[]}
    />);

    const undertekst = wrapper.find('Undertekst');
    expect(undertekst).to.have.length(1);

    const inputs = wrapper.find('InputField');
    expect(inputs).to.have.length(1);
    expect(inputs.at(0).prop('name')).to.equal('navn');

    const select = wrapper.find('SelectField');
    expect(select).to.have.length(0);

    const radios = wrapper.find('RadioOption');
    expect(radios).to.have.length(2);

    const datepicker = wrapper.find('DatepickerField');
    expect(datepicker).to.have.length(0);
  });

  it('skal rendre korrekt når virksomhet er registrert i Norge', () => {
    const wrapper = shallowWithIntl(<VirksomhetIdentifikasjonPanel
      virksomhetRegistrertINorge
      countryCodes={[]}
      intl={intlMock}
    />);

    const inputs = wrapper.find('InputField');
    expect(inputs).to.have.length(2);
    expect(inputs.at(0).prop('name')).to.equal('navn');
    expect(inputs.at(1).prop('name')).to.equal('organisasjonsnummer');
  });

  it('skal rendre korrekt når virksomhet ikke er registrert i Norge', () => {
    const wrapper = shallowWithIntl(<VirksomhetIdentifikasjonPanel
      virksomhetRegistrertINorge={false}
      countryCodes={[]}
      intl={intlMock}
    />);

    const select = wrapper.find('SelectField');
    expect(select).to.have.length(1);

    const datepicker = wrapper.find('DatepickerField');
    expect(datepicker).to.have.length(2);
  });
});

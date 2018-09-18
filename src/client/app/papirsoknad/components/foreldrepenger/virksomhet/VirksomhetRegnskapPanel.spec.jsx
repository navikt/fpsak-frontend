import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { VirksomhetRegnskapPanel } from './VirksomhetRegnskapPanel';

describe('<VirksomhetRegnskapPanel>', () => {
  it('skal rendre visning korrekt med default props', () => {
    const wrapper = shallow(<VirksomhetRegnskapPanel />);

    const undertekst = wrapper.find('Undertekst');
    expect(undertekst).to.have.length(1);

    const radios = wrapper.find('RadioOption');
    expect(radios).to.have.length(2);

    const inputs = wrapper.find('InputField');
    expect(inputs).to.have.length(0);
  });

  it('skal rendre visning korrekt når virksomhet har regnskapsfører', () => {
    const wrapper = shallow(<VirksomhetRegnskapPanel harRegnskapsforer />);

    const undertekst = wrapper.find('Undertekst');
    expect(undertekst).to.have.length(1);

    const radios = wrapper.find('RadioOption');
    expect(radios).to.have.length(2);

    const inputs = wrapper.find('InputField');
    expect(inputs).to.have.length(2);
  });
});

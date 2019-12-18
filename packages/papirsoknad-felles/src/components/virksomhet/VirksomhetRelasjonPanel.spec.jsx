import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { VirksomhetRelasjonPanel } from './VirksomhetRelasjonPanel';

describe('<VirksomhetRelasjonPanel>', () => {
  it('Skal rendre visning korrekt ved default props', () => {
    const wrapper = shallow(<VirksomhetRelasjonPanel
      intl={{}}
    />);

    const undertekst = wrapper.find('Undertekst');
    expect(undertekst).to.have.length(1);

    const radios = wrapper.find('RadioOption');
    expect(radios).to.have.length(2);
  });
});

import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { Normaltekst } from 'nav-frontend-typografi';

import AktsomhetGradForsettFormPanel from './AktsomhetGradForsettFormPanel';

describe('<AktsomhetGradForsettFormPanel>', () => {
  it('skal vise panel for å forsett når denne radio-knappen er valgt', () => {
    const wrapper = shallow(<AktsomhetGradForsettFormPanel />);

    expect(wrapper.find(Normaltekst)).to.have.length(2);
  });
});

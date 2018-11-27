import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import MissingPage from './MissingPage';

describe('<MissingPage>', () => {
  it('skal vise en feilmelding og en lenke som leder tilbake til hovedside', () => {
    const wrapper = shallow(<MissingPage />);

    expect(wrapper.find('div')).to.have.length(1);
    expect(wrapper.find('FormattedMessage')).to.have.length(2);
    const link = wrapper.find('Link');
    expect(link).to.have.length(1);
    expect(link.prop('to')).to.eql('/');
  });
});

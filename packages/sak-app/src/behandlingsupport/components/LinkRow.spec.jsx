import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import LinkRow from './LinkRow';

describe('<LinkRow>', () => {
  it('skal vise lenkerad', () => {
    const wrapper = shallow(<LinkRow><div>test</div></LinkRow>);
    const divs = wrapper.find('div');
    expect(divs).to.have.length(2);
    expect(divs.last().text()).to.eql('test');
  });
});

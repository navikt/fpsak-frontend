import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import Home from './Home';

describe('<Home>', () => {
  it('skal rendre komponent', () => {
    const wrapper = shallow(<Home headerHeight={48} />);
    expect(wrapper.find('Switch')).to.have.length(1);
  });
});

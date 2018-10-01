import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import DateContainer from './DateContainer';

describe('<DateContainer>', () => {
  it('skal vise korrekte verdier', () => {
    const wrapper = shallow(<DateContainer
      opptjeningFomDate="2017-10-02"
      opptjeningTomDate="2018-02-02"
    />);
    const Column = wrapper.find('Column').first();
    const Column2 = wrapper.find('Column').at(2);
    expect(Column.childAt(0).text()).to.eql('2017-10-02');
    expect(Column2.childAt(0).text()).to.eql('2018-02-02');
  });
});

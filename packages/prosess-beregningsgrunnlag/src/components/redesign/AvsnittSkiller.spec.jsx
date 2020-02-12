import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import AvsnittSkiller from './AvsnittSkiller';

describe('AvsnittSkiller', () => {
  it('skal vise skillelinje', () => {
    const wrapper = shallow(<AvsnittSkiller />);

    const row = wrapper.find('Row');
    expect(row).to.have.length(1);
    const div = wrapper.find('div');
    expect(div).to.have.length(2);
  });
});

import React from 'react';
import { expect } from 'chai';

import { shallow } from 'enzyme';

import { OpptjeningVilkarViewImpl } from './OpptjeningVilkarView';
import OpptjeningTimeLineLight from './OpptjeningTimeLineLight';

describe('<OpptjeningVilkarView>', () => {
  it('skal vise tidslinje når en har aktiviteter', () => {
    const wrapper = shallow(<OpptjeningVilkarViewImpl
      fastsattOpptjeningActivities={[{ test: 'test' }]}
      monthsAndDays={{}}
      opptjeningFomDate="2017-10-02"
      opptjeningTomDate="2018-02-02"
      opptjeningsperiode="2017-10-02 - 2018-02-02"
    />);

    expect(wrapper.find(OpptjeningTimeLineLight)).to.have.length(1);
  });
});

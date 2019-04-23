
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import SaksstottePaneler from './components/SaksstottePaneler';
import { SaksstotteIndex } from './SaksstotteIndex';

describe('<SaksstotteIndex>', () => {
  it('skal vise alle historikkpaneler', () => {
    const fetchFn = sinon.spy();
    const oppgaver = [];
    const wrapper = shallow(<SaksstotteIndex
      fpsakUrl="www.fpsak.no"
      fetchBehandledeOppgaver={fetchFn}
      sistBehandledeSaker={oppgaver}
    />);

    expect(wrapper.find(SaksstottePaneler)).to.have.length(1);
    expect(fetchFn.calledOnce).to.be.true;
  });
});

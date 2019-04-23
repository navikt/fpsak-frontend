
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import SaksbehandlerIndex from './SaksbehandlerIndex';
import SaksbehandlerDashboard from './components/SaksbehandlerDashboard';

describe('<SaksbehandlerIndex>', () => {
  it('skal vise saksbehandler dashboard', () => {
    const wrapper = shallow(<SaksbehandlerIndex />);
    expect(wrapper.find(SaksbehandlerDashboard)).to.have.length(1);
  });
});

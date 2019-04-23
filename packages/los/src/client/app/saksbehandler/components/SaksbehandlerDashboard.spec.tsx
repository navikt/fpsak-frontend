
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import FagsakSearchIndex from '../fagsakSearch/FagsakSearchIndex';
import BehandlingskoerIndex from '../behandlingskoer/BehandlingskoerIndex';
import SaksstotteIndex from '../saksstotte/SaksstotteIndex';
import { SaksbehandlerDashboard } from './SaksbehandlerDashboard';

describe('<SaksbehandlerDashboard>', () => {
  it('skal vise dashboard uten fagsak-søk', () => {
    const wrapper = shallow(<SaksbehandlerDashboard
      showFagsakSearch={false}
    />);

    expect(wrapper.find(BehandlingskoerIndex)).to.have.length(1);
    expect(wrapper.find(SaksstotteIndex)).to.have.length(1);
  });

  it('skal vise dashboard med fagsak-søk', () => {
    const wrapper = shallow(<SaksbehandlerDashboard
      showFagsakSearch
    />);

    expect(wrapper.find(FagsakSearchIndex)).to.have.length(1);
    expect(wrapper.find(BehandlingskoerIndex)).to.have.length(1);
    expect(wrapper.find(SaksstotteIndex)).to.have.length(1);
  });
});

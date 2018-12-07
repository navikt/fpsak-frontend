import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import BehandlingGrid from './BehandlingGrid';

describe('BehandlingGrid', () => {
  it('skal vise behandlingsprosess og fakta-paneler', () => {
    const wrapper = shallow(<BehandlingGrid
      behandlingsprosessContent={<span>behandlingsprosess</span>}
      faktaContent={<span>fakta</span>}
    />);

    const spans = wrapper.find('span');
    expect(spans).has.length(2);
    expect(spans.first().text()).is.eql('behandlingsprosess');
    expect(spans.last().text()).is.eql('fakta');
  });

  it('skal vise papirsøknad-paneler', () => {
    const wrapper = shallow(<BehandlingGrid
      papirsoknadContent={<span>papirsøknad</span>}
    />);

    const spans = wrapper.find('span');
    expect(spans).has.length(1);
    expect(spans.text()).is.eql('papirsøknad');
  });
});

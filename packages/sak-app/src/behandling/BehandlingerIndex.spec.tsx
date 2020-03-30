import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import NoSelectedBehandling from './components/NoSelectedBehandling';
import { BehandlingerIndex } from './BehandlingerIndex';

describe('BehandlingerIndex', () => {
  it('skal rendre komponent korrekt', () => {
    const wrapper = shallow(<BehandlingerIndex
      numBehandlinger={1}
    />);

    const noBehandling = wrapper.find(NoSelectedBehandling);
    expect(noBehandling).to.have.length(1);
    expect(noBehandling.prop('numBehandlinger')).to.eql(1);
  });
});

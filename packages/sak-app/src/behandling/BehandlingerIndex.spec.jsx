import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import NoSelectedBehandling from './components/NoSelectedBehandling';
import { BehandlingerIndex } from './BehandlingerIndex';

describe('BehandlingerIndex', () => {
  it('skal rendre komponent korrekt', () => {
    const person = {
      navn: 'Espen Utvikler',
      alder: 40,
      personnummer: '1234546',
      erKvinne: false,
      personstatusType: {
        kode: 'test',
        navn: 'test',
      },
    };
    const wrapper = shallow(<BehandlingerIndex
      numBehandlinger={1}
      person={person}
    />);

    const noBehandling = wrapper.find(NoSelectedBehandling);
    expect(noBehandling).to.have.length(1);
    expect(noBehandling.prop('numBehandlinger')).to.eql(1);
  });
});

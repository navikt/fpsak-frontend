import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import { BehandlingGrid } from '@fpsak-frontend/fp-behandling-felles';
import FpKlageBehandlingInfoSetter from './FpKlageBehandlingInfoSetter';
import { BehandlingKlageIndex } from './BehandlingKlageIndex';

describe('BehandlingKlageIndex', () => {
  it('skal rendre komponent uten feil', () => {
    const wrapper = shallow(
      <BehandlingKlageIndex
        setBehandlingInfoHolder={sinon.spy()}
      />,
    );
    expect(wrapper.find(FpKlageBehandlingInfoSetter)).to.have.length(1);
    expect(wrapper.find(BehandlingGrid)).to.have.length(1);
  });
});

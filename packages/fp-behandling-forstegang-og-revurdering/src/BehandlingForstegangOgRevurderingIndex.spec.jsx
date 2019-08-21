import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import { BehandlingGrid } from '@fpsak-frontend/fp-behandling-felles';
import FpSakBehandlingInfoSetter from './FpSakBehandlingInfoSetter';
import { BehandlingForstegangOgRevurderingIndex } from './BehandlingForstegangOgRevurderingIndex';

describe('BehandlingForstegangOgRevurderingIndex', () => {
  it('skal rendre komponent uten feil', () => {
    const wrapper = shallow(
      <BehandlingForstegangOgRevurderingIndex
        setBehandlingInfoHolder={sinon.spy()}
      />,
    );
    expect(wrapper.find(FpSakBehandlingInfoSetter)).to.have.length(1);
    expect(wrapper.find(BehandlingGrid)).to.have.length(1);
  });
});

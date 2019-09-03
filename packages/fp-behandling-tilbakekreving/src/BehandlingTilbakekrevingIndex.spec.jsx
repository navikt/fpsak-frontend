import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import { BehandlingGrid } from '@fpsak-frontend/fp-behandling-felles';
import FpTilbakeBehandlingInfoSetter from './FpTilbakeBehandlingInfoSetter';
import { BehandlingTilbakekrevingIndex } from './BehandlingTilbakekrevingIndex';

describe('BehandlingTilbakekrevingIndex', () => {
  it('skal rendre komponent uten feil', () => {
    const wrapper = shallow(
      <BehandlingTilbakekrevingIndex
        setBehandlingInfoHolder={sinon.spy()}
      />,
    );
    expect(wrapper.find(FpTilbakeBehandlingInfoSetter)).to.have.length(1);
    expect(wrapper.find(BehandlingGrid)).to.have.length(1);
  });
});
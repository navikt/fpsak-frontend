import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import { BehandlingGrid } from '@fpsak-frontend/fp-behandling-felles';
import PapirsoknadInfoSetter from './PapirsoknadInfoSetter';
import { BehandlingPapirsoknadIndex } from './BehandlingPapirsoknadIndex';

describe('BehandlingPapirsoknadIndex', () => {
  it('skal rendre komponent uten feil', () => {
    const wrapper = shallow(
      <BehandlingPapirsoknadIndex
        setBehandlingInfoHolder={sinon.spy()}
      />,
    );
    expect(wrapper.find(PapirsoknadInfoSetter)).to.have.length(1);
    expect(wrapper.find(BehandlingGrid)).to.have.length(1);
  });
});

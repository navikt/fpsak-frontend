import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import { BehandlingIdentifier } from '@fpsak-frontend/fp-felles';

import FaktaPanel from './components/FaktaPanel';
import { FaktaContainer } from './FaktaContainer';

describe('FaktaContainer', () => {
  it('skal rendre komponent uten feil', () => {
    const props = {
      location: {},
      behandlingIdentifier: new BehandlingIdentifier(1, 1),
      behandlingVersjon: 1,
      openInfoPanels: ['test'],
      resetFakta: sinon.spy(),
      resolveFaktaAksjonspunkter: sinon.spy(),
      resolveFaktaOverstyrAksjonspunkter: sinon.spy(),
    };
    const wrapper = shallow(<FaktaContainer {...props} />);
    expect(wrapper.find(FaktaPanel)).to.have.length(1);
  });
});

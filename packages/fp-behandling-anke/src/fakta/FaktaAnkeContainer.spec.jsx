import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import { BehandlingIdentifier } from '@fpsak-frontend/fp-felles';

import FaktaAnkePanel from './components/FaktaAnkePanel';
import { FaktaAnkeContainer } from './FaktaAnkeContainer';

describe('FaktaAnkeContainer', () => {
  it('skal rendre komponent uten feil', () => {
    const props = {
      location: {},
      behandlingIdentifier: new BehandlingIdentifier(1, 1),
      behandlingVersjon: 1,
      openInfoPanels: ['test'],
      resetFakta: sinon.spy(),
    };
    const wrapper = shallow(<FaktaAnkeContainer {...props} />);
    expect(wrapper.find(FaktaAnkePanel)).to.have.length(1);
  });
});

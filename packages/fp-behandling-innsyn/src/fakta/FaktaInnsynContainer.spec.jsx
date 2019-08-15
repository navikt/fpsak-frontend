import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import { BehandlingIdentifier } from '@fpsak-frontend/fp-felles';

import FaktaInnsynPanel from './components/FaktaInnsynPanel';
import { FaktaInnsynContainer } from './FaktaInnsynContainer';

describe('FaktaInnsynContainer', () => {
  it('skal rendre komponent uten feil', () => {
    const props = {
      location: {},
      behandlingIdentifier: new BehandlingIdentifier(1, 1),
      behandlingVersjon: 1,
      openInfoPanels: ['test'],
      resetFakta: sinon.spy(),
    };
    const wrapper = shallow(<FaktaInnsynContainer {...props} />);
    expect(wrapper.find(FaktaInnsynPanel)).to.have.length(1);
  });
});

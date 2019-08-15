import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import { BehandlingIdentifier } from '@fpsak-frontend/fp-felles';

import FaktaKlagePanel from './components/FaktaKlagePanel';
import { FaktaKlageContainer } from './FaktaKlageContainer';

describe('FaktaKlageContainer', () => {
  it('skal rendre komponent uten feil', () => {
    const props = {
      location: {},
      behandlingIdentifier: new BehandlingIdentifier(1, 1),
      behandlingVersjon: 1,
      openInfoPanels: ['test'],
      resetFakta: sinon.spy(),
    };
    const wrapper = shallow(<FaktaKlageContainer {...props} />);
    expect(wrapper.find(FaktaKlagePanel)).to.have.length(1);
  });
});

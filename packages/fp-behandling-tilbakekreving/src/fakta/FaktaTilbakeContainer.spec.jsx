import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import { BehandlingIdentifier } from '@fpsak-frontend/fp-felles';

import TilbakekrevingFaktaPanel from './components/TilbakekrevingFaktaPanel';
import { FaktaTilbakeContainer } from './FaktaTilbakeContainer';

describe('FaktaTilbakeContainer', () => {
  it('skal rendre komponent uten feil', () => {
    const props = {
      location: {},
      behandlingIdentifier: new BehandlingIdentifier(1, 1),
      behandlingVersjon: 1,
      openInfoPanels: ['test'],
      resetFakta: sinon.spy(),
      resolveFaktaAksjonspunkter: sinon.spy(),
    };
    const wrapper = shallow(<FaktaTilbakeContainer {...props} />);
    expect(wrapper.find(TilbakekrevingFaktaPanel)).to.have.length(1);
  });
});

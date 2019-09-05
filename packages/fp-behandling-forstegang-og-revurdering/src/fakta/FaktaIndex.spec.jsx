import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import { BehandlingIdentifier } from '@fpsak-frontend/fp-felles';
import { CommonFaktaIndex } from '@fpsak-frontend/fp-behandling-felles';

import FaktaPanel from './components/FaktaPanel';
import { FaktaIndex } from './FaktaIndex';

describe('FaktaIndex', () => {
  it('skal rendre komponent uten feil', () => {
    const submitFakta = sinon.spy();
    const toggleInfoPanel = sinon.spy();
    const shouldOpenDefaultInfoPanels = sinon.spy();

    const wrapper = shallow(<FaktaIndex
      location={{}}
      behandlingIdentifier={new BehandlingIdentifier(1, 1)}
      behandlingVersjon={1}
      openInfoPanels={['test']}
    />);

    const index = wrapper.find(CommonFaktaIndex);
    expect(index).to.have.length(1);

    const panel = index.renderProp('render')(submitFakta, toggleInfoPanel, shouldOpenDefaultInfoPanels)
      .find(FaktaPanel);
    expect(panel).to.have.length(1);
  });
});

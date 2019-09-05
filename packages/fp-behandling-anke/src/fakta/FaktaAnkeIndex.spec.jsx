import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import { BehandlingIdentifier } from '@fpsak-frontend/fp-felles';
import { CommonFaktaIndex } from '@fpsak-frontend/fp-behandling-felles';

import FaktaAnkePanel from './components/FaktaAnkePanel';
import { FaktaAnkeIndex } from './FaktaAnkeIndex';

describe('FaktaAnkeIndex', () => {
  it('skal rendre komponent uten feil', () => {
    const wrapper = shallow(<FaktaAnkeIndex
      location={{}}
      behandlingIdentifier={new BehandlingIdentifier(1, 1)}
      behandlingVersjon={1}
      openInfoPanels={['test']}
    />);

    const index = wrapper.find(CommonFaktaIndex);
    expect(index).to.have.length(1);

    const panel = index.renderProp('render')()
      .find(FaktaAnkePanel);
    expect(panel).to.have.length(1);
  });
});

import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import { BehandlingIdentifier } from '@fpsak-frontend/fp-felles';
import { CommonFaktaIndex } from '@fpsak-frontend/fp-behandling-felles';

import TilbakekrevingFaktaPanel from './components/TilbakekrevingFaktaPanel';
import { FaktaTilbakeIndex } from './FaktaTilbakeIndex';

describe('FaktaTilbakeIndex', () => {
  it('skal rendre komponent uten feil', () => {
    const wrapper = shallow(<FaktaTilbakeIndex
      location={{}}
      behandlingIdentifier={new BehandlingIdentifier(1, 1)}
      behandlingVersjon={1}
      openInfoPanels={['test']}
    />);

    const index = wrapper.find(CommonFaktaIndex);
    expect(index).to.have.length(1);

    const panel = index.renderProp('render')()
      .find(TilbakekrevingFaktaPanel);
    expect(panel).to.have.length(1);
  });
});

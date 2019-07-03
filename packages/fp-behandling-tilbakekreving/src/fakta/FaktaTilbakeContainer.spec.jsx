import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import { FaktaIndexProps } from '@fpsak-frontend/fp-behandling-felles';

import TilbakekrevingFaktaPanel from './components/TilbakekrevingFaktaPanel';
import { FaktaTilbakeContainer } from './FaktaTilbakeContainer';

describe('FaktaTilbakeContainer', () => {
  it('skal rendre komponent uten feil', () => {
    const faktaIndexProps = new FaktaIndexProps();
    const wrapper = shallow(<FaktaTilbakeContainer faktaIndexProps={faktaIndexProps} />);
    expect(wrapper.find(TilbakekrevingFaktaPanel)).to.have.length(1);
  });
});

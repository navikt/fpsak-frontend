import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import { FaktaIndexProps } from '@fpsak-frontend/fp-behandling-felles';

import FaktaAnkePanel from './components/FaktaAnkePanel';
import { FaktaAnkeContainer } from './FaktaAnkeContainer';

describe('FaktaAnkeContainer', () => {
  it('skal rendre komponent uten feil', () => {
    const faktaIndexProps = new FaktaIndexProps();
    const wrapper = shallow(<FaktaAnkeContainer faktaIndexProps={faktaIndexProps} />);
    expect(wrapper.find(FaktaAnkePanel)).to.have.length(1);
  });
});

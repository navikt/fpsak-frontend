import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import { FaktaIndexProps } from '@fpsak-frontend/fp-behandling-felles';

import FaktaPanel from './components/FaktaPanel';
import { FaktaContainer } from './FaktaContainer';

describe('FaktaContainer', () => {
  it('skal rendre komponent uten feil', () => {
    const faktaIndexProps = new FaktaIndexProps();
    const wrapper = shallow(<FaktaContainer faktaIndexProps={faktaIndexProps} />);
    expect(wrapper.find(FaktaPanel)).to.have.length(1);
  });
});

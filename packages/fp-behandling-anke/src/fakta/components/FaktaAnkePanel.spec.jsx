import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import { PersonIndex } from '@fpsak-frontend/fp-felles';

import { FaktaAnkePanel } from './FaktaAnkePanel';

describe('FaktaAnkePanel', () => {
  it('skal rendre komponent uten feil', () => {
    const wrapper = shallow(<FaktaAnkePanel fagsakPerson={{}} />);
    expect(wrapper.find(PersonIndex)).to.have.length(1);
  });
});

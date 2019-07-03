import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import { FaktaIndexProps } from '@fpsak-frontend/fp-behandling-felles';

import FaktaInnsynPanel from './components/FaktaInnsynPanel';
import { FaktaInnsynContainer } from './FaktaInnsynContainer';

describe('FaktaInnsynContainer', () => {
  it('skal rendre komponent uten feil', () => {
    const faktaIndexProps = new FaktaIndexProps();
    const wrapper = shallow(<FaktaInnsynContainer faktaIndexProps={faktaIndexProps} />);
    expect(wrapper.find(FaktaInnsynPanel)).to.have.length(1);
  });
});

import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import { FaktaIndexProps } from '@fpsak-frontend/fp-behandling-felles';

import FaktaKlagePanel from './components/FaktaKlagePanel';
import { FaktaKlageContainer } from './FaktaKlageContainer';

describe('FaktaKlageContainer', () => {
  it('skal rendre komponent uten feil', () => {
    const faktaIndexProps = new FaktaIndexProps();
    const wrapper = shallow(<FaktaKlageContainer faktaIndexProps={faktaIndexProps} />);
    expect(wrapper.find(FaktaKlagePanel)).to.have.length(1);
  });
});

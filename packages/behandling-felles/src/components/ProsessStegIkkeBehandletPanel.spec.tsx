import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { FadingPanel } from '@fpsak-frontend/shared-components';

import ProsessStegIkkeBehandletPanel from './ProsessStegIkkeBehandletPanel';

describe('<ProsessStegIkkeBehandletPanel>', () => {
  it('skal rendre komponent', () => {
    const wrapper = shallow(<ProsessStegIkkeBehandletPanel />);
    expect(wrapper.find(FadingPanel)).to.have.length(1);
  });
});

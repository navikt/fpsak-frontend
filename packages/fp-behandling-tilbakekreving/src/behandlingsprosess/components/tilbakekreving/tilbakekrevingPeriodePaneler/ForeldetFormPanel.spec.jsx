import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { TextAreaField } from '@fpsak-frontend/form';

import ForeldetFormPanel from './ForeldetFormPanel';

describe('<ForeldetFormPanel>', () => {
  it('skal rendre komponent korrekt', () => {
    const wrapper = shallow(<ForeldetFormPanel />);
    expect(wrapper.find(TextAreaField)).to.have.length(1);
  });
});

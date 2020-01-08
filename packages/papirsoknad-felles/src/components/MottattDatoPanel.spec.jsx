import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { DatepickerField } from '@fpsak-frontend/form';

import MottattDatoPanel from './MottattDatoPanel';

describe('<MottattDatoPanel>', () => {
  it('skal rendre komponent', () => {
    const wrapper = shallow(<MottattDatoPanel readOnly={false} />);
    expect(wrapper.find(DatepickerField)).to.have.length(1);
  });
});

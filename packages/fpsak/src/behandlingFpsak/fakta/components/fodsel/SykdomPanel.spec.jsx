import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import { TextAreaField } from 'form/Fields';
import { SykdomPanel } from './SykdomPanel';

describe('<SykdomPanel>', () => {
  it('skal rendre Sykdomspanel', () => {
    const wrapper = shallow(<SykdomPanel
      readOnly={false}
    />);

    expect(wrapper.find(TextAreaField)).to.have.length(1);
  });
});

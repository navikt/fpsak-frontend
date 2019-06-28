import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { DecimalField } from '@fpsak-frontend/form';
import TilretteleggingsvalgPanel from './TilretteleggingsvalgPanel';

describe('<TilretteleggingsvalgPanel>', () => {
  it('skal vise stillingsprosentfeltet når en har stillingsprosent', () => {
    const wrapper = shallow(<TilretteleggingsvalgPanel
      harStillingsprosent
      readOnly={false}
    />);

    expect(wrapper.find(DecimalField)).has.length(1);
  });

  it('skal ikke vise stillingsprosentfeltet når en ikke har stillingsprosent', () => {
    const wrapper = shallow(<TilretteleggingsvalgPanel
      harStillingsprosent={false}
      readOnly={false}
    />);

    expect(wrapper.find(DecimalField)).has.length(0);
  });
});

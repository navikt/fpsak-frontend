import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import Header from './Header';

describe('<Header>', () => {
  it('skal sjekke at navn blir vist', () => {
    const wrapper = shallow(<Header
      iconLinks={[]}
      navAnsattName="Per"
      systemTittel="My System"
      removeErrorMessage={() => undefined}
      queryStrings={{}}
      showDetailedErrorMessages={false}
    />);
    const lastDiv = wrapper.find('span').last();
    expect(lastDiv.text()).to.eq('Per');
  });
});

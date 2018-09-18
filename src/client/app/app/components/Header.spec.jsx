import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import Header from './Header';

describe('<Header>', () => {
  it('skal sjekke at navn blir vist', () => {
    const wrapper = shallow(<Header
      navAnsattName="Per"
      rettskildeUrl="url"
      systemrutineUrl="url2"
      removeErrorMessage={() => undefined}
      queryStrings={{}}
    />);
    const lastDiv = wrapper.find('div').last();
    expect(lastDiv.text()).to.eql('Per');
  });
});

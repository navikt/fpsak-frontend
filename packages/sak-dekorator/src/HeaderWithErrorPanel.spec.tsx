import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import Header from '@navikt/nap-header';

import HeaderWithErrorPanel from './HeaderWithErrorPanel';

describe('<HeaderWithErrorPanel>', () => {
  it('skal sjekke at navn blir vist', () => {
    const wrapper = shallow(<HeaderWithErrorPanel
      iconLinks={[]}
      navAnsattName="Per"
      systemTittel="My System"
      removeErrorMessage={() => undefined}
      queryStrings={{}}
      showDetailedErrorMessages={false}
      setSiteHeight={() => undefined}
    />);
    const header = wrapper.find(Header);
    expect(header.prop('title')).to.eq('My System');
  });
});

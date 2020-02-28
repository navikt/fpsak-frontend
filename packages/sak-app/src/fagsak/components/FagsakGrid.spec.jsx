import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import FagsakGrid from './FagsakGrid';

describe('<FagsakGrid>', () => {
  it('skal vise fagsakgrid med underkomponenter', () => {
    const wrapper = shallow(<FagsakGrid
      behandlingContent={<div id="behandlingContent" />}
      profileAndNavigationContent={<div id="profileContent" />}
      supportContent={<div id="supportContent" />}
      visittkortContent={() => <div id="visittkort" />}
    />);

    expect(wrapper.find('#behandlingContent')).to.have.length(1);
    expect(wrapper.find('#profileContent')).to.have.length(1);
    expect(wrapper.find('#supportContent')).to.have.length(1);
    expect(wrapper.find('#visittkort')).to.have.length(2);
  });
});

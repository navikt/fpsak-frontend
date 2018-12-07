import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import TableColumn from './TableColumn';

describe('<TableColumn>', () => {
  it('skal vise  verdi i kolonne', () => {
    const wrapper = shallow(<TableColumn>testverdi</TableColumn>);

    const col = wrapper.find('td');
    expect(col).to.have.length(1);
    expect(col.text()).is.eql('testverdi');
  });
});

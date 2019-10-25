import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import NoSelectedBehandling from './NoSelectedBehandling';

describe('<NoSelectedBehandling>', () => {
  it('skal rendre korrekt melding', () => {
    const wrapper1 = shallow(<NoSelectedBehandling numBehandlinger={0} />);
    expect(wrapper1.find('FormattedMessage').at(0).prop('id')).to.eql('NoSelectedBehandling.ZeroBehandlinger');

    const wrapper2 = shallow(<NoSelectedBehandling numBehandlinger={2} />);
    expect(wrapper2.find('FormattedMessage').at(0).prop('id')).to.eql('FagsakGrid.PleaseSelectBehandling');
  });
});

import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import AksjonspunktHelpText from './AksjonspunktHelpText';

describe('<AksjonspunktHelpText>', () => {
  it('skal vise hjelpetekst og ikon når aksjonspunkt er åpent', () => {
    const wrapper = shallow(
      <AksjonspunktHelpText isAksjonspunktOpen>
        {['test']}
      </AksjonspunktHelpText>,
    );
    expect(wrapper.find('InjectIntl(Image)')).to.have.length(1);
    expect(wrapper.find('Element').childAt(0).text()).to.eql('test');
  });

  it('skal kun vise hjelpetekst når aksjonspunkt er lukket', () => {
    const wrapper = shallow(
      <AksjonspunktHelpText isAksjonspunktOpen={false}>
        {['test']}
      </AksjonspunktHelpText>,
    );
    expect(wrapper.find('InjectIntl(Image)')).to.have.length(0);
    expect(wrapper.find('Normaltekst').childAt(2).text()).to.eql('test');
  });
});

import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import DateLabel from 'sharedComponents/DateLabel';
import BorderBox from 'sharedComponents/BorderBox';
import BehandlingPickerItemContent from './BehandlingPickerItemContent';

describe('<BehandlingPickerItemContent>', () => {
  it('skal rendre komponent', () => {
    const wrapper = shallow(<BehandlingPickerItemContent
      withChevronDown
      withChevronUp
      behandlingType="Foreldrepenger"
      behandlingId={1}
      opprettetDato="2018-01-01"
      behandlingsstatus="Opprettet"
    />);

    expect(wrapper.find(BorderBox)).has.length(1);
    expect(wrapper.find(DateLabel)).has.length(1);
  });

  it('skal vise avsluttet dato når denne finnes', () => {
    const wrapper = shallow(<BehandlingPickerItemContent
      withChevronDown
      withChevronUp
      behandlingType="Foreldrepenger"
      behandlingId={1}
      opprettetDato="2018-01-01"
      avsluttetDato="2018-05-01"
      behandlingsstatus="Opprettet"
    />);

    const labels = wrapper.find(DateLabel);
    expect(labels).has.length(2);
    expect(labels.first().prop('dateString')).to.eql('2018-01-01');
    expect(labels.last().prop('dateString')).to.eql('2018-05-01');
  });
});

import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { NavLink } from 'react-router-dom';

import SupportPanel from 'behandlingsupport/supportPanels';
import SupportPanelLink from './SupportPanelLink';

describe('<SupportPanelLink>', () => {
  it('skal vise lenke når denne er aktiv og påslått', () => {
    const wrapper = shallow(<SupportPanelLink
      supportPanel={SupportPanel.HISTORY}
      isEnabled
      isActive
      supportPanelLocation={{ url: 'test' }}
    />);
    const lenke = wrapper.find(NavLink);
    expect(lenke).to.have.length(1);
    expect(lenke.prop('className')).to.eql('link isActive');
  });

  it('skal ikke vise lenke når denne er aktiv og avslått', () => {
    const wrapper = shallow(<SupportPanelLink
      supportPanel={SupportPanel.HISTORY}
      isEnabled={false}
      isActive
      supportPanelLocation={{ url: 'test' }}
    />);
    const lenke = wrapper.find(NavLink);
    expect(lenke).to.have.length(0);
  });
});

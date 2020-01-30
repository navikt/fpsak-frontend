import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import Lesmerpanel2 from './LesmerPanel_V2';


describe('Lesmerpanel2', () => {
  it('skal ikke vise lukketekst når er Aapen', () => {
    const wrapper = shallow(
      <Lesmerpanel2
        defaultApen
        onClose={() => {}}
        onOpen={() => {}}
        intro="Dette er intro"
        lukkTekst="lukketekst"
        apneTekst="aapnetekst"
      >
        {[<span>innholdstekst</span>]}
      </Lesmerpanel2>,
    );

    expect(wrapper.children()).to.have.length(2);
    const divs = wrapper.find('div');

    const lesmertoggle = wrapper.find('LesMerToggle2');
    expect(lesmertoggle.length).to.equal(1);
    const intro = divs.at(2);
    expect(intro.childAt(0).text()).to.eql('Dette er intro');
    const innhold = divs.at(5);
    expect(innhold.childAt(0).text()).to.eql('innholdstekst');
  });
});

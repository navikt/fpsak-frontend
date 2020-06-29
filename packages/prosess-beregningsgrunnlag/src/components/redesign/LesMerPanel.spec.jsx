import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import Lesmerpanel from './LesmerPanel';

describe('Lesmerpanel', () => {
  it('skal ikke vise lukketekst når er Aapen', () => {
    const wrapper = shallow(
      <Lesmerpanel
        defaultApen
        onClose={() => {}}
        onOpen={() => {}}
        intro="Dette er intro"
        lukkTekst="lukketekst"
        apneTekst="aapnetekst"
      >
        {[<span key={1}>innholdstekst</span>]}
      </Lesmerpanel>,
    );

    expect(wrapper.children()).to.have.length(2);
    const divs = wrapper.find('div');

    const lesmertoggle = wrapper.find('LesMerToggle');
    expect(lesmertoggle.length).to.equal(1);
    const intro = divs.at(2);
    expect(intro.childAt(0).text()).to.eql('Dette er intro');
    const innhold = divs.at(5);
    expect(innhold.childAt(0).text()).to.eql('innholdstekst');
  });
});

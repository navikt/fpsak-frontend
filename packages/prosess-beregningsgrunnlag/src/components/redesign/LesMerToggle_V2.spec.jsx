import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import LesMerToggle from './LesMerToggle_V2';


describe('LesMerToggle', () => {
  it('skal ikke vise lukketekst når er Aapen', () => {
    const wrapper = shallow(<LesMerToggle erApen lukkTekst="lukketekst" apneTekst="aapnetekst" onClick={() => {}} />);
    expect(wrapper.children()).to.have.length(1);
    const tekst = wrapper.find('#linkTekst');
    expect(tekst.childAt(0).text()).to.eql('lukketekst');
  });
  it('skal ikke vise lukketekst når er Lukket', () => {
    const wrapper = shallow(<LesMerToggle erApen={false} lukkTekst="lukktekst" apneTekst="aapnetekst" onClick={() => {}} />);
    expect(wrapper.children()).to.have.length(1);
    const tekst = wrapper.find('#linkTekst');

    expect(tekst.childAt(0).text()).to.eql('aapnetekst');
  });
});

import React from 'react';
import { expect } from 'chai';
import { mountWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import LesMerToggle from './LesMerToggle';

describe('LesMerToggle', () => {
  it('skal ikke vise lukketekst når er Aapen', () => {
    const wrapper = mountWithIntl(<LesMerToggle erApen lukkTekst="lukketekst" apneTekst="aapnetekst" onClick={() => {}} />);
    expect(wrapper.children()).to.have.length(1);
    const divs = wrapper.find('div');
    expect(divs.last().childAt(0).text()).to.eql('lukketekst');
    const chevron = wrapper.find('NavFrontendChevron');
    expect(chevron.props().type).to.eql('opp');
  });
  it('skal ikke vise lukketekst når er Lukket', () => {
    const wrapper = mountWithIntl(<LesMerToggle erApen={false} lukkTekst="lukktekst" apneTekst="aapnetekst" onClick={() => {}} />);
    expect(wrapper.children()).to.have.length(1);
    const divs = wrapper.find('div');
    expect(divs.last().childAt(0).text()).to.eql('aapnetekst');
    const chevron = wrapper.find('NavFrontendChevron');
    expect(chevron.props().type).to.eql('ned');
  });
});

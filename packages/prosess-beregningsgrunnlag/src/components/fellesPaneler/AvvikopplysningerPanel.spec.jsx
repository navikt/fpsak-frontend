import React from 'react';
import { expect } from 'chai';

import { shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import AvviksopplysningerPanel from './AvvikopplysningerPanel';

const beregnetAarsinntekt = 360000;
const sammenligningsgrunnlag = 330000;
const avvik = 25;
const relevanteStatuser = {
  isArbeidstaker: true,
  isSelvstendigNaeringsdrivende: false,
};
const allePerioder = [
  {
    beregningsgrunnlagPrStatusOgAndel: [{}],
  },
];
describe('<Avviksopplysninger>', () => {
  it('Skal teste at riktig componenter blir renderet når AT', () => {
    const wrapper = shallowWithIntl(<AvviksopplysningerPanel
      beregnetAarsinntekt={beregnetAarsinntekt}
      sammenligningsgrunnlag={sammenligningsgrunnlag}
      avvik={avvik}
      relevanteStatuser={relevanteStatuser}
      allePerioder={[{}]}
    />);
    const panel = wrapper.find('PanelBase');
    const headerTitle = panel.find('FormattedMessage').first();
    expect(headerTitle.props().id).to.equal('Beregningsgrunnlag.Avikssopplysninger.ApplicationInformation');
    const avvikPanelAT = wrapper.find('AvviksopplysningerAT');
    expect(avvikPanelAT.props().beregnetAarsinntekt).to.have.equal(360000);
    expect(avvikPanelAT.props().sammenligningsgrunnlag).to.have.equal(330000);
    expect(wrapper.find('AvviksopplysningerSN')).to.have.length(0);
  });
  it('Skal teste at riktig componenter blir renderet når SN', () => {
    relevanteStatuser.isArbeidstaker = false;
    relevanteStatuser.isSelvstendigNaeringsdrivende = true;
    const wrapper = shallowWithIntl(<AvviksopplysningerPanel
      beregnetAarsinntekt={beregnetAarsinntekt}
      sammenligningsgrunnlag={sammenligningsgrunnlag}
      avvik={avvik}
      relevanteStatuser={relevanteStatuser}
      allePerioder={allePerioder}
    />);
    const panel = wrapper.find('PanelBase');
    const headerTitle = panel.find('FormattedMessage').first();
    expect(headerTitle.props().id).to.equal('Beregningsgrunnlag.Avikssopplysninger.ApplicationInformation');
    const avvikPanelSN = wrapper.find('AvviksopplysningerSN');
    expect(avvikPanelSN.props().beregnetAarsinntekt).to.have.equal(360000);
    expect(avvikPanelSN.props().sammenligningsgrunnlag).to.have.equal(330000);
    expect(avvikPanelSN.props().alleAndelerIForstePeriode).to.have.equal(allePerioder[0].beregningsgrunnlagPrStatusOgAndel);
    expect(wrapper.find('AvviksopplysningerAT')).to.have.length(0);
  });
});

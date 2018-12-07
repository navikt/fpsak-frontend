import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { formatCurrencyNoKr } from 'utils/currencyUtils';
import InntektsopplysningerPanel from './InntektsopplysningerPanel';

describe('<InntektsopplysningerPanel>', () => {
  it('Skal se at korrekte verdier settes i undertittlene', () => {
    const beregnetAarsinntekt = 330000;
    const sammenligningsgrunnlag = 300000;
    const avvik = 25;
    const sammenligningsgrunnlagTekst = ['Beregningsgrunnlag.Helptext.Arbeidstaker'];

    const wrapper = shallow(<InntektsopplysningerPanel
      beregnetAarsinntekt={beregnetAarsinntekt}
      sammenligningsgrunnlag={sammenligningsgrunnlag}
      avvik={avvik}
      sammenligningsgrunnlagTekst={sammenligningsgrunnlagTekst}
    />);
    expect(wrapper.find('Element').children().at(1).text()).to.equal(formatCurrencyNoKr(beregnetAarsinntekt));
    expect(wrapper.find('Element').children().at(2).text()).to.equal(formatCurrencyNoKr(sammenligningsgrunnlag));
  });
});

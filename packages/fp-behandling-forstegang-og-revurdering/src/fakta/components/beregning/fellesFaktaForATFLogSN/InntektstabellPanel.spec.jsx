import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import InntektstabellPanel from './InntektstabellPanel';


describe('<InntektstabellPanel>', () => {
  it('skal vise children og skal vise tabell', () => {
    const wrapper = shallow(
      <InntektstabellPanel
        key="inntektstabell"
        hjelpeTekstId="hjelpetekst"
        tabell={<span> tabell </span>}
      >
        <span>test1</span>
        <span>test2</span>
      </InntektstabellPanel>,
    );

    const elementWrapper = wrapper.find('ElementWrapper');
    expect(elementWrapper).has.length(2);
    const children = elementWrapper.first().prop('children');
    expect(children).has.length(2);
    expect(children[0]).has.length(2);
    expect(children[0][0]).is.eql(<span>test1</span>);
    expect(children[0][1]).is.eql(<span>test2</span>);
    const form = elementWrapper.first().find('div');
    expect(form).has.length(1);
  });
});

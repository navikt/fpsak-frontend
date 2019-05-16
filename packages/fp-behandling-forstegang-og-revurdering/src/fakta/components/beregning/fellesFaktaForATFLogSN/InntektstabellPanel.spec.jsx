import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { CheckboxField } from '@fpsak-frontend/form';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { InntektstabellPanelImpl } from './InntektstabellPanel';

const {
  OVERSTYRING_AV_BEREGNINGSGRUNNLAG,
} = aksjonspunktCodes;


describe('<InntektstabellPanel>', () => {
  it('skal vise children og skal vise tabell', () => {
    const wrapper = shallow(
      <InntektstabellPanelImpl
        key="inntektstabell"
        hjelpeTekstId="hjelpetekst"
        tabell={<span> tabell </span>}
        kanOverstyre={false}
        aksjonspunkter={[]}
        readOnly={false}
      >
        <span>test1</span>
        <span>test2</span>
      </InntektstabellPanelImpl>,
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

  it('skal vise checkbox for overstyring', () => {
    const wrapper = shallow(
      <InntektstabellPanelImpl
        key="inntektstabell"
        hjelpeTekstId="hjelpetekst"
        tabell={<span> tabell </span>}
        kanOverstyre
        aksjonspunkter={[]}
        readOnly={false}
      >
        <span>test1</span>
        <span>test2</span>
      </InntektstabellPanelImpl>,
    );
    const checkbox = wrapper.find(CheckboxField);
    expect(checkbox).has.length(1);
  });

  it('checkbox skal vere readOnly når man har overstyring aksjonspunkt', () => {
    const wrapper = shallow(
      <InntektstabellPanelImpl
        key="inntektstabell"
        hjelpeTekstId="hjelpetekst"
        tabell={<span> tabell </span>}
        kanOverstyre
        aksjonspunkter={[{ definisjon: { kode: OVERSTYRING_AV_BEREGNINGSGRUNNLAG } }]}
        readOnly={false}
      >
        <span>test1</span>
        <span>test2</span>
      </InntektstabellPanelImpl>,
    );
    const checkbox = wrapper.find(CheckboxField);
    expect(checkbox).has.length(1);
    expect(checkbox.first().prop('readOnly')).to.equal(true);
  });
});

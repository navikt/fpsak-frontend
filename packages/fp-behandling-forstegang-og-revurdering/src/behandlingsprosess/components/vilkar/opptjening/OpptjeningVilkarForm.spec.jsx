import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import { OpptjeningVilkarFormImpl } from './OpptjeningVilkarForm';
import OpptjeningVilkarView from './OpptjeningVilkarView';
import OpptjeningVilkarAksjonspunktPanel from './OpptjeningVilkarAksjonspunktPanel';

describe('<OpptjeningVilkarForm>', () => {
  it('skal vise OpptjeningVilkarAksjonspunktPanel når en har aksjonspunkt', () => {
    const wrapper = shallow(<OpptjeningVilkarFormImpl
      readOnlySubmitButton
      readOnly
      isAksjonspunktOpen
      hasAksjonspunkt
      submitCallback={sinon.spy()}
    />);

    const aksjonspunktPanel = wrapper.find(OpptjeningVilkarAksjonspunktPanel);
    expect(aksjonspunktPanel).to.have.length(1);
  });

  it('skal vise OpptjeningVilkarView når en ikke har aksjonspunkt', () => {
    const wrapper = shallow(<OpptjeningVilkarFormImpl
      readOnlySubmitButton
      readOnly
      isAksjonspunktOpen={false}
      hasAksjonspunkt={false}
      submitCallback={sinon.spy()}
    />);
    const vilkarView = wrapper.find(OpptjeningVilkarView);
    expect(vilkarView).to.have.length(1);
  });
});

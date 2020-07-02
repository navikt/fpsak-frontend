import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import { InputField } from '@fpsak-frontend/form';
import { BehandlingFormFieldCleaner } from './BehandlingFormFieldCleaner';

describe('BehandlingFormFieldCleaner', () => {
  it('skal rendre alle felt og ikke fjerne noe i redux-state', () => {
    const changeCallback = sinon.spy();
    const wrapper = shallow(
      <BehandlingFormFieldCleaner
        behandlingFormName="TEST_FORM"
        fieldNames={['tomDato', 'fomDato']}
        reduxChange={changeCallback}
      >
        <InputField name="fomDato" />
        <div>
          <InputField name="tomDato" />
        </div>
      </BehandlingFormFieldCleaner>,
    );

    expect(wrapper.find(InputField)).to.have.length(2);
    expect(changeCallback.getCalls()).has.length(0);
  });

  it('skal fjerne fomDato fra redux-state', () => {
    const changeCallback = sinon.spy();
    const wrapper = shallow(
      <BehandlingFormFieldCleaner
        behandlingFormName="TEST_FORM"
        fieldNames={['tomDato', 'fomDato']}
        reduxChange={changeCallback}
      >
        <InputField name="fomDato" />
        <div>
          <InputField name="tomDato" />
        </div>
      </BehandlingFormFieldCleaner>,
    );

    expect(wrapper.find(InputField)).to.have.length(2);
    expect(changeCallback.called).is.false;

    // Fjern fomDato fra DOM
    wrapper.setProps({
      children:
  <div>
    <InputField name="tomDato" />
  </div>,
    });

    const field = wrapper.find(InputField);
    expect(field).to.have.length(1);
    expect(field.prop('name')).to.eql('tomDato');
    expect(changeCallback.getCalls()).has.length(1);
    const { args } = changeCallback.getCalls()[0];
    expect(args).has.length(3);
    expect(args[0]).is.eql('TEST_FORM');
    expect(args[1]).is.eql('fomDato');
    expect(args[2]).is.null;
  });

  it('skal fjerne tomDato fra redux-state', () => {
    const changeCallback = sinon.spy();
    const wrapper = shallow(
      <BehandlingFormFieldCleaner
        behandlingFormName="TEST_FORM"
        fieldNames={['tomDato', 'fomDato']}
        reduxChange={changeCallback}
      >
        <InputField name="fomDato" />
        <div>
          <InputField name="tomDato" />
        </div>
      </BehandlingFormFieldCleaner>,
    );

    expect(wrapper.find(InputField)).to.have.length(2);
    expect(changeCallback.called).is.false;

    // Fjern tomDato fra DOM
    wrapper.setProps({
      children: <InputField name="fomDato" />,
    });

    const field = wrapper.find(InputField);
    expect(field).to.have.length(1);
    expect(field.prop('name')).to.eql('fomDato');
    expect(changeCallback.getCalls()).has.length(1);
    const { args } = changeCallback.getCalls()[0];
    expect(args).has.length(3);
    expect(args[0]).is.eql('TEST_FORM');
    expect(args[1]).is.eql('tomDato');
    expect(args[2]).is.null;
  });

  it('skal fjerne både fomDato og tomDato fra redux-state', () => {
    const changeCallback = sinon.spy();
    const wrapper = shallow(
      <BehandlingFormFieldCleaner
        behandlingFormName="TEST_FORM"
        fieldNames={['tomDato', 'fomDato']}
        reduxChange={changeCallback}
      >
        <InputField name="fomDato" />
        <div>
          <InputField name="tomDato" />
        </div>
      </BehandlingFormFieldCleaner>,
    );

    expect(wrapper.find(InputField)).to.have.length(2);
    expect(changeCallback.called).is.false;

    // Fjern tomDato fra DOM
    wrapper.setProps({
      children: <span />,
    });

    expect(wrapper.find(InputField)).to.have.length(0);
    expect(changeCallback.getCalls()).has.length(2);
    const args1 = changeCallback.getCalls()[0].args;
    expect(args1).has.length(3);
    expect(args1[0]).is.eql('TEST_FORM');
    expect(args1[1]).is.eql('tomDato');
    expect(args1[2]).is.null;
    const args2 = changeCallback.getCalls()[1].args;
    expect(args2).has.length(3);
    expect(args2[0]).is.eql('TEST_FORM');
    expect(args2[1]).is.eql('fomDato');
    expect(args2[2]).is.null;
  });
});

import React from 'react';
import { mountFieldComponent } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { RenderCheckboxField } from './CheckboxField';

chai.use(sinonChai);

describe('<CheckboxField>', () => {
  it('skal kalle onChange med boolsk verdi for checked', () => {
    const onChange = sinon.spy();
    // @ts-ignore Fiks
    const wrapper = mountFieldComponent(<RenderCheckboxField />, { onChange });
    const checkbox = wrapper.find('input');

    checkbox.simulate('change', { target: { checked: true } });

    expect(onChange.called).is.true;
    const { args } = onChange.getCalls()[0];
    expect(args).has.length(1);
    expect(args[0]).is.true;

    checkbox.simulate('change', { target: { checked: false } });

    const args2 = onChange.getCalls()[0].args;
    expect(args2).has.length(1);
    expect(args2[0]).is.true;
  });

  it('skal initialisere checked med verdi fra input', () => {
    // @ts-ignore Fiks
    const wrapperTrue = mountFieldComponent(<RenderCheckboxField />, { value: true });
    const checkboxTrue = wrapperTrue.find('input');

    expect(checkboxTrue.props().checked).to.be.true;

    // @ts-ignore Fiks
    const wrapperFalse = mountFieldComponent(<RenderCheckboxField />, { value: false });
    const checkboxFalse = wrapperFalse.find('input');

    expect(checkboxFalse.props().checked).to.be.false;
  });
});

import React from 'react';
import { mountFieldComponent } from 'testHelpers/redux-form-test-helper';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { RenderCheckboxField } from './CheckboxField';

chai.use(sinonChai);

describe('<CheckboxField>', () => {
  it('skal kalle onChange med boolsk verdi for checked', () => {
    const onChange = sinon.spy();
    const wrapper = mountFieldComponent(<RenderCheckboxField />, { onChange });
    const checkbox = wrapper.find('input');

    checkbox.simulate('change', { target: { checked: true } });

    expect(onChange).to.have.been.calledWith(true);

    checkbox.simulate('change', { target: { checked: false } });

    expect(onChange).to.have.been.calledWith(false);
  });

  it('skal initialisere checked med verdi fra input', () => {
    const wrapperTrue = mountFieldComponent(<RenderCheckboxField />, { value: true });
    const checkboxTrue = wrapperTrue.find('input');

    expect(checkboxTrue.props().checked).to.be.true;

    const wrapperFalse = mountFieldComponent(<RenderCheckboxField />, { value: false });
    const checkboxFalse = wrapperFalse.find('input');

    expect(checkboxFalse.props().checked).to.be.false;
  });
});

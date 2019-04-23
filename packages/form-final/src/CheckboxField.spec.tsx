import React from 'react';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { mountWithIntl, intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { RenderCheckboxField } from './CheckboxField';

chai.use(sinonChai);

const getInputMock = input => ({
  name: 'mockInput',
  onBlur: sinon.spy(),
  onChange: sinon.spy(),
  onDragStart: sinon.spy(),
  onDrop: sinon.spy(),
  onFocus: sinon.spy(),
  ...input,
});

describe('<CheckboxField>', () => {
  it('skal kalle onChange med boolsk verdi for checked', () => {
    const onChange = sinon.spy();
    const wrapper = mountWithIntl(
      <RenderCheckboxField
        intl={intlMock}
        input={getInputMock({ onChange })}
        meta={{}}
        label="field"
      />,
    );

    const checkbox = wrapper.find('input');

    checkbox.simulate('change', { target: { checked: true } });
    expect(onChange).to.have.been.calledWith(true);

    checkbox.simulate('change', { target: { checked: false } });
    expect(onChange).to.have.been.calledWith(false);
  });

  it('skal initialisere checked med verdi fra input', () => {
    const wrapperTrue = mountWithIntl(
      <RenderCheckboxField
        intl={intlMock}
        input={getInputMock({ value: true })}
        meta={{}}
        label="field"
      />,
    );

    const checkboxTrue = wrapperTrue.find('input');
    expect(checkboxTrue.props().checked).to.be.true;

    const wrapperFalse = mountWithIntl(
      <RenderCheckboxField
        intl={intlMock}
        input={getInputMock({ value: false })}
        meta={{}}
        label="field"
      />,
    );

    const checkboxFalse = wrapperFalse.find('input');
    expect(checkboxFalse.props().checked).to.be.false;
  });
});

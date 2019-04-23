import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';

import { shallowWithIntl, intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import renderNavField from './renderNavField';

const metaMock = {};

const getInputMock = input => ({
  name: 'mockInput',
  onBlur: sinon.spy(),
  onChange: sinon.spy(),
  onDragStart: sinon.spy(),
  onDrop: sinon.spy(),
  onFocus: sinon.spy(),
  ...input,
});


const MockField = () => <div />;
const RenderedMockField = renderNavField(MockField).WrappedComponent;


describe('renderNavField', () => {
  it('skal ikke vise feil i utgangspunktet', () => {
    const meta = { ...metaMock, submitFailed: false, error: [{ id: 'ValidationMessage.NotEmpty' }] };

    const wrapper = shallowWithIntl(<RenderedMockField input={getInputMock({})} meta={meta} intl={intlMock} />);
    const mockField = wrapper.find(MockField);

    expect(mockField).to.have.length(1);
    expect(mockField.at(0).props().feil).to.be.undefined;
  });

  it('skal vise feil hvis submit har feilet', () => {
    const meta = { ...metaMock, submitFailed: true, error: [{ id: 'ValidationMessage.NotEmpty' }] };

    const wrapper = shallowWithIntl(<RenderedMockField input={getInputMock({})} meta={meta} intl={intlMock} />);
    const mockField = wrapper.find(MockField);

    expect(mockField).to.have.length(1);
    expect(mockField.at(0).props().feil).to.eql({ feilmelding: 'Feltet må fylles ut' });
  });
});

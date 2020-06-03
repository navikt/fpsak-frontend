import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { inputMock, metaMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';

import renderNavField from './renderNavField';

const MockField = () => <div />;
const RenderedMockField = renderNavField(MockField).WrappedComponent;

const FORMATTED_MESSAGE = 'En formatert melding';
const intl = { ...intlMock, formatMessage: () => FORMATTED_MESSAGE };

describe('renderNavField', () => {
  it('skal ikke vise feil i utgangspunktet', () => {
    const meta = { ...metaMock, submitFailed: false, error: [{ id: 'feil1' }] };

    const wrapper = shallow(<RenderedMockField input={inputMock} meta={meta} intl={intl} label="" />);
    const mockField = wrapper.find(MockField);

    expect(mockField).to.have.length(1);
    expect(mockField.at(0).prop('feil')).to.be.undefined;
  });

  it('skal vise feil hvis submit har feilet', () => {
    const meta = { ...metaMock, submitFailed: true, error: [{ id: 'feil1' }] };

    const wrapper = shallow(<RenderedMockField input={inputMock} meta={meta} intl={intl} label="" />);
    const mockField = wrapper.find(MockField);

    expect(mockField).to.have.length(1);
    expect(mockField.at(0).prop('feil')).to.eql(FORMATTED_MESSAGE);
  });
});

import React from 'react';
import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';
import { expect } from 'chai';

import TextAreaField from 'form/fields/TextAreaField';
import { LagreSoknadPanel } from './LagreSoknadPanel';

const mockProps = {
  intl: intlMock,
  pristine: true,
  reset: () => undefined,
  onSubmitUfullstendigsoknad: () => undefined,
  form: '',
  submitting: false,
};

describe('<LagreSoknadPanel>', () => {
  it('skal vise komponent som default', () => {
    const wrapper = shallowWithIntl(<LagreSoknadPanel {...mockProps} />);
    const infoTextArea = wrapper.find(TextAreaField);
    expect(infoTextArea).to.have.length(1);
  });
});

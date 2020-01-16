import React from 'react';
import { expect } from 'chai';

import { intlMock, shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { TextAreaField } from '@fpsak-frontend/form';

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

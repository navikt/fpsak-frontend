import React from 'react';
import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';
import { expect } from 'chai';

import { TextAreaField } from '@fpsak-frontend/form';
import { TilleggsopplysningerPanel } from './TilleggsopplysningerPanel';

describe('<TilleggsopplysningerPanel>', () => {
  it('skal vise komponent som default', () => {
    const wrapper = shallowWithIntl(<TilleggsopplysningerPanel intl={intlMock} readOnly={false} />);
    const additionalInfo = wrapper.find(TextAreaField);
    expect(additionalInfo).to.have.length(1);
  });
});

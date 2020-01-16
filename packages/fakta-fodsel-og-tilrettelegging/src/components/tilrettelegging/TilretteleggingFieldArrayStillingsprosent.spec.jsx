import React from 'react';
import { expect } from 'chai';
import { DecimalField } from '@fpsak-frontend/form';
import { TilretteleggingFieldArrayStillingsprosent } from './TilretteleggingFieldArrayStillingsprosent';
import shallowWithIntl from '../../../i18n/intl-enzyme-test-helper-fakta-fodsel-og-tilrettelegging';

describe('<TilretteleggingFieldArrayStillingsprosent>', () => {
  it('skal vise felt for stillingsprosent', () => {
    const wrapper = shallowWithIntl(<TilretteleggingFieldArrayStillingsprosent
      readOnly
      tilretteleggingFieldId="1"
      showStillingsprosent
    />);
    const decimalField = wrapper.find(DecimalField);
    expect(decimalField).has.length(1);
  });
  it('skal ikke vise felt for stillingsprosent', () => {
    const wrapper = shallowWithIntl(<TilretteleggingFieldArrayStillingsprosent
      readOnly
      tilretteleggingFieldId="1"
      showStillingsprosent={false}
    />);
    const decimalField = wrapper.find(DecimalField);
    expect(decimalField).has.length(0);
  });
});

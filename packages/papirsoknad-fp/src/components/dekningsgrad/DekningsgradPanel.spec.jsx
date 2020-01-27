import React from 'react';
import { expect } from 'chai';

import { intlMock, shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';

import { DekningsgradPanel } from './DekningsgradPanel';

describe('<DekningsgradPanel>', () => {
  it('skal vise dekningsgradpanel', () => {
    const wrapper = shallowWithIntl(<DekningsgradPanel
      intl={intlMock}
      readOnly={false}
    />);

    const radios = wrapper.find('RadioOption');
    expect(radios).to.have.length(2);
  });
});
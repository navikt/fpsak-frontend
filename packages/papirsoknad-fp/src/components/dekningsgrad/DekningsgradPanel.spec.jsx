import React from 'react';
import { expect } from 'chai';

import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';

import shallowWithIntl from '../../../i18n/intl-enzyme-test-helper-papirsoknad-fp';
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

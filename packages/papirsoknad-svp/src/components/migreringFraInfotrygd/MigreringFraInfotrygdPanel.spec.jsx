import React from 'react';
import { expect } from 'chai';

import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { RadioGroupField } from '@fpsak-frontend/form';

import shallowWithIntl from '../../../i18n/intl-enzyme-test-helper-papirsoknad-svp';
import MigreringFraInfotrygdPanel from './MigreringFraInfotrygdPanel';

describe('<MigreringFraInfotrygdPanel>', () => {
  it('skal rendre komponent korrekt', () => {
    const wrapper = shallowWithIntl(<MigreringFraInfotrygdPanel.WrappedComponent
      intl={intlMock}
      readOnly={false}
    />);

    expect(wrapper.find(RadioGroupField)).to.have.length(1);
  });
});

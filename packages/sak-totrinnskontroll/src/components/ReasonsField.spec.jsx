import React from 'react';
import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { expect } from 'chai';

import ReasonsField from './ReasonsField';
import shallowWithIntl from '../../../fakta-uttak/i18n/intl-enzyme-test-helper-fakta-uttak';

describe('<ReasonsField>', () => {
  it('skal vise korrekt antall element', () => {
    const wrapper = shallowWithIntl(<ReasonsField.WrappedComponent
      fieldName="test"
      showOnlyBegrunnelse={false}
      godkjentHosKA={false}
      intl={intlMock}
    />);

    const navFieldGroup = wrapper.find('NavFieldGroup');
    expect(navFieldGroup).to.have.length(1);

    const radioGroup = wrapper.find('CheckboxField');
    expect(radioGroup).to.have.length(4);
  });
});

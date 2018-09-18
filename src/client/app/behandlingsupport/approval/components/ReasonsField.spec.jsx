import React from 'react';
import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';
import { expect } from 'chai';

import ReasonsField from './ReasonsField';


describe('<ReasonsField>', () => {
  it('skal vise korrekt antall element', () => {
    const wrapper = shallowWithIntl(<ReasonsField.WrappedComponent
      fieldName="test"
      showOnlyBegrunnelse={false}
      intl={intlMock}
    />);

    const navFieldGroup = wrapper.find('NavFieldGroup');
    expect(navFieldGroup).to.have.length(1);

    const radioGroup = wrapper.find('CheckboxField');
    expect(radioGroup).to.have.length(4);
  });
});

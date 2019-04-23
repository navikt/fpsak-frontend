import React from 'react';
import { expect } from 'chai';
import { Form } from 'react-final-form';

import { mountWithIntl, intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import InputField from './InputField';

const mountFieldInForm = (field, initialValues) => mountWithIntl(
  <Form
    onSubmit={() => undefined}
    initialValues={initialValues}
    render={() => (
      <>
        {field}
      </>
    )}
  />,
);

describe('<InputField>', () => {
  it('Skal rendre input', () => {
    const wrapper = mountFieldInForm(<InputField label="text" name="text" type="text" intl={intlMock} />, { text: 'Jeg er Batman' });
    expect(wrapper.find('input')).to.have.length(1);
    expect(wrapper.find('input').prop('value')).to.eql('Jeg er Batman');
    expect(wrapper.find('input').prop('type')).to.eql('text');
    expect(wrapper.find('label').text()).to.eql('text');
  });

  it('Skal rendre Readonly hvis den er satt til true', () => {
    const wrapper = mountFieldInForm(<InputField readOnly name="text" intl={intlMock} />, { text: 'Jeg er Batman' });
    expect(wrapper.find('Normaltekst')).to.have.length(1);
    expect(wrapper.find('Normaltekst').text()).to.eql('Jeg er Batman');
  });
});

import React from 'react';
import { expect } from 'chai';
import { Form } from 'react-final-form';

import { mountWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import TextAreaField from './TextAreaField';

const mountFieldInForm = (field, initialValues = {}) => mountWithIntl(
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

describe('<TextAreaField>', () => {
  it('Skal rendre TextAreaField', () => {
    const wrapper = mountFieldInForm(<TextAreaField name="text" label="name" />);
    expect(wrapper.find('textarea')).to.have.length(1);
  });

  it('Skal rendre TextAreaField som ren tekst hvis readonly', () => {
    const wrapper = mountFieldInForm(<TextAreaField name="text" label="name" readOnly value="text" />, { text: 'tekst' });
    expect(wrapper.find('textarea')).to.have.length(0);
    expect(wrapper.find('div')).to.have.length(1);
    expect(wrapper.find('Label')).to.have.length(1);
    expect(wrapper.find('Label').prop('input')).to.eql('name');
    expect(wrapper.find('Normaltekst')).to.have.length(1);
    expect(wrapper.find('Normaltekst').text()).to.eql('tekst');
  });
});

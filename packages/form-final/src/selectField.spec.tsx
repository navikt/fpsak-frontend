import React from 'react';
import { expect } from 'chai';
import { Form } from 'react-final-form';

import { mountWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import SelectField from './SelectField';

const selectValues = [
  <option value="true" key="option1">Ja</option>,
  <option value="false" key="option2">Nei</option>,
];

const mountFieldInForm = field => mountWithIntl(
  <Form
    onSubmit={() => undefined}
    render={() => (
      <>
        {field}
      </>
    )}
  />,
);

describe('<SelectField>', () => {
  it('Skal rendre select', () => {
    const wrapper = mountFieldInForm(<SelectField label="text" name="text" selectValues={selectValues} />);
    expect(wrapper.find('label').text()).to.eql('text');
    const select = wrapper.find('select');
    expect(select).to.have.length(1);
    expect(select.find('option')).to.have.length(3);
    expect(select.find('option').first().prop('value')).to.eql('');
    expect(select.find('option').first().text()).to.eql(' ');
  });

  it('Skal rendre disabled select', () => {
    const wrapper = mountFieldInForm(<SelectField label="text" name="text" disabled selectValues={selectValues} />);
    expect(wrapper.find('label').text()).to.eql('text');
    const select = wrapper.find('select');
    expect(select).to.have.length(1);
    expect(select.prop('disabled')).to.true;
  });
});

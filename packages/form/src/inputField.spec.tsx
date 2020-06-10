import React from 'react';
import { combineReducers, createStore } from 'redux';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { reducer as formReducer, reduxForm } from 'redux-form';
import { mount } from 'enzyme';
import { expect } from 'chai';
import { messages } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import InputField from './InputField';

const MockForm = reduxForm({ form: 'mock' })(({ handleSubmit, children }) => <form onSubmit={handleSubmit}>{children}</form>);
const mountFieldInForm = (field, initialValues) => mount(
  <Provider store={createStore(combineReducers({ form: formReducer }))}>
    <IntlProvider locale="nb-NO" messages={messages}>
      <MockForm initialValues={initialValues}>
        {field}
      </MockForm>
    </IntlProvider>
  </Provider>,
);

describe('<InputField>', () => {
  it('Skal rendre input', () => {
    const wrapper = mountFieldInForm(<InputField label="text" name="text" type="text" />, { text: 'Jeg er Batman' });
    expect(wrapper.find('input')).to.have.length(1);
    expect(wrapper.find('input').prop('value')).to.eql('Jeg er Batman');
    expect(wrapper.find('input').prop('type')).to.eql('text');
    expect(wrapper.find('label').text()).to.eql('text');
  });
  it('Skal rendre Readonly hvis den er satt til true', () => {
    const wrapper = mountFieldInForm(<InputField readOnly name="text" />, { text: 'Jeg er Batman' });
    expect(wrapper.find('Normaltekst')).to.have.length(1);
    expect(wrapper.find('Normaltekst').text()).to.eql('Jeg er Batman');
  });
});

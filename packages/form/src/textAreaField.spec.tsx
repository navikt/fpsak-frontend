import React from 'react';
import { combineReducers, createStore } from 'redux';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { reducer as formReducer, reduxForm } from 'redux-form';
import { mount } from 'enzyme';
import { expect } from 'chai';
import { messages } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import TextAreaField from './TextAreaField';

const MockForm = reduxForm({ form: 'mock' })(({ handleSubmit, children }) => <form onSubmit={handleSubmit}>{children}</form>);
const mountFieldInForm = (field, initialValues?: object) => mount(
  <Provider store={createStore(combineReducers({ form: formReducer }))}>
    <IntlProvider locale="nb-NO" messages={messages}>
      <MockForm initialValues={initialValues}>
        {field}
      </MockForm>
    </IntlProvider>
  </Provider>,
);

describe('<TextAreaField>', () => {
  it('Skal rendre TextAreaField', () => {
    const wrapper = mountFieldInForm(<TextAreaField name="text" label="name" />);
    expect(wrapper.find('textarea')).to.have.length(1);
  });
  it('Skal rendre TextAreaField som ren tekst hvis readonly', () => {
    const wrapper = mountFieldInForm(<TextAreaField name="text" label="name" readOnly />, { text: 'tekst' });
    expect(wrapper.find('textarea')).to.have.length(0);
    expect(wrapper.find('div')).to.have.length(2);
    expect(wrapper.find('Label')).to.have.length(1);
    expect(wrapper.find('Label').prop('input')).to.eql('name');
    expect(wrapper.find('Normaltekst')).to.have.length(1);
    expect(wrapper.find('Normaltekst').text()).to.eql('tekst');
  });
});

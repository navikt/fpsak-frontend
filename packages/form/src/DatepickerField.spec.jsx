import React from 'react';
import { combineReducers, createStore } from 'redux';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { reducer as formReducer, reduxForm } from 'redux-form';
import { mount } from 'enzyme';
import { expect } from 'chai';
import { messages } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';

import DatepickerField from './DatepickerField';

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

describe('<DatepickerField>', () => {
  it('skal formatere fra ISO-format til norsk datoformat', () => {
    const wrapper = mountFieldInForm(<DatepickerField name="testDato" />, { testDato: '2017-02-01' });

    const input = wrapper.find('Input');
    expect(input).to.have.length(1);
    expect(input.props().value).to.eql('01.02.2017');
  });
});

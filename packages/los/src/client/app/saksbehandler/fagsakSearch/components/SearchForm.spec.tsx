
import React from 'react';
import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';
import { expect } from 'chai';

import { Form } from 'react-final-form';
import sinon from 'sinon';
import { Knapp } from 'nav-frontend-knapper';

import { InputField } from '@fpsak-frontend/form-final';
import { SearchForm } from './SearchForm';

describe('<SearchForm>', () => {
  it('skal ha et søkefelt og en søkeknapp', () => {
    const formProps = { handleSubmit: sinon.spy(), values: { searchString: '' } };
    const wrapper = shallowWithIntl(<SearchForm
      intl={intlMock}
      onSubmit={sinon.spy()}
      searchStarted
      resetSearch={sinon.spy()}
      kanSaksbehandle
    />).find(Form).drill(props => props.render(formProps)).shallow();

    expect(wrapper.find(InputField)).to.have.length(1);
    expect(wrapper.find(Knapp)).to.have.length(1);
  });

  it('skal utføre søk når en trykker på søkeknapp', () => {
    const onButtonClick = sinon.spy();
    const formProps = { handleSubmit: onButtonClick, values: { searchString: '' } };

    const wrapper = shallowWithIntl(<SearchForm
      intl={intlMock}
      onSubmit={onButtonClick}
      searchStarted
      resetSearch={sinon.spy()}
      kanSaksbehandle
    />).find(Form).drill(props => props.render(formProps)).shallow();

    const form = wrapper.find('form');
    form.simulate('submit', { preventDefault() {} });

    expect(onButtonClick).to.have.property('callCount', 1);
  });
});

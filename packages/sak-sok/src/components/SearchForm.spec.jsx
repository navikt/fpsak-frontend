import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';

import { intlMock, shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';

import { SearchFormImpl } from './SearchForm';

describe('<Search>', () => {
  it('skal ha et søkefelt og en søkeknapp', () => {
    const wrapper = shallowWithIntl(<SearchFormImpl
      intl={intlMock}
      searchString=""
      spinner
      searchStarted
      {...reduxFormPropsMock}
    />);

    expect(wrapper.find('InputField')).to.have.length(1);
    expect(wrapper.find('Hovedknapp')).to.have.length(1);
  });

  it('skal utføre søk når en trykker på søkeknapp', () => {
    const onButtonClick = sinon.spy();

    const wrapper = shallowWithIntl(<SearchFormImpl
      intl={intlMock}
      searchString=""
      spinner
      searchStarted
      handleSubmit={onButtonClick}
    />);

    const form = wrapper.find('form');
    form.simulate('submit', { preventDefault() { return undefined; } });

    expect(onButtonClick).to.have.property('callCount', 1);
  });
});

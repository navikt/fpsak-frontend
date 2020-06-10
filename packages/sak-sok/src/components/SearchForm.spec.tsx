import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';

import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';

import { SearchForm } from './SearchForm';
import shallowWithIntl from '../../i18n/intl-enzyme-test-helper-sak-sok';

describe('<Search>', () => {
  it('skal ha et søkefelt og en søkeknapp', () => {
    const wrapper = shallowWithIntl(<SearchForm
      intl={intlMock}
      searchString=""
      searchStarted
      {...reduxFormPropsMock}
    />);

    expect(wrapper.find('InputField')).to.have.length(1);
    expect(wrapper.find('Hovedknapp')).to.have.length(1);
  });

  it('skal utføre søk når en trykker på søkeknapp', () => {
    const onButtonClick = sinon.spy();

    const wrapper = shallowWithIntl(<SearchForm
      intl={intlMock}
      searchString=""
      searchStarted
      {...reduxFormPropsMock}
      handleSubmit={onButtonClick}
    />);

    const form = wrapper.find('form');
    form.simulate('submit', { preventDefault() { return undefined; } });

    expect(onButtonClick).to.have.property('callCount', 1);
  });
});

import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import NotFoundPage from './NotFoundPage';
import ErrorPageWrapper from './components/ErrorPageWrapper';

describe('<NotFoundPage>', () => {
  it('skal rendre NotFoundPage korrekt', () => {
    const wrapper = shallow(<NotFoundPage />);
    expect(wrapper.find(ErrorPageWrapper)).to.have.length(1);
    expect(wrapper.find(FormattedMessage)).to.have.length(1);
    const link = wrapper.find(Link);
    expect(link).to.have.length(1);
    expect(link.prop('to')).to.eql('/');
  });
});

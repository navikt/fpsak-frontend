import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import UnauthorizedPage from './UnauthorizedPage';
import ErrorPageWrapper from './components/ErrorPageWrapper';

describe('<UnauthorizedPage>', () => {
  it('skal rendre UnauthorizedPage korrekt', () => {
    const wrapper = shallow(<UnauthorizedPage />);
    expect(wrapper.find(ErrorPageWrapper)).to.have.length(1);
    expect(wrapper.find(FormattedMessage)).to.have.length(1);
    expect(wrapper.find(Link)).to.have.length(1);
  });
});

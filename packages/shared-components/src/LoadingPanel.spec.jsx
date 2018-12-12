import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import LoadingPanel from './LoadingPanel';

describe('<LoadingPanel>', () => {
  it('skal rendre modal', () => {
    const wrapper = shallow(<LoadingPanel />);

    const spinner = wrapper.find('NavFrontendSpinner');
    expect(spinner).to.have.length(1);
  });
});

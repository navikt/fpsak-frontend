import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import Modal from 'nav-frontend-modal';

import DataFetchPendingModal from './DataFetchPendingModal';

describe('<DataFetchPendingModal>', () => {
  it('skal rendre modal når timer er gått ut', () => {
    const wrapper = shallow(<DataFetchPendingModal pendingMessage="test" />);

    wrapper.setState({ displayMessage: true });

    const modal = wrapper.find(Modal);
    expect(modal).to.have.length(1);
    expect(modal.prop('isOpen')).is.true;
    expect(modal.prop('closeButton')).is.false;
    expect(modal.prop('contentLabel')).is.eql('test');

    expect(wrapper.find('NavFrontendSpinner')).to.have.length(1);
  });

  it('skal ikke rendre modal før timer har gått ut', () => {
    const wrapper = shallow(<DataFetchPendingModal pendingMessage="test" />);
    expect(wrapper.find(Modal)).to.have.length(0);
  });
});

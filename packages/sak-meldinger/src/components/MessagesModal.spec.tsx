import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import Modal from 'nav-frontend-modal';
import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';

import MessagesModal from './MessagesModal';
import shallowWithIntl from '../../i18n/intl-enzyme-test-helper-sak-meldinger';

describe('<MessagesModal>', () => {
  it('skal vise modal', () => {
    const closeCallback = sinon.spy();
    const wrapper = shallowWithIntl(<MessagesModal.WrappedComponent
      showModal
      closeEvent={closeCallback}
      intl={intlMock}
    />);

    const modal = wrapper.find(Modal);
    expect(modal.prop('isOpen')).is.true;
    expect(modal.prop('onRequestClose')).to.eql(closeCallback);
  });
});

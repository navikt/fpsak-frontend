import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { FormattedMessage } from 'react-intl';
import Modal from 'nav-frontend-modal';
import { intlMock, shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import Image from './Image';

import OkAvbrytModal from './OkAvbrytModal';

describe('<OkAvbrytModal>', () => {
  it('skal rendre modal', () => {
    const wrapper = shallowWithIntl(
      <OkAvbrytModal.WrappedComponent
        intl={intlMock}
        textCode="OkAvbrytModal.OpenBehandling"
        showModal
        cancel={sinon.spy()}
        submit={sinon.spy()}
      />,
    );

    const modal = wrapper.find(Modal);
    expect(modal).to.have.length(1);
    expect(modal.prop('isOpen')).is.true;
    expect(modal.prop('contentLabel')).is.eql('OkAvbrytModal.OpenBehandling');

    const image = wrapper.find(Image);
    expect(image).to.have.length(1);
    expect(image.prop('alt')).to.have.length.above(3);

    const message = wrapper.find(FormattedMessage);
    expect(message).to.have.length(1);
    expect(message.prop('id')).is.eql('OkAvbrytModal.OpenBehandling');
  });
});
